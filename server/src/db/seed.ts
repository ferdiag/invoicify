import { db } from "./client";
import { users, customers, invoices, invoiceItems } from "./schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";

async function main() {
  console.log("seeding database");
  const password = "Password123!";
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const [user] = await db
    .insert(users)
    .values({
      email: "seed@example.com",
      password: hashedPassword,
      phone: "+49 170 1234567",
      address: "Venloer straße 497",
      city: "Köln",
      zip: "50825",
      country: "Deutschland",
      taxNumber: "DE123456789",
    })
    .returning();

  const [customer] = await db
    .insert(customers)
    .values({
      name: "success GmbH",
      contact: "Max Maier",
      email: "info@success.de",
      phone: "+49 221 987654",
      address: "Mustermannstraße 25",
      city: "Köln",
      zip: "50670",
      country: "Deutschland",
      userId: user.id,
    })
    .returning();

  const [invoice] = await db
    .insert(invoices)
    .values({
      id: randomUUID(),
      customerId: customer.id,
      name: "Rechnung #1001",
      invoiceNumber: 1001,
      userId: user.id,
      invoiceDate: "2025-09-08",
      dueDate: "2025-09-30",
      vat: 19,
      netAmount: 100.15,
      grossAmount: 119.68,
    })
    .returning();

  await db.insert(invoiceItems).values([
    {
      id: randomUUID(),
      invoiceId: invoice.id,
      name: "Beratungsleistung",
      unitPrice: 10,
      quantity: 10,
    },
    {
      id: randomUUID(),
      invoiceId: invoice.id,
      name: "Softwarelizenz",
      unitPrice: 0,
      quantity: 1,
    },
  ]);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
