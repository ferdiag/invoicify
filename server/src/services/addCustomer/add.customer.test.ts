// src/services/addCustomer/add.customer.test.ts
jest.mock("../../db/client", () => ({ db: { insert: jest.fn() } }));

import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { db } from "../../db/client";
import { handleAddCustomer } from "./add.customer.service";

const mockInsertSuccess = (id: string) => {
  (db.insert as jest.Mock).mockReturnValue({
    values: () => ({ returning: async () => [{ id }] }),
  });
};

const mockInsertThrow = (err: any) => {
  (db.insert as jest.Mock).mockImplementation(() => {
    throw err;
  });
};

describe("handleAddCustomer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create customer success, returns Id", async () => {
    const id = "1111111111122222223333333333";
    mockInsertSuccess(id);

    const result = await handleAddCustomer({ name: "ACME GmbH" } as any);
    expect(result).toEqual({ id });
    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("throws 500 with DATABASE_QUERY_FAILED on DB error", async () => {
    mockInsertThrow(new Error("DB down"));

    const p = handleAddCustomer({} as any);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
  });
});
