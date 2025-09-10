jest.mock("../../db/client", () => ({ db: { update: jest.fn() } }));

import createHttpError from "http-errors";
import { db } from "../../db/client";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { handleEditCompany } from "../editCompany/edit.company";
import { UserPatchType } from "../../zod/user.schema";

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

describe("handleEditCompany", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns id on success", async () => {
    const id = "11111111-2222-3333-4444-555555555555";
    mockUpdateReturning([{ id }]);

    const patch: UserPatchType = { company: "ACME" };
    await expect(handleEditCompany(id, patch)).resolves.toEqual({ id });
  });

  it("not found is mapped to 500 (current behavior)", async () => {
    mockUpdateReturning([]); // keine Row zurück

    const patch: UserPatchType = { company: "X" };
    const p = handleEditCompany("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee", patch);

    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });

  it("db error → 500", async () => {
    mockUpdateThrow(new Error("DB down"));

    const patch: UserPatchType = { company: "X" };
    const p = handleEditCompany("11111111-2222-3333-4444-555555555555", patch);

    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });
});
