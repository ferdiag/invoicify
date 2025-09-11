import { z } from "zod/v4";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { invoices } from "../db/schema";

export const ProductItemSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1).max(255),
    quantity: z.number().int().positive(),
    price: z
      .number()
      .nonnegative()
      .refine((v) => Math.round(v * 100) === v * 100, "Maximal zwei Nachkommastellen."),
  })
  .strict();

const YMD = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format YYYY-MM-DD");

const Money = z
  .number()
  .nonnegative()
  .refine((v) => Math.round(v * 100) === v * 100, "Maximal zwei Nachkommastellen.");

export const InvoiceInsertSchema = createInsertSchema(invoices, {
  customerId: (s) => s,
  userId: (s) => s,
  name: () => z.string().min(1).max(255),
  invoiceDate: () => YMD,
  dueDate: () => YMD,
  vat: () => z.number().min(0).max(100),
  netAmount: () => Money,
  grossAmount: () => Money,
  products: () => z.array(ProductItemSchema).min(1),
})
  .omit({ id: true })
  .strict();

export const InvoiceInsertJson = z.toJSONSchema(InvoiceInsertSchema);

export const InvoiceSelectSchema = createSelectSchema(invoices, {
  products: () => z.array(ProductItemSchema),
}).strict();

export const InvoiceSelectJson = z.toJSONSchema(InvoiceSelectSchema);
