import { z } from "zod/v4";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { customers } from "../db/schema";

export const CustomerSelectSchema = createSelectSchema(customers).strict();

export const CustomerInsertSchema = createInsertSchema(customers, {
  email: (s) => s.email().optional(),
  contact: (s) => s.optional(),
  phone: (s) => s.optional(),
  address: (s) => s.optional(),
  city: (s) => s.optional(),
  zip: (s) => s.optional(),
  country: (s) => s.optional(),
})
  .omit({ id: true })
  .strict();

export const CustomerPatchSchema = CustomerInsertSchema.partial().strict();
export const IdParamSchema = z.object({ id: z.uuid() }).strict();

export type CustomerInsertType = z.infer<typeof CustomerInsertSchema>;
export type CustomerSelectType = z.infer<typeof CustomerSelectSchema>;
export type CustomerPatchType = z.infer<typeof CustomerPatchSchema>;

export const CustomerSelectJson = z.toJSONSchema(CustomerSelectSchema);
