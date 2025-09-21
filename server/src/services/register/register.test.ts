// src/services/register/register.service.test.ts
jest.mock("../../db/client", () => ({ db: { insert: jest.fn() } }));
jest.mock("bcrypt", () => ({ hash: jest.fn() }));

import createHttpError from "http-errors";
import { db } from "../../db/client";
import bcrypt from "bcrypt";
import { handleRegister } from "./register.service";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { MESSAGES } from "../../constants/successMessages";
import { UserInsertType } from "../../types/database.type";

const mockInsertResolves = () => {
  (db.insert as jest.Mock).mockReturnValue({
    values: async () => undefined,
  });
};

const mockInsertThrow = (err: unknown) => {
  (db.insert as jest.Mock).mockImplementation(() => {
    throw err;
  });
};

describe("handleRegister", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates user → returns message + email", async () => {
    const email = "max.mustermann@example.com";
    const password = "superSicher!123";

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-123");
    mockInsertResolves();

    const res = await handleRegister({ email, password } as UserInsertType);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(res).toEqual({ message: MESSAGES.REGISTER, email });
  });

  it("missing email or password → 400 BadRequest", async () => {
    const p1 = handleRegister({ email: "", password: "x" } as UserInsertType);
    await expect(p1).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p1).rejects.toMatchObject({
      status: 400,
      message: ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED,
    });

    const p2 = handleRegister({
      email: "erika.mustermann@example.org",
      password: "",
    } as UserInsertType);
    await expect(p2).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p2).rejects.toMatchObject({
      status: 400,
      message: ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED,
    });
  });

  it("duplicate email → 409 Conflict", async () => {
    const email = "erika.mustermann@example.org";
    const password = "NochSicherer!456";
    mockInsertThrow(
      Object.assign(new Error("duplicates key value violates unique constraint"), {
        cause: { code: "23505" },
      })
    );
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-456");

    const p = handleRegister({ email, password } as UserInsertType);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 409,
      message: ERROR_MESSAGES.EMAIL_EXISTS,
    });
  });
});
