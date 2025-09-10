import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { customers, invoices, users } from "../db/schema";

export type UserInsertType = InferInsertModel<typeof users>;
export type UserSelectType = InferInsertModel<typeof users>;

export type CustomerType = InferInsertModel<typeof customers>;
export type UserType = InferSelectModel<typeof users>;
export type InvoiceInsertType = InferInsertModel<typeof invoices>;
