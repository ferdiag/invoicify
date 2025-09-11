import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { handleRegister } from "../services/register/register.service";
import { handleLogin } from "../services/login/login.service";
import { handleAddCustomer } from "../services/addCustomer/add.customer.service";
import { handleEditCustomer } from "../services/editCostumer/edit.customer.service";
import { handleDeleteCustomer } from "../services/delete.customer/delete.customer.service";
import { handleEditCompany } from "../services/editCompany/edit.company";
import { handleAddInvoice } from "../services/addInvoice/add.invoice.service";

import { AuthSchema } from "../zod/auth.schema";
import { CustomerInsertSchema, CustomerPatchSchema, IdParamSchema } from "../zod/customer.schema";
import { UserPatchSchema } from "../zod/user.schema";
import { InvoiceInsertSchema } from "../zod/invoice.schema";
import { PATHS } from "../../../shared/paths.js";
import { TAGS, HTTP, RESPONSES, SUMMARIES } from "../constants/api";

export const routes: FastifyPluginAsyncZod = async (fastify) => {
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
    async (req, res) => {
      const response = await handleRegister(req.body);
      return res.status(HTTP.CREATED).send(response);
    }
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
    async (req, res) => {
      const response = await handleLogin(req.body);
      return res.status(HTTP.OK).send(response);
    }
  );

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
      const response = await handleAddCustomer(req.body);
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
      const response = await handleEditCustomer(id, body);
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
      await handleDeleteCustomer(id);
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
      const response = await handleEditCompany(id, body);
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
      const response = await handleAddInvoice(data);
      return res.status(HTTP.CREATED).send(response);
    }
  );
};
