// zod/login.response.ts
import { z } from "zod/v4";
import { UserPublicSchema } from "./user.schema";
import { CustomerSelectSchema } from "./customer.schema";
import { InvoiceSelectSchema } from "./invoice.schema";

export const LoginResponseSchema = z
  .object({
    token: z.string(),
    user: UserPublicSchema.extend({
      customers: z.array(CustomerSelectSchema),
      invoices: z.array(InvoiceSelectSchema),
    }),
  })
  .strict();

export const LoginResponseJson = z.toJSONSchema(LoginResponseSchema);
