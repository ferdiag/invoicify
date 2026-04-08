import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { customers } from "../../db/schema";
import { CustomerInsertType } from "../../types/database.type";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import createHttpError from "http-errors";
import { mapPostgresError } from "@/utils/mapPostgresError";

type Updated = { id: string };
class DrizzleCustomerRepository implements CustomerRepository {
  constructor(private readonly dbClient: typeof db) {}
  public async update(id: string, body: Partial<CustomerInsertType>): Promise<Updated | undefined> {
    const [updatedCustomer] = await this.dbClient
      .update(customers)
      .set(body)
      .where(eq(customers.id, id))
      .returning();

    if (!updatedCustomer) {
      throw createHttpError.NotFound(ERROR_MESSAGES.NO_CUSTOMER_FOUND_UPDATE);
    }
    return { id: updatedCustomer.id };
  }
}
export interface CustomerRepository {
  update(id: string, data: Partial<CustomerInsertType>): Promise<Updated | undefined>;
}

export class EditCustomerService {
  public constructor(private readonly customerRepository: CustomerRepository) {}
  public async execute(id: string, body: Partial<CustomerInsertType>) {
    try {
      return await this.customerRepository.update(id, body);
    } catch (err: unknown) {
      mapPostgresError(err);
    }
  }
}
export const editCustomerService = new EditCustomerService(new DrizzleCustomerRepository(db));
