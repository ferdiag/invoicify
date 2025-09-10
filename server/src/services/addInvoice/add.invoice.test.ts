// src/services/addInvoice/add.invoice.test.ts
jest.mock("../../db/client", () => ({ db: { insert: jest.fn() } }));

import createHttpError from "http-errors";
import { db } from "../../db/client";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { handleAddInvoice } from "./add.invoice.service";

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

const makeInvoicePayload = (overrides: Partial<any> = {}) =>
  ({
    name: "Invoice #2025-0001",
    userId: "11111111-2222-3333-4444-555555555555",
    customerId: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    invoiceDate: "2025-09-01",
    dueDate: "2025-09-15",
    vat: 19,
    netAmount: "150.00",
    grossAmount: "178.50",
    products: [
      { id: "p1", name: "Consulting (2h)", price: "5000", quantity: 2 },
      { id: "p2", name: "Design Review", price: "5000", quantity: 1 },
    ],
    ...overrides,
  }) as any;

describe("handleAddInvoice", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("create invoice success, returns Id", async () => {
    const id = "1111111111122222223333333333";
    mockInsertSuccess(id);

    const result = await handleAddInvoice(makeInvoicePayload());
    expect(result).toEqual({ id });
    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("throws 500 with DATABASE_QUERY_FAILED on DB error", async () => {
    mockInsertThrow(new Error("DB down"));

    const p = handleAddInvoice(makeInvoicePayload());
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
  });
});
