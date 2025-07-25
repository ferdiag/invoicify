import { db } from "../db/client";
import { customers } from "../db/schema";
import { CustomerType } from "../types/database.type";

export const handleAddCustomer = async (data: CustomerType) => {
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
};
