import { InferInsertModel } from "drizzle-orm";
import { customers, users } from "../db/schema";

export type UserType = InferInsertModel<typeof users>;
export type CustomerType = InferInsertModel<typeof customers>;
