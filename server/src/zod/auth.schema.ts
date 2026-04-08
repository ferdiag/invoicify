import { z } from "zod/v4";

const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;

export const AuthSchema = z
  .object({
    email: z.email().max(255),
    password: z.string().min(8).max(72).regex(PASSWORD_PATTERN),
  })
  .strict();

export const AuthBodyJson = z.toJSONSchema(AuthSchema);
