import { z } from "zod/v4";

export const AuthSchema = z
  .object({
    email: z.email().max(255),
    password: z.string().min(8).max(72),
  })
  .strict();

export const AuthBodyJson = z.toJSONSchema(AuthSchema);
