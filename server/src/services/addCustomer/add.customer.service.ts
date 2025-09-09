import createHttpError from "http-errors";
import { db } from "../../db/client";
import { customers } from "../../db/schema";
import { CustomerType } from "../../types/database.type";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export const handleAddCustomer = async (
  data: CustomerType
): Promise<{ id: string }> => {
  try {
    const [id] = await db.insert(customers).values(data).returning({
      id: customers.id,
    });
    return id;
  } catch {
    throw createHttpError.InternalServerError(
      ERROR_MESSAGES.DATABASE_QUERY_FAILED
    );
  }
};
