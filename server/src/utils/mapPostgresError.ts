import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../constants/errorMessages";

interface PostgresError {
  code?: string;
}

export function mapPostgresError(err: unknown): never {
  if (createHttpError.isHttpError(err)) {
    throw err;
  }

  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as PostgresError).code;

    switch (code) {
      case "23505":
        throw createHttpError.Conflict(ERROR_MESSAGES.EMAIL_EXISTS);
      case "23503":
        throw createHttpError.BadRequest(ERROR_MESSAGES.FOREIGN_KEY_VIOLATION);
      case "23502":
        throw createHttpError.BadRequest(ERROR_MESSAGES.REQUIRED_FIELD_MISSING);
      case "22P02":
        throw createHttpError.BadRequest(ERROR_MESSAGES.INVALID_CUSTOMER_ID);
    }
  }

  throw createHttpError.InternalServerError(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
}
