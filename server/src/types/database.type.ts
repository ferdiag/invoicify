import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { customers, invoices, users } from "../db/schema";

export type UserInsertType = InferInsertModel<typeof users>;
export type UserSelectType = InferSelectModel<typeof users>;

export type CustomerInsertType = InferInsertModel<typeof customers>;
export type InvoiceInsertType = InferInsertModel<typeof invoices>;
