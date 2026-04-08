import createHttpError from "http-errors";
import { db } from "../../db/client";
import { invoices } from "../../db/schema";
import { InvoiceInsertType } from "../../types/database.type";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

class DrizzleAddInvoiceRepository {
  public async add(data: InvoiceInsertType): Promise<{ id: string }> {
    const [id] = await db.insert(invoices).values(data).returning({ id: invoices.id });
    return id;
  }
}

export interface AddInvoiceRepository {
  add(data: InvoiceInsertType): Promise<{ id: string }>;
}

export class AddInvoiceService {
  constructor(private readonly addInvoiceRepository: AddInvoiceRepository) {}
  public async execute(data: InvoiceInsertType): Promise<{ id: string }> {
    try {
      return await this.addInvoiceRepository.add(data);
    } catch (_: unknown) {
      throw createHttpError.InternalServerError(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
    }
  }
}
export const addInvoiceService = new AddInvoiceService(new DrizzleAddInvoiceRepository());
