import { z } from "zod/v4";
import { createInsertSchema } from "drizzle-zod";
import { customers } from "../db/schema";

export const CustomerSelectSchema = createInsertSchema(customers);
export const CustomerInsertSchema = createInsertSchema(customers, {
  email: (schema) => schema.email().optional(),
  contact: (schema) => schema.optional(),
  phone: (schema) => schema.optional(),
  address: (schema) => schema.optional(),
  city: (schema) => schema.optional(),
  zip: (schema) => schema.optional(),
  country: (schema) => schema.optional(),
}).omit({ id: true });
export const CustomerPatchSchema = CustomerInsertSchema.partial();
export const IdParamSchema = z.object({ id: z.uuid() });
export type CustomerInsertType = z.infer<typeof CustomerInsertSchema>;
export type CustomerSelectType = z.infer<typeof CustomerSelectSchema>;
export type CustomerPatchType = z.infer<typeof CustomerPatchSchema>;
