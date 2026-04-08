import { db } from "../../db/client";
import { invoices } from "../../db/schema";
import { InvoiceInsertType } from "../../types/database.type";
import { mapPostgresError } from "@/utils/mapPostgresError";

class DrizzleAddInvoiceRepository {
  constructor(private readonly dbClient: typeof db) {}
  public async add(data: InvoiceInsertType): Promise<{ id: string }> {
    const [id] = await this.dbClient.insert(invoices).values(data).returning({ id: invoices.id });
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
    } catch (err: unknown) {
      mapPostgresError(err);
    }
  }
}
export const addInvoiceService = new AddInvoiceService(new DrizzleAddInvoiceRepository(db));
