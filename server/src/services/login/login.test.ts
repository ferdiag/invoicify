import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import {
  LoginInput,
  LoginRepository,
  LoginService,
  PasswordComparator,
  TokenSigner,
} from "./login.service";
import { CustomerSelectType, InvoiceSelectType, UserSelectType } from "../../types/database.type";

const createLoginService = (options?: {
  findUserByEmail?: LoginRepository["findUserByEmail"];
  findCustomersByUserId?: LoginRepository["findCustomersByUserId"];
  findInvoicesByUserId?: LoginRepository["findInvoicesByUserId"];
  compare?: PasswordComparator["compare"];
  sign?: TokenSigner["sign"];
}) => {
  const loginRepository: LoginRepository = {
    findUserByEmail: options?.findUserByEmail ?? jest.fn().mockResolvedValue(undefined),
    findCustomersByUserId: options?.findCustomersByUserId ?? jest.fn().mockResolvedValue([]),
    findInvoicesByUserId: options?.findInvoicesByUserId ?? jest.fn().mockResolvedValue([]),
  };
  const passwordComparator: PasswordComparator = {
    compare: options?.compare ?? jest.fn().mockResolvedValue(true),
  };
  const tokenSigner: TokenSigner = {
    sign: options?.sign ?? jest.fn().mockReturnValue("test-token-123"),
  };

  return {
    service: new LoginService(loginRepository, passwordComparator, tokenSigner),
    loginRepository,
    passwordComparator,
    tokenSigner,
  };
};

describe("LoginService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("liefert Token und User-Payload bei Erfolg", async () => {
    const user: UserSelectType = {
      id: "11111111-2222-3333-4444-555555555555",
      email: "max.mustermann@example.com",
      password: "hashed",
      company: "Mustermann GmbH",
      phone: "",
      address: "",
      city: "",
      zip: "",
      country: "",
      taxNumber: "",
    };
    const customerRecords: CustomerSelectType[] = [
      {
        id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        userId: user.id,
        name: "ACME GmbH",
        contact: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zip: "",
        country: "",
      },
    ];
    const invoiceRecords: InvoiceSelectType[] = [
      {
        id: "99999999-8888-7777-6666-555555555555",
        customerId: customerRecords[0].id,
        userId: user.id,
        name: "Website Redesign",
        invoiceNumber: 1001,
        invoiceDate: "2025-09-10",
        dueDate: "2025-09-30",
        vat: 19,
        netAmount: 129,
        grossAmount: 153.51,
      },
      {
        id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
        customerId: customerRecords[0].id,
        userId: user.id,
        name: "Monatliche Betreuung",
        invoiceNumber: 1002,
        invoiceDate: "2025-08-01",
        dueDate: "2025-08-14",
        vat: 7,
        netAmount: 300,
        grossAmount: 321,
      },
    ];
    const { service, loginRepository, passwordComparator, tokenSigner } = createLoginService({
      findUserByEmail: jest.fn().mockResolvedValue(user),
      findCustomersByUserId: jest.fn().mockResolvedValue(customerRecords),
      findInvoicesByUserId: jest.fn().mockResolvedValue(invoiceRecords),
    });

    const res = await service.execute({
      email: user.email,
      password: "SehrSicher!123",
    } as LoginInput);

    expect(res.token).toBe("test-token-123");
    expect(res.user.email).toBe(user.email);
    expect("password" in res.user).toBe(false);
    expect(res.user.customers).toEqual(customerRecords);
    expect(res.user.invoices).toEqual(invoiceRecords);
    expect(loginRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
    expect(passwordComparator.compare).toHaveBeenCalledWith("SehrSicher!123", user.password);
    expect(tokenSigner.sign).toHaveBeenCalledWith({ email: user.email, id: user.id });
  });

  it("gibt 401 zurück, wenn Passwort falsch ist", async () => {
    const user: UserSelectType = {
      id: "11111111-2222-3333-4444-555555555555",
      email: "erika.mustermann@example.org",
      password: "hashed",
      company: "",
      phone: "",
      address: "",
      city: "",
      zip: "",
      country: "",
      taxNumber: "",
    };
    const { service } = createLoginService({
      findUserByEmail: jest.fn().mockResolvedValue(user),
      compare: jest.fn().mockResolvedValue(false),
    });

    const p = service.execute({ email: user.email, password: "Falsch!" } as LoginInput);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 401,
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
    });
  });

  it("gibt 401 zurück, wenn User nicht gefunden", async () => {
    const { service } = createLoginService({
      findUserByEmail: jest.fn().mockResolvedValue(undefined),
    });

    const p = service.execute({
      email: "no.user@example.net",
      password: "egal",
    } as LoginInput);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 401,
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
    });
  });

  it("mappt DB-Fehler beim User-Lookup auf 500", async () => {
    const { service } = createLoginService({
      findUserByEmail: jest.fn().mockRejectedValue(new Error("DB down")),
    });

    const p = service.execute({
      email: "max.mustermann@example.com",
      password: "irrelevant",
    } as LoginInput);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });

  it("mappt DB-Fehler beim Laden der Relationen auf 500", async () => {
    const user: UserSelectType = {
      id: "11111111-2222-3333-4444-555555555555",
      email: "max.mustermann@example.com",
      password: "hashed",
      company: "",
      phone: "",
      address: "",
      city: "",
      zip: "",
      country: "",
      taxNumber: "",
    };
    const { service } = createLoginService({
      findUserByEmail: jest.fn().mockResolvedValue(user),
      findCustomersByUserId: jest.fn().mockRejectedValue(new Error("DB down")),
    });

    const p = service.execute({ email: user.email, password: "SehrSicher!123" } as LoginInput);
    await expect(p).rejects.toBeInstanceOf(createHttpError.HttpError);
    await expect(p).rejects.toMatchObject({
      status: 500,
      message: ERROR_MESSAGES.DATABASE_QUERY_FAILED,
    });
  });
});
