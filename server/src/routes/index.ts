import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { authRoutes } from "../modules/auth/auth.routes";
import { addCustomerService } from "../services/addCustomer/add.customer.service";
import { editCustomerService } from "../services/editCostumer/edit.customer.service";
import { deleteCustomerService } from "../services/delete.customer/delete.customer.service";
import { editCompanyService } from "../services/editCompany/edit.company";
import { addInvoiceService } from "../services/addInvoice/add.invoice.service";

import { CustomerInsertSchema, CustomerPatchSchema, IdParamSchema } from "../zod/customer.schema";
import { UserPatchSchema } from "../zod/user.schema";
import { InvoiceInsertSchema } from "../zod/invoice.schema";
import { PATHS } from "@/paths";
import { TAGS, HTTP, RESPONSES, SUMMARIES } from "../constants/api";

export const routes: FastifyPluginAsyncZod = async (fastify) => {
  await fastify.register(authRoutes);

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
    async (req, res) => {
      const response = await addCustomerService.execute(req.body);
      return res.status(HTTP.CREATED).send(response);
    }
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
    async (req, res) => {
      const { id } = req.params;
      const body = req.body;
      const response = await editCustomerService.execute(id, body);
      return res.status(HTTP.OK).send(response);
    }
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
    async (req, res): Promise<void> => {
      const { id } = req.params;
      await deleteCustomerService.execute(id);
      return res.status(HTTP.NO_CONTENT).send();
    }
  );

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
    async (req, res) => {
      const { id } = req.params;
      const body = req.body;
      const response = await editCompanyService.execute(id, body);
      return res.status(HTTP.OK).send(response);
    }
  );

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
    async (req, res) => {
      const data = req.body;
      const response = await addInvoiceService.execute(data);
      return res.status(HTTP.CREATED).send(response);
    }
  );
};
