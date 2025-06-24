import createError from "http-errors";
import bcrypt from "bcrypt";
import { Register } from "../types/props.types";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import { db } from "../db/client";
import { users } from "../db/schema";
import { UserType } from "../types/database.type";
import type { FastifyBaseLogger } from "fastify";

export const handleRegister = async (
  data: Register,
  log: FastifyBaseLogger
) => {
  const { email, password } = data;
  if (!email || !password) {
    throw createError.BadRequest(ERROR_MESSAGES.EMAIL_OR_PASSWORD_REQUIRED);
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const newUser = { email, password: hashedPassword } as UserType;
  try {
    await db.insert(users).values(newUser);
  } catch (error: any) {
    console.log("fehler", error);

    throw createError.Conflict("Diese E-Mail ist bereits registriert.");
  }

  return {
    message: "Nutzer erfolgreich registriert",
    email,
  };
};
