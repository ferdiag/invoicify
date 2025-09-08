// drizzle.config.ts
import { z } from "zod/v4";
import "dotenv/config";
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
});
const parsed = EnvSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("invalid connectionstring for database");
  console.error(parsed.error.format());
  process.exit(1);
}

const env = parsed.data;

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
};
