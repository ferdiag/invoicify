import { eq } from "drizzle-orm";
import { db } from "../../db/client";
import { users } from "../../db/schema";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import createHttpError from "http-errors";
import { UserInsertType } from "../../types/database.type";

class DrizzleCompanyRepository implements CompanyRepository {
  public async update(id: string, body: Partial<UserInsertType>) {
    const [updatedCompany] = await db
      .update(users)
      .set(body)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    if (!updatedCompany) {
      throw createHttpError.NotFound(ERROR_MESSAGES.NO_CUSTOMER_FOUND_UPDATE);
    }
    return updatedCompany;
  }
}
export interface CompanyRepository {
  update(id: string, body: Partial<UserInsertType>): Promise<{ id: string } | undefined>;
}
export class EditCompanyService {
  constructor(public readonly companyRepository: CompanyRepository) {}

  public async execute(id: string, body: Partial<UserInsertType>) {
    try {
      return await this.companyRepository.update(id, body);
    } catch (_: unknown) {
      throw createHttpError.InternalServerError(ERROR_MESSAGES.DATABASE_QUERY_FAILED);
    }
  }
}
export const editCompanyService = new EditCompanyService(new DrizzleCompanyRepository());
