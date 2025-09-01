import { z } from "zod/v4";

export const AuthSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
export type Register = z.infer<typeof AuthSchema>;
