import { db } from "../db/client";
import { customers } from "../db/schema";
import { CustomerType } from "../types/database.type";

export const handleNewCustomer = async (data: CustomerType) => {
  await db.insert(customers).values(data);
  return { success: true };
};
