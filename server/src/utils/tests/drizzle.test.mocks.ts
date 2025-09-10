export const mockInsertReturning = (db: any, rows: any[]) => {
  (db.insert as jest.Mock).mockReturnValue({
    values: () => ({ returning: async () => rows }),
  });
};

export const mockUpdateReturning = (db: any, rows: any[]) => {
  (db.update as jest.Mock).mockReturnValue({
    set: () => ({ where: () => ({ returning: async () => rows }) }),
  });
};

export const mockDeleteReturning = (db: any, rows: any[]) => {
  (db.delete as jest.Mock).mockReturnValue({
    where: () => ({ returning: async () => rows }),
  });
};

export const mockDrizzleThrow = (db: any, method: "insert" | "update" | "delete", err: any) => {
  (db[method] as jest.Mock).mockImplementation(() => {
    throw err;
  });
};
jest.mock("../../db/client", () => ({ db: { update: jest.fn() } }));
