import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users, UserType } from "../db/schema";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import createHttpError from "http-errors";

export const handleEditCompany = async (
  id: string,
  body: Partial<UserType>
) => {
  const [updatedCompany] = await db
    .update(users)
    .set(body)
    .where(eq(users.id, id))
    .returning();
  console.log("body", body, "company", updatedCompany);
  if (!updatedCompany) {
    throw createHttpError.NotFound(ERROR_MESSAGES.NO_CUSTOMER_FOUND_UPDATE);
  }
  return updatedCompany;
};
