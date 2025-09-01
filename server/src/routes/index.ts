import {} from "fastify";
import { handleRegister } from "../services/register.service";

import { handleLogin } from "../services/login.service";
import { handleAddCustomer } from "../services/add.customer.service";
import { handleEditCustomer } from "../services/edit.customer.service";
import { handleDeleteCustomer } from "../services/delete.customer";
import { handleEditCompany } from "../services/edit.company";
import { handleAddInvoice } from "../services/add.invoice.service";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { AuthSchema } from "../zod/auth.schema";
import {
  CustomerInsertSchema,
  CustomerPatchSchema,
  IdParamSchema,
} from "../zod/customer.schema";
import { UserPatchSchema } from "../zod/user.schema";
import { InvoiceInsertSchema } from "../zod/invoice.schema";

export const routes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.post(
    "/register",
    { schema: { body: AuthSchema } },
    async (req, res) => {
      const payload = req.body;
      const response = await handleRegister(payload);
      return res.status(201).send(response);
    }
  );
  fastify.post("/login", { schema: { body: AuthSchema } }, async (req, res) => {
    const response = await handleLogin(req.body);
    return res.status(201).send(response);
  });
  fastify.post(
    "/customer",
    { schema: { body: CustomerInsertSchema } },
    async (req, res) => {
      const response = await handleAddCustomer(req.body);
      return res.status(201).send(response);
    }
  );

  fastify.patch(
    "/customer/:id",
    {
      schema: {
        params: IdParamSchema,
        body: CustomerPatchSchema,
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const body = req.body;

      const response = await handleEditCustomer(id, body);
      return res.status(200).send(response);
    }
  );
  fastify.delete(
    "/customer/:id",
    {
      schema: {
        params: IdParamSchema,
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const response = await handleDeleteCustomer(id);
      return res.status(204).send(response); // weil ohne content
    }
  );
  fastify.patch(
    "/user/:id",
    {
      schema: {
        params: IdParamSchema,
        body: UserPatchSchema,
      },
    },
    async (req, res) => {
      const { id } = req.params;
      const body = req.body;

      const response = await handleEditCompany(id, body);
      return res.status(200).send(response);
    }
  );
  fastify.post(
    "/invoice",
    {
      schema: {
        body: InvoiceInsertSchema,
      },
    },
    async (req, res) => {
      const response = await handleAddInvoice(req.body);
      return res.status(201).send(response);
    }
  );
};
