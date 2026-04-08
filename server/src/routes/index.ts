import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { authRoutes } from "../modules/auth/auth.routes";
import { customerRoutes } from "@/modules/customer/customer.route";
import { userRoutes } from "@/modules/user/user.route";
import { invoiceRoutes } from "@/modules/invoice/invoice.route";

export const routes: FastifyPluginAsyncZod = async (fastify) => {
  await fastify.register(authRoutes);
  await fastify.register(customerRoutes);
  await fastify.register(userRoutes);
  await fastify.register(invoiceRoutes);
};
