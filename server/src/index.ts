import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import {
  ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
} from "fastify-type-provider-zod";
import { routes } from "./routes";
import { registerErrorHandler } from "./middleware/registerErrorHandler";

dotenv.config();

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

async function main() {
  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(routes, { prefix: "/api" });
  await registerErrorHandler(app);

  await app.listen({ port: 3000, host: "0.0.0.0" });
  app.log.info("Server läuft auf http://localhost:3000");
}

main().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
