import { FastifyInstance } from "fastify";
import { handleRegister } from "../services/register.service";
import { Register } from "../types/props.types";

import { handleLogin } from "../services/login.service";
import { handleNewCustomer } from "../services/newCustomer.service";
import { CustomerType } from "../types/database.type";

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
    const response = await handleNewCustomer(req.body as CustomerType);
    return res.status(201).send(response);
  });
};
