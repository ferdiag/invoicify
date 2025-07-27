import { FastifyInstance } from "fastify";
import { handleRegister } from "../services/register.service";
import { Register } from "../types/props.types";

import { handleLogin } from "../services/login.service";
import { handleAddCustomer } from "../services/new.customer.service";
import { CustomerType } from "../types/database.type";
import { handleEditCustomer } from "../services/edit.customer.service";
import { handleDeleteCustomer } from "../services/delete.customer";
import { handleEditCompany } from "../services/edit.company";
import { UserType } from "../db/schema";

export const routes = async (fastify: FastifyInstance) => {
  fastify.post("/register", async (req, res) => {
    const response = await handleRegister(req.body as Register);
    return res.status(201).send(response);
  });
  fastify.post("/login", async (req, res) => {
    const response = await handleLogin(req.body as Register);
    return res.status(201).send(response);
  });
  fastify.post("/customer", async (req, res) => {
    const response = await handleAddCustomer(req.body as CustomerType);
    return res.status(201).send(response);
  });

  fastify.patch<{
    Params: { id: string };
    Body: Partial<CustomerType>;
  }>("/customer/:id", async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const response = await handleEditCustomer(id, body);
    return res.status(200).send(response);
  });
  fastify.delete<{ Params: { id: string } }>(
    "/customer/:id",
    async (req, res) => {
      const { id } = req.params;
      const response = await handleDeleteCustomer(id);
      return res.status(200).send(response);
    }
  );
  fastify.patch<{
    Params: { id: string };
    Body: Partial<UserType>;
  }>("/user/:id", async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    const response = await handleEditCompany(id, body);
    return res.status(200).send(response);
  });
};
