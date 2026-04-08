import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PATHS } from "@/paths";
import { HTTP, RESPONSES, SUMMARIES, TAGS } from "../../constants/api";
import { IdParamSchema } from "../../zod/customer.schema";
import { UserPatchSchema } from "../../zod/user.schema";
import { userController } from "./user.controller";

export const userRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.patch(
    PATHS.USERS.BY_ID,
    {
      schema: {
        tags: [TAGS.USER],
        summary: SUMMARIES.UPDATE_USER,
        params: IdParamSchema,
        body: UserPatchSchema,
        response: { [HTTP.OK]: RESPONSES.Updated },
      },
    },
    userController.edit.bind(userController)
  );
};
