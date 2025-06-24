import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { customers, users } from "../db/schema";
import { UserType } from "../types/database.type";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const handleLogin = async (data: UserType) => {
  const { email, password } = data;
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    throw new Error(ERROR_MESSAGES.INVALID_CREDENTIALS);
  }

  const token = jwt.sign(
    { email: user.email, id: user.id },
    process.env.JWT_SECRET || "dev secret",
    { expiresIn: "1h" }
  );

  const userCustomers = await db
    .select()
    .from(customers)
    .where(eq(customers.userId, user.id));

  const { password: _, ...userdata } = user;

  return {
    token,
    user: {
      ...userdata,
      customers: userCustomers,
    },
  };
};
