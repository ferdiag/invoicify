import pkg from "pg";

const { Pool } = pkg;

import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import dotenv from "dotenv";
import { loadEnv } from "@/config/env";

dotenv.config();
const env = loadEnv();
export class DatabaseClient {
  private drizzleDB;
  constructor(pool: InstanceType<typeof Pool>) {
    this.drizzleDB = drizzle(pool, { schema });
  }
  getDrizzleInstance() {
    return this.drizzleDB;
  }
}

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const databaseClient = new DatabaseClient(pool);
export const db = databaseClient.getDrizzleInstance();
