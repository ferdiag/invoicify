import createError from "http-errors";
import bcrypt from "bcrypt";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { UserInsertType } from "../../types/database.type";
import { MESSAGES } from "../../constants/successMessages";

export type RegisterInput = Pick<UserInsertType, "email" | "password">;

type CreateUserInput = {
  email: string;
  password: string;
};

export interface RegisterUserRepository {
  create(data: CreateUserInput): Promise<void>;
}

export interface PasswordHasher {
  hash(value: string, saltRounds: number): Promise<string>;
}

class DrizzleRegisterUserRepository implements RegisterUserRepository {
  public async create(data: CreateUserInput): Promise<void> {
    await db.insert(users).values(data);
  }
}

class BcryptPasswordHasher implements PasswordHasher {
  public async hash(value: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(value, saltRounds);
  }
}

export class RegisterService {
  public constructor(
    private readonly userRepository: RegisterUserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly saltRounds = 10
  ) {}

  public async execute(data: RegisterInput) {
    const { email, password } = data;

    if (!email || !password) {
      throw createError.BadRequest(ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED);
    }

    const hashedPassword = await this.passwordHasher.hash(password, this.saltRounds);

    try {
      await this.userRepository.create({ email, password: hashedPassword });
    } catch (err) {
      this.handlePersistenceError(err);
    }

    return {
      message: MESSAGES.REGISTER,
      email,
    };
  }

  private handlePersistenceError(err: unknown): never {
    const code = this.extractPgCode(err);
    if (code) {
      switch (code) {
        case "23505":
          throw createError.Conflict(ERROR_MESSAGES.EMAIL_EXISTS);
        case "23503":
          throw createError.BadRequest(ERROR_MESSAGES.FOREIGN_KEY_VIOLATION);
        case "23502":
          throw createError.BadRequest(ERROR_MESSAGES.REQUIRED_FIELD_MISSING);
        case "22P02":
          throw createError.BadRequest(ERROR_MESSAGES.INVALID_DATA_FORMAT);
        default:
          throw createError.InternalServerError(ERROR_MESSAGES.UNEXPECTED_DB_ERROR);
      }
    }

    const message = (err as Error)?.message ?? "";
    if (message.includes("duplicate key value") || message.includes("unique constraint")) {
      throw createError.Conflict(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    throw createError.InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }

  private extractPgCode(err: unknown): string | undefined {
    const error = err as { code?: unknown; cause?: { code?: unknown } };
    const code = error?.code ?? error?.cause?.code;
    return typeof code === "string" ? code : undefined;
  }
}

export const registerService = new RegisterService(
  new DrizzleRegisterUserRepository(),
  new BcryptPasswordHasher()
);
