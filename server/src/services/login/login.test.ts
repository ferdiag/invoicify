// Mocks
jest.mock("../../db/client", () => ({ db: { select: jest.fn() } }));
jest.mock("bcrypt", () => ({ compare: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn() }));

import { db } from "../../db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { handleLogin } from "./login.service";

// kleine Helper, um die Drizzle-Select-Kette zu simulieren
const chain = (rows: any[]) => ({
  from: () => ({ where: async () => rows }),
});

describe("handleLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("liefert Token und User-Payload bei Erfolg", async () => {
    const user = {
      id: "11111111-2222-3333-4444-555555555555",
      email: "max.mustermann@example.com",
      password: "hashed",
      name: "Max Mustermann",
    };
    const customers = [
      {
        id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        userId: user.id,
        name: "ACME GmbH",
      },
    ];
    const invoices = [
      {
        id: "99999999-8888-7777-6666-555555555555",
        userId: user.id,
        totalCents: 12900,
      },
    ];

    (db.select as jest.Mock)
      .mockReturnValueOnce(chain([user])) // users
      .mockReturnValueOnce(chain(customers)) // customers
      .mockReturnValueOnce(chain(invoices)); // invoices

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("test-token-123");

    const res = await handleLogin({
      email: user.email,
      password: "SehrSicher!123",
    } as any);

    expect(res.token).toBe("test-token-123");
    expect(res.user.email).toBe(user.email);
    expect((res.user as any).password).toBeUndefined();
    expect(res.user.customers).toEqual(customers);
    expect(res.user.invoices).toEqual(invoices);
  });

  it("gibt 401 zurück, wenn Passwort falsch ist", async () => {
    const user = {
      id: "11111111-2222-3333-4444-555555555555",
      email: "erika.mustermann@example.org",
      password: "hashed",
    };

    (db.select as jest.Mock).mockReturnValueOnce(chain([user]));
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const p = handleLogin({ email: user.email, password: "Falsch!" } as any);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 401,
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
    });
  });

  it("gibt 401 zurück, wenn User nicht gefunden", async () => {
    (db.select as jest.Mock).mockReturnValueOnce(chain([]));

    const p = handleLogin({
      email: "no.user@example.net",
      password: "egal",
    } as any);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 401,
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
    });
  });

  it("mappt DB-Fehler beim User-Lookup auf 500", async () => {
    (db.select as jest.Mock).mockImplementation(() => {
      throw new Error("DB down");
    });

    const p = handleLogin({
      email: "max.mustermann@example.com",
      password: "irrelevant",
    } as any);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });
});
