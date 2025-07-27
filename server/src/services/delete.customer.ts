import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { customers } from "../db/schema";
import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const handleDeleteCustomer = async (id: string) => {
  const [deleted]: { id: string }[] = await db
    .delete(customers)
    .where(eq(customers.id, id))
    .returning({ id: customers.id });

  if (!deleted) {
    throw createHttpError.NotFound(ERROR_MESSAGES.NO_CUSTOMER_FOUND_DELETE);
  }
  return { id: deleted.id };
};
