import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { loadEnv } from "../config/env";

declare module "fastify" {
  interface FastifyRequest {
    user?: { id: string; email?: string };
  }
}

export default async function auth(app: FastifyInstance) {
  const env = loadEnv();

  app.decorate("authenticate", async (request: FastifyRequest, reply: FastifyReply) => {
    const header = request.headers.authorization;
    if (!header) {
      app.log.warn("Missing Authorization header");
      return reply
        .code(401)
        .send({ error: "Unauthorized", message: "Missing Authorization header" });
    }

    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      app.log.warn(`Invalid Authorization format: ${header.substring(0, 20)}...`);
      return reply
        .code(401)
        .send({ error: "Unauthorized", message: "Invalid Authorization format" });
    }

    try {
      const payload = jwt.verify(match[1], env.JWT_SECRET) as {
        id: string;
        email?: string;
      };
      if (!payload.id) {
        throw new Error("Token missing user id");
      }
      request.user = { id: payload.id, email: payload.email };
    } catch (error) {
      const msg =
        error instanceof jwt.TokenExpiredError
          ? "Token expired"
          : error instanceof jwt.JsonWebTokenError
            ? "Invalid token"
            : "Authentication failed";
      app.log.warn(`Auth failed: ${msg}`);
      return reply.code(401).send({ error: "Unauthorized", message: msg });
    }
  });
}
