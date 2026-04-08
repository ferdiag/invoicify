import createHttpError from "http-errors";
import {
  PasswordHasher,
  RegisterInput,
  RegisterService,
  RegisterUserRepository,
} from "./register.service";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { MESSAGES } from "../../constants/successMessages";

const createRegisterService = (options?: {
  create?: RegisterUserRepository["create"];
  hash?: PasswordHasher["hash"];
}) => {
  const userRepository: RegisterUserRepository = {
    create: options?.create ?? jest.fn().mockResolvedValue(undefined),
  };
  const passwordHasher: PasswordHasher = {
    hash: options?.hash ?? jest.fn().mockResolvedValue("hashed-123"),
  };

  return {
    service: new RegisterService(userRepository, passwordHasher),
    userRepository,
    passwordHasher,
  };
};

describe("RegisterService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates user → returns message + email", async () => {
    const email = "max.mustermann@example.com";
    const password = "superSicher!123";
    const { service, passwordHasher, userRepository } = createRegisterService();

    const res = await service.execute({ email, password } as RegisterInput);

    expect(passwordHasher.hash).toHaveBeenCalledWith(password, 10);
    expect(userRepository.create).toHaveBeenCalledWith({
      email,
      password: "hashed-123",
    });
    expect(res).toEqual({ message: MESSAGES.REGISTER, email });
  });

  it("missing email or password → 400 BadRequest", async () => {
    const { service } = createRegisterService();

    const p1 = service.execute({ email: "", password: "x" } as RegisterInput);
    await expect(p1).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p1).rejects.toMatchObject({
      status: 400,
      message: ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED,
    });

    const p2 = service.execute({
      email: "erika.mustermann@example.org",
      password: "",
    } as RegisterInput);
    await expect(p2).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p2).rejects.toMatchObject({
      status: 400,
      message: ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED,
    });
  });

  it("duplicate email → 409 Conflict", async () => {
    const email = "erika.mustermann@example.org";
    const password = "NochSicherer!456";
    const { service } = createRegisterService({
      hash: jest.fn().mockResolvedValue("hashed-456"),
      create: jest.fn().mockRejectedValue(
        Object.assign(new Error("duplicates key value violates unique constraint"), {
          cause: { code: "23505" },
        })
      ),
    });

    const p = service.execute({ email, password } as RegisterInput);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 409,
      message: ERROR_MESSAGES.EMAIL_EXISTS,
    });
  });
});
