import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { customers, invoices, users } from "../../db/schema";
import {
  CustomerSelectType,
  InvoiceSelectType,
  UserInsertType,
  UserSelectType,
} from "../../types/database.type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import createHttpError from "http-errors";
import { mapPostgresError } from "@/utils/mapPostgresError";

export type LoginInput = Pick<UserInsertType, "email" | "password">;

export interface LoginRepository {
  findUserByEmail(email: string): Promise<UserSelectType | undefined>;
  findCustomersByUserId(userId: string): Promise<CustomerSelectType[]>;
  findInvoicesByUserId(userId: string): Promise<InvoiceSelectType[]>;
}

export interface PasswordComparator {
  compare(plainValue: string, hashedValue: string): Promise<boolean>;
}

export interface TokenSigner {
  sign(payload: { email: string; id: string }): string;
}

class DrizzleLoginRepository implements LoginRepository {
  constructor(private readonly dbClient: typeof db) {}
  public async findUserByEmail(email: string): Promise<UserSelectType | undefined> {
    const [user] = await this.dbClient.select().from(users).where(eq(users.email, email));
    return user;
  }

  public async findCustomersByUserId(userId: string): Promise<CustomerSelectType[]> {
    return this.dbClient.select().from(customers).where(eq(customers.userId, userId));
  }

  public async findInvoicesByUserId(userId: string): Promise<InvoiceSelectType[]> {
    return this.dbClient.select().from(invoices).where(eq(invoices.userId, userId));
  }
}

class BcryptPasswordComparator implements PasswordComparator {
  public async compare(plainValue: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(plainValue, hashedValue);
  }
}

class JwtTokenSigner implements TokenSigner {
  public constructor(private readonly secret: string) {}

  public sign(payload: { email: string; id: string }): string {
    return jwt.sign(payload, this.secret, { expiresIn: "1h" });
  }
}

export class LoginService {
  public constructor(
    private readonly loginRepository: LoginRepository,
    private readonly passwordComparator: PasswordComparator,
    private readonly tokenSigner: TokenSigner
  ) {}

  public async execute(data: LoginInput) {
    const user = await this.findUserOrFail(data.email);
    const passwordIsValid = await this.passwordComparator.compare(data.password, user.password);

    if (!passwordIsValid) {
      throw createHttpError.Unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const [customerRecords, invoiceRecords] = await this.loadUserRelations(user.id);
    const token = this.tokenSigner.sign({ email: user.email, id: user.id });
    const { password: _password, ...safeUser } = user;

    return {
      token,
      user: {
        ...safeUser,
        customers: customerRecords,
        invoices: invoiceRecords,
      },
    };
  }

  private async findUserOrFail(email: string): Promise<UserSelectType> {
    let user: UserSelectType | undefined;

    try {
      user = await this.loginRepository.findUserByEmail(email);
    } catch {
      throw createHttpError.InternalServerError(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
    }

    if (!user) {
      throw createHttpError.Unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    return user;
  }

  private async loadUserRelations(
    userId: string
  ): Promise<[CustomerSelectType[], InvoiceSelectType[]]> {
    try {
      return await Promise.all([
        this.loginRepository.findCustomersByUserId(userId),
        this.loginRepository.findInvoicesByUserId(userId),
      ]);
    } catch (err: unknown) {
      mapPostgresError(err);
    }
  }
}

export const createLoginService = (deps: { jwtSecret: string; dbClient: typeof db }) =>
  new LoginService(
    new DrizzleLoginRepository(deps.dbClient),
    new BcryptPasswordComparator(),
    new JwtTokenSigner(deps.jwtSecret)
  );
