import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { users } from "../db/schema";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import createHttpError from "http-errors";
import { UserType } from "../types/database.type";

export const handleEditCompany = async (
  id: string,
  body: Partial<UserType>
) => {
  try {
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
  } catch (error) {
    throw createHttpError.InternalServerError(
      ERROR_MESSAGES.DATABASE_QUERY_FAILED
    );
  }
};
