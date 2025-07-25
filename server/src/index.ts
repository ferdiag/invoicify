import Fastify from "fastify";
import cors from "@fastify/cors";
import { routes } from "./routes";
import { registerErrorHandler } from "./middleware/registerErrorHandler";
import dotenv from "dotenv";

const fastify = Fastify({
  logger: true,
});
dotenv.config();
async function main() {
  await fastify.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });
  await fastify.register(routes, { prefix: "api" });
  await registerErrorHandler(fastify);

  await fastify.listen({ port: 3000 }, (err, add) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    fastify.log.info(`Server läuft auf ${add}`);
  });
}

main().catch((err) => {
  fastify.log.error(err);
  process.exit(1);
});
