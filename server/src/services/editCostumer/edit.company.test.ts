// src/services/edit.company.test.ts
jest.mock("../../db/client", () => ({ db: { update: jest.fn() } }));

import createHttpError from "http-errors";
import { db } from "../../db/client";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { handleEditCompany } from "../editCompany/edit.company";

const mockUpdateReturning = (rows: any[]) => {
  (db.update as jest.Mock).mockReturnValue({
    set: () => ({
      where: () => ({
        returning: async () => rows,
      }),
    }),
  });
};

const mockUpdateThrow = (err: any) => {
  (db.update as jest.Mock).mockImplementation(() => {
    throw err;
  });
};

describe("handleEditCompany", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns id on success", async () => {
    const id = "11111111-2222-3333-4444-555555555555";
    mockUpdateReturning([{ id }]);
    await expect(handleEditCompany(id, { company: "ACME" } as any)).resolves.toEqual({ id });
  });

  it("not found is mapped to 500 (current behavior)", async () => {
    mockUpdateReturning([]);
    const p = handleEditCompany("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", {
      company: "X",
    } as any);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });

  it("db error → 500", async () => {
    mockUpdateThrow(new Error("DB down"));
    const p = handleEditCompany("11111111-2222-3333-4444-555555555555", {
      company: "X",
    } as any);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });
});
