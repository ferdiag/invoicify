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
import { UserInsertType, InvoiceInsertType } from "../../types/database.type";
import { UserPatchType } from "../../zod/user.schema";
import { CustomerInsertType } from "../../zod/customer.schema";

// kleine Helper, um die Drizzle-Select-Kette zu simulieren
const chain = (rows: UserInsertType[] | InvoiceInsertType[] | CustomerInsertType[]) => ({
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
        customerId: customers[0].id,
        userId: user.id,
        name: "Website Redesign",
        invoiceDate: "2025-09-10",
        dueDate: "2025-09-30",
        vat: 19,
        netAmount: "129.00",
        grossAmount: "153.51",
        products: [
          { id: "p-001", name: "Design Sprint", quantity: 2, price: 50.0 },
          { id: "p-002", name: "Hosting (1 Monat)", quantity: 1, price: 29.0 },
        ],
      },
      {
        id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        customerId: customers[0].id,
        userId: user.id,
        name: "Monatliche Betreuung",
        invoiceDate: "2025-08-01",
        dueDate: "2025-08-14",
        vat: 7,
        netAmount: "300.00",
        grossAmount: "321.00",
        products: [{ id: "p-101", name: "Support-Paket", quantity: 10, price: 30.0 }],
      },
    ];

    (db.select as jest.Mock)
      .mockReturnValueOnce(chain([user]))
      .mockReturnValueOnce(chain(customers))
      .mockReturnValueOnce(chain(invoices));

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue("test-token-123");

    const res = await handleLogin({
      email: user.email,
      password: "SehrSicher!123",
    } as UserInsertType);

    expect(res.token).toBe("test-token-123");
    expect(res.user.email).toBe(user.email);
    expect((res.user as UserPatchType).password).toBeUndefined();
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

    const p = handleLogin({ email: user.email, password: "Falsch!" } as UserInsertType);
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
    } as UserInsertType);
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
    } as UserInsertType);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });
});
