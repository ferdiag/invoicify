import {
  integer,
  jsonb,
  numeric,
  pgTable,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

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
export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  customerId: uuid("customer_Id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  invoiceDate: varchar("invoice_date").notNull(),
  dueDate: varchar("due_date").notNull(),

  vat: integer("vat").notNull(),
  netAmount: numeric("net_amount", { precision: 10, scale: 2 }).notNull(),
  grossAmount: numeric("gross_amount", { precision: 10, scale: 2 }).notNull(),

  products: jsonb("products").notNull(), // Array als JSON speichern
});
