import createHttpError from "http-errors";
import { db } from "../../db/client";
import { customers } from "../../db/schema";
import { CustomerInsertType } from "../../types/database.type";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export const handleAddCustomer = async (data: CustomerInsertType): Promise<{ id: string }> => {
  try {
    const [id] = await db.insert(customers).values(data).returning({
      id: customers.id,
    });
    return id;
  } catch {
    throw createHttpError.InternalServerError(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
  }
};
