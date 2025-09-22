import { z } from "zod/v4";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { invoices } from "../db/schema";
import { Money } from "./helpers/Money";
import { YMD } from "./helpers/Date";

export const InvoiceInsertSchema = createInsertSchema(invoices, {
  customerId: () => z.string().uuid(),
  userId: () => z.string().uuid(),
  name: () => z.string().min(1).max(255),
  invoiceNumber: () => z.number().int().nonnegative(),
  invoiceDate: () => YMD,
  dueDate: () => YMD,
  vat: () => z.number().int().min(0).max(100),
  netAmount: () => Money,
  grossAmount: () => Money,
})
  .omit({ id: true })
  .strict();

export const InvoiceInsertJson = z.toJSONSchema(InvoiceInsertSchema);

export const InvoiceSelectSchema = createSelectSchema(invoices).strict();

export const InvoiceSelectJson = z.toJSONSchema(InvoiceSelectSchema);

export const InvoiceWithItemsInsertSchema = InvoiceInsertSchema.extend({
  items: z.array(InvoiceInsertSchema).min(1),
});
