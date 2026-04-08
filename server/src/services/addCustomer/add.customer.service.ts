import createHttpError from "http-errors";
import { db } from "../../db/client";
import { customers } from "../../db/schema";
import { CustomerInsertType } from "../../types/database.type";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

export class DrizzleAddCustomerRepository {
  public async add(data: CustomerInsertType): Promise<{ id: string }> {
    const [id] = await db.insert(customers).values(data).returning({
      id: customers.id,
    });
    return id;
  }
}
export interface AddCustomerRepository {
  add(data: CustomerInsertType): Promise<{ id: string }>;
}

export class AddCustomer {
  constructor(private readonly addCustomerRepository: AddCustomerRepository) {}
  public async execute(data: CustomerInsertType): Promise<{ id: string }> {
    try {
      return await this.addCustomerRepository.add(data);
    } catch {
      throw createHttpError.InternalServerError(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
    }
  }
}
export const addCustomerService = new AddCustomer(new DrizzleAddCustomerRepository());
