import { FastifyError, FastifyInstance } from "fastify";
import { isHttpError } from "http-errors";
import { HTTP_CODES } from "../constants/httpCodes";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError, _req, reply) => {
    if (isHttpError(error)) {
      return reply
        .status(error.statusCode || HTTP_CODES.INTERNAL_SERVER_ERROR)
        .send({
          error: error.name,
          message: error.message,
        });
    }
    return reply.status(HTTP_CODES.INTERNAL_SERVER_ERROR).send({
      error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      message: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
    });
  });
}
