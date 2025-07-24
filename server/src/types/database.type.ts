import { InferInsertModel } from "drizzle-orm";
import { customers, users } from "../db/schema";

export type UserInsertType = InferInsertModel<typeof users>;
export type UserSelectType = InferInsertModel<typeof users>;

export type CustomerType = InferInsertModel<typeof customers>;
