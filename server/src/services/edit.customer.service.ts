import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { customers } from "../db/schema";
import { CustomerType } from "../types/database.type";

export const handleEditCustomer = async (
  id: string,
  body: Partial<CustomerType>
) => {
  const [updatedCustomer] = await db
    .update(customers)
    .set(body)
    .where(eq(customers.id, id))
    .returning();
  return updatedCustomer;
};
