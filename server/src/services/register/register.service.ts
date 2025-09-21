import createError from "http-errors";
import bcrypt from "bcrypt";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { UserInsertType } from "../../types/database.type";
import { MESSAGES } from "../../constants/successMessages";

function extractPgCode(err: unknown): string | undefined {
  const e = err as { code?: unknown; cause?: { code?: unknown } };
  const code = e?.code ?? e?.cause?.code;
  return typeof code === "string" ? code : undefined;
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
    const code = extractPgCode(err);
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

    // Fallback: auf Message-Matching (z. B. Drizzle ohne code durchgereicht)
    const msg = (err as Error)?.message ?? "";
    if (msg.includes("duplicate key value") || msg.includes("unique constraint")) {
      throw createError.Conflict(ERROR_MESSAGES.EMAIL_EXISTS);
    }

    throw createError.InternalServerError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }

  return {
    message: MESSAGES.REGISTER,
    email,
  };
};
