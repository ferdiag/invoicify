import createError from "http-errors";
import bcrypt from "bcrypt";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { UserInsertType } from "../../types/database.type";
import { MESSAGES } from "../../constants/successMessages";

export const handleRegister = async (data: UserInsertType) => {
  const { email, password } = data;
  if (!email || !password) {
    throw createError.BadRequest(ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = { email, password: hashedPassword };
  try {
    await db.insert(users).values(newUser);
  } catch (err: unknown) {
    const e = err as { code?: string };
    if (e.code === "23505") {
      throw createError.Conflict(ERROR_MESSAGES.EMAIL_EXISTS);
    }
    throw createError.BadGateway(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }

  return {
    message: MESSAGES.REGISTER,
    email,
  };
};
