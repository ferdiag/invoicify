import { HTTP } from "@/constants/api";
import {
  addCustomerService,
  deleteCustomerService,
  editCustomerService,
} from "@/services/services.container";
import { CustomerInsertType, CustomerPatchType } from "@/zod/customer.schema";
import { FastifyReply, FastifyRequest } from "fastify";

type IdParams = { id: string };

export class CustomerController {
  public async add(req: FastifyRequest<{ Body: CustomerInsertType }>, res: FastifyReply) {
    const response = await addCustomerService.execute(req.body);
    return res.status(HTTP.CREATED).send(response);
  }

  public async edit(
    req: FastifyRequest<{ Params: IdParams; Body: CustomerPatchType }>,
    res: FastifyReply
  ) {
    const response = await editCustomerService.execute(req.params.id, req.body);
    return res.status(HTTP.OK).send(response);
  }

  public async delete(req: FastifyRequest<{ Params: IdParams }>, res: FastifyReply) {
    await deleteCustomerService.execute(req.params.id);
    return res.status(HTTP.NO_CONTENT).send();
  }
}

export const customerController = new CustomerController();
