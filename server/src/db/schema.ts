import { integer, numeric, pgTable, uuid, varchar, index, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  company: varchar("company", { length: 255 }).default(""),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).default(""),
  address: varchar("address", { length: 255 }).default(""),
  city: varchar("city", { length: 100 }).default(""),
  zip: varchar("zip", { length: 20 }).default(""),
  country: varchar("country", { length: 100 }).default(""),
  taxNumber: varchar("taxNumber", { length: 15 }).default(""),
});

export const customers = pgTable(
  "customers",
  {
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
  },
  (t) => ({
    byUserIdx: index("customers_user_idx").on(t.userId),
    uniquePerUser: uniqueIndex("customers_unique_user_email").on(t.userId, t.email),
  })
);

export const products = pgTable(
  "products",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    price: numeric("unit_price", { precision: 10, scale: 2 }).notNull().$type<number>(),
  },
  (t) => ({
    byUserIdx: index("products_user_idx").on(t.userId),
  })
);

export const invoices = pgTable(
  "invoices",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),
    name: varchar("name").notNull(),
    invoiceNumber: integer("invoiceNumber").notNull(),
    userId: uuid("user_Id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    invoiceDate: varchar("invoice_date").notNull(),
    dueDate: varchar("due_date").notNull(),
    vat: integer("vat").notNull(),
    netAmount: numeric("net_amount", { precision: 10, scale: 2 }).notNull().$type<number>(),
    grossAmount: numeric("gross_amount", { precision: 10, scale: 2 }).notNull().$type<number>(),
  },
  (t) => ({
    byUserIdx: index("invoices_user_idx").on(t.userId),
    byCustomerIdx: index("invoices_customer_idx").on(t.customerId),
    byDateIdx: index("invoices_date_idx").on(t.invoiceDate),
    uniqueNumberPerUser: uniqueIndex("invoices_unique_user_number").on(t.userId, t.invoiceNumber),
  })
);

export const invoiceItems = pgTable(
  "invoice_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    invoiceId: uuid("invoice_id")
      .notNull()
      .references(() => invoices.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull().$type<number>(),
    quantity: integer("quantity").notNull(),
  },
  (t) => ({
    byInvoiceIdx: index("invoice_items_invoice_idx").on(t.invoiceId),
    byProductIdx: index("invoice_items_product_idx").on(t.productId),
  })
);

export const usersRelations = relations(users, ({ many }) => ({
  customers: many(customers),
  invoices: many(invoices),
  products: many(products),
}));
export const customersRelations = relations(customers, ({ one, many }) => ({
  user: one(users, { fields: [customers.userId], references: [users.id] }),
  invoices: many(invoices),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  user: one(users, { fields: [invoices.userId], references: [users.id] }),
  customer: one(customers, { fields: [invoices.customerId], references: [customers.id] }),
  items: many(invoiceItems),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  user: one(users, { fields: [products.userId], references: [users.id] }),
  invoiceItems: many(invoiceItems),
}));

export const invoiceItemsRelations = relations(invoiceItems, ({ one }) => ({
  invoice: one(invoices, { fields: [invoiceItems.invoiceId], references: [invoices.id] }),
  product: one(products, { fields: [invoiceItems.productId], references: [products.id] }),
}));
