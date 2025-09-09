// src/services/register/register.service.test.ts
jest.mock("../../db/client", () => ({ db: { insert: jest.fn() } }));
jest.mock("bcrypt", () => ({ hash: jest.fn() }));

import createHttpError from "http-errors";
import { db } from "../../db/client";
import bcrypt from "bcrypt";
import { handleRegister } from "./register.service";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { MESSAGES } from "../../constants/successMessages";

const mockInsertResolves = () => {
  (db.insert as jest.Mock).mockReturnValue({
    values: async () => undefined,
  });
};

const mockInsertThrow = (err: any) => {
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
    const password = "SehrSicher!123";

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-123");
    mockInsertResolves();

    const res = await handleRegister({ email, password } as any);

    expect(bcrypt.hash).toHaveBeenCalledWith(password, 10);
    expect(res).toEqual({ message: MESSAGES.REGISTER, email });
  });

  it("missing email or password → 400 BadRequest", async () => {
    const p1 = handleRegister({ email: "", password: "x" } as any);
    await expect(p1).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p1).rejects.toMatchObject({
      status: 400,
      message: ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED,
    });

    const p2 = handleRegister({
      email: "erika.mustermann@example.org",
      password: "",
    } as any);
    await expect(p2).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p2).rejects.toMatchObject({
      status: 400,
      message: ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED,
    });
  });

  it("duplicate email → 409 Conflict", async () => {
    const email = "erika.mustermann@example.org";
    const password = "NochSicherer!456";

    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-456");
    mockInsertThrow(
      new Error("duplicate key value violates unique constraint")
    );

    const p = handleRegister({ email, password } as any);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 409,
      message: ERROR_MESSAGES.EMAIL_EXISTS,
    });
  });
});
