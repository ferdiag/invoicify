import { z } from "zod/v4";

export const loadEnv = () => {
  const EnvSchema = z.object({
    DATABASE_URL: z
      .string()
      .trim()
      .refine(
        (val) => {
          try {
            new URL(val);
            return true;
          } catch {
            return false;
          }
        },
        { message: "DATABASE_URL must be a valid URL" }
      ),
    JWT_SECRET: z.string().trim().min(1, "JWT_SECRET is required"),
  });
  const env = EnvSchema.parse(process.env);
  return env;
};
export type Env = z.infer<typeof loadEnv>;
