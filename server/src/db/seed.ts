// src/db/seed.ts
import { db } from "./client";
import { users, customers, invoices, invoiceItems, products } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const r2 = (n: number) => Math.round(n * 100) / 100;

async function main() {
  const email = "seed@example.com";
  await db.delete(users).where(eq(users.email, email));

  const password = "Password123!";
  const hashedPassword = await bcrypt.hash(password, 10);

  await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({
        email,
        password: hashedPassword,
        phone: "+49 170 1234567",
        address: "Venloer Straße 497",
        city: "Köln",
        zip: "50825",
        country: "Deutschland",
        taxNumber: "DE123456789",
      })
      .returning();

    const [customer] = await tx
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

    const itemsData = [
      { name: "Beratungsleistung", unitPrice: 10.0, quantity: 10 },
      { name: "Softwarelizenz", unitPrice: 0.0, quantity: 1 },
    ];

    const netAmount = r2(itemsData.reduce((s, it) => s + it.unitPrice * it.quantity, 0));
    const vat = 19;
    const grossAmount = r2(netAmount * (1 + vat / 100));

    const [invoice] = await tx
      .insert(invoices)
      .values({
        customerId: customer.id,
        name: "Rechnung #1001",
        invoiceNumber: 1001,
        userId: user.id,
        invoiceDate: "2025-09-08",
        dueDate: "2025-09-30",
        vat,
        netAmount,
        grossAmount,
      })
      .returning();
    const [pConsult] = await tx
      .insert(products)
      .values({
        userId: user.id,
        name: "Beratungsleistung",
        price: 10.0,
      })
      .returning();

    const [pLicense] = await tx
      .insert(products)
      .values({
        userId: user.id,
        name: "Softwarelizenz",
        price: 0.0,
      })
      .returning();

    await tx.insert(invoiceItems).values([
      {
        invoiceId: invoice.id,
        productId: pConsult.id,
        name: pConsult.name,
        unitPrice: pConsult.price,
        quantity: 10,
      },
      {
        invoiceId: invoice.id,
        productId: pLicense.id,
        name: pLicense.name,
        unitPrice: pLicense.price,
        quantity: 1,
      },
    ]);
  });

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
