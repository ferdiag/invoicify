import { db } from "../../db/client";
import { customers } from "../../db/schema";
import { CustomerInsertType } from "../../types/database.type";
import { mapPostgresError } from "@/utils/mapPostgresError";

export class DrizzleAddCustomerRepository {
  constructor(private readonly dbClient: typeof db) {}

  public async add(data: CustomerInsertType): Promise<{ id: string }> {
    const [id] = await this.dbClient.insert(customers).values(data).returning({
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
    } catch (err: unknown) {
      mapPostgresError(err);
    }
  }
}
export const addCustomerService = new AddCustomer(new DrizzleAddCustomerRepository(db));
