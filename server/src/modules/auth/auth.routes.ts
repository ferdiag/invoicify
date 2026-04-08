import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PATHS } from "@/paths";
import { AuthSchema } from "../../zod/auth.schema";
import { HTTP, RESPONSES, SUMMARIES, TAGS } from "../../constants/api";
import { authController } from "./auth.controller";

export const authRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    PATHS.AUTH.REGISTER,
    {
      schema: {
        tags: [TAGS.AUTH],
        summary: SUMMARIES.REGISTER,
        body: AuthSchema,
        response: { [HTTP.CREATED]: RESPONSES.Register },
      },
    },
    authController.register.bind(authController)
  );

  fastify.post(
    PATHS.AUTH.LOGIN,
    {
      schema: {
        tags: [TAGS.AUTH],
        summary: SUMMARIES.LOGIN,
        body: AuthSchema,
        response: { [HTTP.OK]: RESPONSES.Login },
      },
    },
    authController.login.bind(authController)
  );
};
