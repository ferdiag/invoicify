jest.mock("../../db/client", () => ({ db: { update: jest.fn() } }));

import createHttpError from "http-errors";
import { db } from "../../db/client";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { editCompanyService } from "./edit.company";
import { UserInsertType } from "../../types/database.type";

type RowWithId = { id: string };

const mockUpdateReturning = (rows: RowWithId[]) => {
  (db.update as jest.Mock).mockReturnValue({
    set: () => ({
      where: () => ({
        returning: async () => rows,
      }),
    }),
  });
};

const toError = (e: unknown): Error =>
  e instanceof Error ? e : new Error(e ? String(e) : "Unknown error");

const mockUpdateThrow = (err?: unknown) => {
  (db.update as jest.Mock).mockImplementation(() => {
    throw toError(err);
  });
};

describe("EditCompanyService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns id on success", async () => {
    const id = "11111111-2222-3333-4444-555555555555";
    mockUpdateReturning([{ id }]);

    const patch: Partial<UserInsertType> = { company: "ACME" };
    await expect(editCompanyService.execute(id, patch)).resolves.toEqual({ id });
  });

  it("maps not found to 500", async () => {
    mockUpdateReturning([]);

    const patch: Partial<UserInsertType> = { company: "X" };
    const p = editCompanyService.execute("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", patch);

    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });

  it("maps db errors to 500", async () => {
    mockUpdateThrow(new Error("DB down"));

    const patch: Partial<UserInsertType> = { company: "X" };
    const p = editCompanyService.execute("11111111-2222-3333-4444-555555555555", patch);

    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });
});
