import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { customers } from "../../db/schema";
import createHttpError, { HttpError } from "http-errors";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export const handleDeleteCustomer = async (id: string): Promise<{ id: string }> => {
  try {
    const rows = await db
      .delete(customers)
      .where(eq(customers.id, id))
      .returning({ id: customers.id });

    if (rows.length === 0) {
      throw new createHttpError.NotFound(ERROR_MESSAGES.NO_CUSTOMER_FOUND_DELETE);
    }

    return { id: rows[0].id };
  } catch (err: unknown) {
    // bereits ein HttpError? → direkt weiterwerfen
    if (err instanceof HttpError || createHttpError.isHttpError(err)) {
      throw err;
    }

    // Postgres: invalid_text_representation (uuid parse error)
    if (typeof err === "object" && err !== null && "code" in err) {
      const code = (err as { code?: string }).code;
      if (code === "22P02") {
        throw new createHttpError.BadRequest(ERROR_MESSAGES.INVALID_CUSTOMER_ID);
      }
    }

    throw new createHttpError.InternalServerError(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
  }
};
