import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { customers, invoices, users } from "../../db/schema";
import { UserInsertType, UserSelectType } from "../../types/database.type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import createHttpError from "http-errors";

export const handleLogin = async (data: UserInsertType) => {
  const { email, password } = data;
  console.log("authData", email, password);
  let user: UserSelectType | undefined;

  try {
    [user] = await db.select().from(users).where(eq(users.email, email));
  } catch {
    throw createHttpError.InternalServerError(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
  }

  if (!user) {
    throw createHttpError.Unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    throw createHttpError.Unauthorized(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const token = jwt.sign(
    { email: user.email, id: user.id },
    process.env.JWT_SECRET || "dev secret",
    { expiresIn: "1h" }
  );

  const targetCustomer = await db.select().from(customers).where(eq(customers.userId, user.id!));

  const { password: _, ...userdata } = user;
  const targetInvoices = await db.select().from(invoices).where(eq(invoices.userId, user.id!));

  return {
    token,
    user: {
      ...userdata,
      customers: targetCustomer,
      invoices: targetInvoices,
    },
  };
};
