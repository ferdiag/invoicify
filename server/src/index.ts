import Fastify from "fastify";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { z } from "zod";
import {
  ZodTypeProvider,
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { routes } from "./routes";
import { registerErrorHandler } from "./middleware/registerErrorHandler";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import pdfRoute from "./routes/invoice.pdf.route";

dotenv.config();

const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

async function main() {
  await app.register(cors, {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  });
  app.register(swagger, {
    openapi: {
      openapi: "3.1.0",
      info: { title: "Auth API", version: "1.0.0" },
      servers: [{ url: "http://localhost:3000" }],
    },
    transform: jsonSchemaTransform,
  });
  app.withTypeProvider<ZodTypeProvider>();

  app.register(swaggerUI, { routePrefix: "/docs" });
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(routes, { prefix: "/api" });
  app.register(pdfRoute);
  await registerErrorHandler(app);
  const EnvSchema = z.object({
    PORT: z.coerce.number().default(3000),
    HOST: z.string().default("0.0.0.0"),
  });
  const env = EnvSchema.parse(process.env);
  await app.listen({ port: env.PORT, host: env.HOST });

  app.log.info("Server läuft auf http://localhost:3000");
}

main().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
