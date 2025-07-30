import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { customers } from "../db/schema";
import { CustomerType } from "../types/database.type";
import { ERROR_MESSAGES } from "../constants/errorMessages";
import createHttpError from "http-errors";

export const handleEditCustomer = async (
  id: string,
  body: Partial<CustomerType>
) => {
  try {
    const [updatedCustomer] = await db
      .update(customers)
      .set(body)
      .where(eq(customers.id, id))
      .returning();

    if (!updatedCustomer) {
      throw createHttpError.NotFound(ERROR_MESSAGES.NO_CUSTOMER_FOUND_UPDATE);
    }
    return updatedCustomer;
  } catch {
    throw createHttpError.InternalServerError(
      ERROR_MESSAGES.DATABASE_QUERY_FAILED
    );
  }
};
