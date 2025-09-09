// src/services/delete.customer.test.ts
jest.mock("../../db/client", () => ({ db: { delete: jest.fn() } }));

import { db } from "../../db/client";
import createHttpError from "http-errors";
import { handleDeleteCustomer } from "./delete.customer.service";
import { ERROR_MESSAGES } from "../../constants/errorMessages";

const mockDeleteReturning = (rows: any[]) => {
  (db.delete as jest.Mock).mockReturnValue({
    where: () => ({ returning: async () => rows }),
  });
};

const mockDeleteThrow = (err: any) => {
  (db.delete as jest.Mock).mockImplementation(() => {
    throw err;
  });
};

describe("handleDeleteCustomer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns deleted id on success", async () => {
    const id = "11111111-2222-3333-4444-555555555555";
    mockDeleteReturning([{ id }]);
    await expect(handleDeleteCustomer(id)).resolves.toEqual({ id });
  });

  it("returns 404 when no row deleted", async () => {
    mockDeleteReturning([]);
    const p = handleDeleteCustomer("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 404,
      message: ERROR_MESSAGES.NO_CUSTOMER_FOUND_DELETE,
    });
  });

  it("maps 22P02 to 400", async () => {
    mockDeleteThrow({ code: "22P02" });
    const p = handleDeleteCustomer("invalid-uuid");
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({ status: 400 });
  });

  it("maps unknown db error to 500", async () => {
    mockDeleteThrow(new Error("DB down"));
    const p = handleDeleteCustomer("11111111-2222-3333-4444-555555555555");
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });
});
