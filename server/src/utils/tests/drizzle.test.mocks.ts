// tests/drizzle.mocks.ts
import type { Mock } from "jest-mock";

type ReturningRows<T> = () => Promise<T[]>;

interface InsertChain<T> {
  values: () => { returning: ReturningRows<T> };
}
interface UpdateChain<T> {
  set: (_?: unknown) => { where: (_?: unknown) => { returning: ReturningRows<T> } };
}
interface DeleteChain<T> {
  where: (_?: unknown) => { returning: ReturningRows<T> };
}

// Jest-Mock-Funktionssignaturen (ein Typargument = die Function)
type InsertMock<T> = Mock<(...args: unknown[]) => InsertChain<T>>;
type UpdateMock<T> = Mock<(...args: unknown[]) => UpdateChain<T>>;
type DeleteMock<T> = Mock<(...args: unknown[]) => DeleteChain<T>>;

export interface DbLike<T> {
  insert: InsertMock<T>;
  update: UpdateMock<T>;
  delete: DeleteMock<T>;
}

export const mockInsertReturning = <T>(db: Pick<DbLike<T>, "insert">, rows: T[]): void => {
  db.insert.mockReturnValue({
    values: () => ({ returning: async () => rows }),
  });
};

export const mockUpdateReturning = <T>(db: Pick<DbLike<T>, "update">, rows: T[]): void => {
  db.update.mockReturnValue({
    set: () => ({ where: () => ({ returning: async () => rows }) }),
  });
};

export const mockDeleteReturning = <T>(db: Pick<DbLike<T>, "delete">, rows: T[]): void => {
  db.delete.mockReturnValue({
    where: () => ({ returning: async () => rows }),
  });
};

export const mockDrizzleThrow = <T>(
  db: DbLike<T>,
  method: "insert" | "update" | "delete",
  err: unknown
): void => {
  // alle drei sind Mock<(...args) => something>, deshalb:
  (db[method] as Mock<(...args: unknown[]) => unknown>).mockImplementation(() => {
    throw err;
  });
};
