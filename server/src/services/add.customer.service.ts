import createHttpError from "http-errors";
import { db } from "../db/client";
import { customers } from "../db/schema";
import { CustomerType } from "../types/database.type";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const handleAddCustomer = async (data: CustomerType) => {
  try {
    const [newUser] = await db.insert(customers).values(data).returning({
      id: customers.id,
      name: customers.name,
      contact: customers.contact,
      email: customers.email,
      phone: customers.phone,
      address: customers.address,
      city: customers.city,
      zip: customers.zip,
      country: customers.country,
    });
    return newUser;
  } catch {
    throw createHttpError.InternalServerError(
      ERROR_MESSAGES.DATABASE_QUERY_FAILED
    );
  }
};
