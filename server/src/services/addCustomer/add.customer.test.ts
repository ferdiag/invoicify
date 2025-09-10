// src/services/addCustomer/add.customer.test.ts
jest.mock("../../db/client", () => ({ db: { insert: jest.fn() } }));

import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { db } from "../../db/client";
import { handleAddCustomer } from "./add.customer.service";
import { CustomerType } from "../../types/database.type";

const mockInsertSuccess = (id: string) => {
  (db.insert as jest.Mock).mockReturnValue({
    values: () => ({ returning: async () => [{ id }] }),
  });
};

type DbMock = { insert: jest.Mock<() => unknown> };

const mdb = db as unknown as DbMock;

const toError = (e: unknown): Error =>
  e instanceof Error ? e : new Error(e ? String(e) : "Unknown error");

const mockInsertThrow = (err?: unknown) => {
  mdb.insert.mockImplementation(() => {
    throw toError(err); // <- auch undefined wird zu einem echten Error
  });
};

describe("handleAddCustomer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create customer success, returns Id", async () => {
    const id = "1111111111122222223333333333";
    mockInsertSuccess(id);

    const result = await handleAddCustomer({ name: "ACME GmbH" } as CustomerType);
    expect(result).toEqual({ id });
    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("throws 500 with DATABASE_QUERY_FAILED on DB error", async () => {
    mockInsertThrow(new Error("DB down"));

    const p = handleAddCustomer({ name: "" } as CustomerType);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
  });
});
