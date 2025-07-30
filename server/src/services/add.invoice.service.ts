import createHttpError from "http-errors";
import { db } from "../db/client";
import { invoices } from "../db/schema";
import { InvoiceType } from "../types/database.type";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const handleAddInvoice = async (data: InvoiceType) => {
  try {
    const [added] = await db.insert(invoices).values(data).returning();
    return added;
  } catch (error) {
    console.log(error);
    throw createHttpError.InternalServerError(
      ERROR_MESSAGES.DATABASE_QUERY_FAILED
    );
  }
};
