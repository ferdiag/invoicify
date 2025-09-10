import { z } from "zod/v4";
import { createInsertSchema } from "drizzle-zod";
import { invoices } from "../db/schema";

const toYMD = (d: Date) => d.toISOString().slice(0, 10);
const moneyStr = (n: number) => n.toFixed(2);

export const ProductItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(255),
  quantity: z.coerce.number().int().positive(),
  price: z.coerce
    .number()
    .nonnegative()
    .refine((v) => Math.round(v * 100) === v * 100, "Maximal zwei Nachkommastellen."),
});

export const InvoiceInsertSchema = createInsertSchema(invoices, {
  customerId: (schema) => schema,
  userId: (schema) => schema,
  name: () => z.string().min(1).max(255),
  invoiceDate: () => z.coerce.date().transform(toYMD),
  dueDate: () => z.coerce.date().transform(toYMD),
  vat: () => z.coerce.number(),
  netAmount: () => z.coerce.number().nonnegative().transform(moneyStr),
  grossAmount: () => z.coerce.number().nonnegative().transform(moneyStr),
  products: () => z.array(ProductItemSchema).min(1),
}).omit({ id: true });
