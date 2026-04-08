import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PATHS } from "@/paths";
import { HTTP, RESPONSES, SUMMARIES, TAGS } from "../../constants/api";
import {
  CustomerInsertSchema,
  CustomerPatchSchema,
  IdParamSchema,
} from "../../zod/customer.schema";
import { customerController } from "./customer.controller";

export const customerRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    PATHS.CUSTOMERS.ROOT,
    {
      schema: {
        tags: [TAGS.CUSTOMER],
        summary: SUMMARIES.CREATE_CUSTOMER,
        body: CustomerInsertSchema,
        response: { [HTTP.CREATED]: RESPONSES.Id },
      },
    },
    customerController.add.bind(customerController)
  );

  fastify.patch(
    PATHS.CUSTOMERS.BY_ID,
    {
      schema: {
        tags: [TAGS.CUSTOMER],
        summary: SUMMARIES.UPDATE_CUSTOMER,
        params: IdParamSchema,
        body: CustomerPatchSchema,
        response: { [HTTP.OK]: RESPONSES.Updated },
      },
    },
    customerController.edit.bind(customerController)
  );

  fastify.delete(
    PATHS.CUSTOMERS.BY_ID,
    {
      schema: {
        tags: [TAGS.CUSTOMER],
        summary: SUMMARIES.DELETE_CUSTOMER,
        params: IdParamSchema,
        response: { [HTTP.NO_CONTENT]: RESPONSES.NoContent },
      },
    },
    customerController.delete.bind(customerController)
  );
};
