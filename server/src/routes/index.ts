import { FastifyInstance } from "fastify";
import { handleRegister } from "../services/register.service";
import { Register } from "../types/props.types";

import { handleLogin } from "../services/login.service";
import { handleAddCustomer } from "../services/new.customer.service";
import { CustomerType } from "../types/database.type";
import { handleEditCustomer } from "../services/edit.customer.service";

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
    console.log("edit customer");
    const { id } = req.params;
    const body = req.body;

    const response = await handleEditCustomer(id, body);
    return res.status(200).send(response);
  });
};
