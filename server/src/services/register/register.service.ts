import createError from "http-errors";
import bcrypt from "bcrypt";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { UserInsertType } from "../../types/database.type";
import { MESSAGES } from "../../constants/successMessages";
import { DatabaseError } from "pg";

function isDatabaseError(error: unknown): error is DatabaseError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  );
}
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
  } catch (err) {
    const cause = (err as { cause?: unknown }).cause;

    if (isDatabaseError(cause)) {
      switch (cause.code) {
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

    throw createError.InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }

  return {
    message: MESSAGES.REGISTER,
    email,
  };
};
