import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { customers } from "../../db/schema";
import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { mapPostgresError } from "@/utils/mapPostgresError";

class DrizzleDeleteCustomerRepository implements DeleteCustomerRepository {
  constructor(private readonly dbClient: typeof db) {}

  public async delete(id: string): Promise<{ id: string }> {
    const rows = await this.dbClient
      .delete(customers)
      .where(eq(customers.id, id))
      .returning({ id: customers.id });

    if (rows.length === 0) {
      throw new createHttpError.NotFound(ERROR_MESSAGES.NO_CUSTOMER_FOUND_DELETE);
    }

    return { id: rows[0].id };
  }
}

export interface DeleteCustomerRepository {
  delete(id: string): Promise<{ id: string }>;
}

export class DeleteCustomer {
  constructor(private readonly deleteCustomerRepository: DeleteCustomerRepository) {}
  public async execute(id: string): Promise<{ id: string }> {
    try {
      return await this.deleteCustomerRepository.delete(id);
    } catch (err: unknown) {
      mapPostgresError(err);
    }
  }
}
export const deleteCustomerService = new DeleteCustomer(new DrizzleDeleteCustomerRepository(db));
