import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { customers } from "../../db/schema";
import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export const handleDeleteCustomer = async (
  id: string
): Promise<{ id: string }> => {
  try {
    const rows = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning({ id: customers.id });

    if (rows.length === 0) {
      throw createHttpError.NotFound(ERROR_MESSAGES.NO_CUSTOMER_FOUND_DELETE);
    }
    return { id: rows[0].id };
  } catch (err: any) {
    if (
      createHttpError.isHttpError?.(err) ||
      err instanceof createHttpError.HttpError
    ) {
      throw err;
    }
    if (err?.code === "22P02") {
      throw createHttpError.BadRequest("Invalid customer id");
    }
    throw createHttpError.InternalServerError(
      ERROR_MESSAGES.DATABASE_QUERY_FAILED
    );
  }
};
