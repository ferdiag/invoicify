import { HTTP } from "@/constants/api";
import { addInvoiceService } from "@/services/services.container";
import { InvoiceInsertType } from "@/types/database.type";
import { FastifyReply, FastifyRequest } from "fastify";

export class InvoiceController {
  public async add(req: FastifyRequest<{ Body: InvoiceInsertType }>, res: FastifyReply) {
    const response = await addInvoiceService.execute(req.body);
    return res.status(HTTP.CREATED).send(response);
  }
}

export const invoiceController = new InvoiceController();
