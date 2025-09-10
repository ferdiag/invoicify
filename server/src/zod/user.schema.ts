import { createInsertSchema } from "drizzle-zod";
import { users } from "../db/schema";
import { z } from "zod/v4";
import { LIMITS, MSG } from "../constants/limits";

export const UserInsertSchema = createInsertSchema(users, {
  email: z.string().email().max(255, MSG.tooLong("E-Mail", LIMITS.email)).optional(),
  password: z.string().max(72, MSG.tooLong("Password", LIMITS.passwordMax)).optional(),
  company: z.string().max(255, MSG.tooLong("Firma", 255)).optional(), // <-- hinzugefügt
  phone: z.string().max(50, MSG.tooLong("Telefonnummer", LIMITS.phone)).optional(),
  address: z.string().max(255, MSG.tooLong("Adresse", LIMITS.address)),
  city: z.string().max(100, MSG.tooLong("Stadt", LIMITS.city)).optional(),
  zip: z.string().max(20, MSG.tooLong("Postleitzahl", LIMITS.zip)).optional(),
  country: z.string().max(100, MSG.tooLong("Land", LIMITS.country)).optional(),
  taxNumber: z.string().max(15, MSG.tooLong("Steuernummer", LIMITS.taxNumber)).optional(),
}).omit({ id: true });

export const UserPatchSchema = UserInsertSchema.partial();

export type UserPatchType = z.infer<typeof UserPatchSchema>;
