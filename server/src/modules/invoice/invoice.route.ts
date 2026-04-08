import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PATHS } from "@/paths";
import { HTTP, RESPONSES, SUMMARIES, TAGS } from "../../constants/api";
import { InvoiceInsertSchema } from "../../zod/invoice.schema";
import { invoiceController } from "./invoice.controller";

export const invoiceRoutes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    PATHS.INVOICES.ROOT,
    {
      schema: {
        tags: [TAGS.INVOICE],
        summary: SUMMARIES.CREATE_INVOICE,
        body: InvoiceInsertSchema,
        response: { [HTTP.CREATED]: RESPONSES.Id },
      },
    },
    invoiceController.add.bind(invoiceController)
  );
};
