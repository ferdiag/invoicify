import pkg from "pg";
import { z } from "zod/v4";

const { Pool } = pkg;

import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();
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
const env = EnvSchema.parse(process.env);
const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });
