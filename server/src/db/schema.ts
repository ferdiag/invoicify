import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).default(""),
  address: varchar("address", { length: 255 }).default(""),
  city: varchar("city", { length: 100 }).default(""),
  zip: varchar("zip", { length: 20 }).default(""),
  country: varchar("country", { length: 100 }).default(""),
  taxNumer: varchar("taxNumber", { length: 15 }).default(""),
});

export const customers = pgTable("customers", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  contact: varchar("contact", { length: 255 }).default(""),
  email: varchar("email", { length: 255 }).default(""),
  phone: varchar("phone", { length: 50 }).default(""),
  address: varchar("address", { length: 255 }).default(""),
  city: varchar("city", { length: 100 }).default(""),
  zip: varchar("zip", { length: 20 }).default(""),
  country: varchar("country", { length: 100 }).default(""),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
export type UserType = InferSelectModel<typeof users>;
