import { z } from "zod/v4";

export const TAGS = {
  AUTH: "Auth",
  CUSTOMER: "Customer",
  USER: "User",
  INVOICE: "Invoice",
} as const;

export const HTTP = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const SUMMARIES = {
  REGISTER: "Register new user",
  LOGIN: "Login user",
  CREATE_CUSTOMER: "Create new customer",
  UPDATE_CUSTOMER: "Update customer",
  DELETE_CUSTOMER: "Delete customer",
  UPDATE_USER: "Update user",
  CREATE_INVOICE: "Create new invoice",
} as const;

export const RESPONSES = {
  Id: z.object({ id: z.string() }),
  Register: z.object({ email: z.email().max(255), message: z.string() }),
  Login: z.object({ user: z.unknown(), token: z.string() }),
  Updated: z.object({ id: z.string() }),
  NoContent: z.null(),
} as const;
