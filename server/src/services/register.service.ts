import createError from "http-errors";
import bcrypt from "bcrypt";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { db } from "../db/client";
import { users } from "../db/schema";
import { UserInsertType } from "../types/database.type";
import { MESSAGES } from "../constants/successMessages";
import { Register } from "../zod/auth.schema";

export const handleRegister = async (data: Register) => {
  const { email, password } = data;
  if (!email || !password) {
    throw createError.BadRequest(ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = { email, password: hashedPassword } as UserInsertType;
  try {
    await db.insert(users).values(newUser);
  } catch (error: any) {
    throw createError.Conflict(ERROR_MESSAGES.EMAIL_EXISTS);
  }

  return {
    message: MESSAGES.REGISTER,
    email,
  };
};
