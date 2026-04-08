import createHttpError from "http-errors";
import Fastify from "fastify";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { API_PREFIX, PATHS } from "@/paths";
import { HTTP } from "../../constants/api";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { registerErrorHandler } from "../../middleware/registerErrorHandler";
import { authController } from "./auth.controller";
import { authRoutes } from "./auth.routes";

const buildApp = async () => {
  const app = Fastify().withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(authRoutes, { prefix: API_PREFIX });
  registerErrorHandler(app);
  await app.ready();

  return app;
};

describe("authRoutes", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("register route delegates to authController.register", async () => {
    const registerSpy = jest
      .spyOn(authController, "register")
      .mockImplementation(async (_req, res) => {
        return res.status(HTTP.CREATED).send({
          email: "test@example.com",
          message: "registered",
        });
      });
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: `${API_PREFIX}${PATHS.AUTH.REGISTER}`,
      payload: {
        email: "test@example.com",
        password: "Secret123!",
      },
    });

    expect(response.statusCode).toBe(HTTP.CREATED);
    expect(registerSpy).toHaveBeenCalledTimes(1);

    await app.close();
  });

  it("login route delegates to authController.login", async () => {
    const loginSpy = jest.spyOn(authController, "login").mockImplementation(async (_req, res) => {
      return res.status(HTTP.OK).send({
        token: "jwt-token",
        user: { id: "11111111-2222-3333-4444-555555555555" },
      });
    });
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: `${API_PREFIX}${PATHS.AUTH.LOGIN}`,
      payload: {
        email: "test@example.com",
        password: "Secret123!",
      },
    });

    expect(response.statusCode).toBe(HTTP.OK);
    expect(loginSpy).toHaveBeenCalledTimes(1);

    await app.close();
  });

  it("rejects invalid register payload before controller execution", async () => {
    const registerSpy = jest.spyOn(authController, "register");
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: `${API_PREFIX}${PATHS.AUTH.REGISTER}`,
      payload: {
        email: "not-an-email",
        password: "short",
        role: "admin",
      },
    });

    expect(response.statusCode).toBe(HTTP.BAD_REQUEST);
    expect(registerSpy).not.toHaveBeenCalled();

    await app.close();
  });

  it("rejects login payloads with unknown fields because schema is strict", async () => {
    const loginSpy = jest.spyOn(authController, "login");
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: `${API_PREFIX}${PATHS.AUTH.LOGIN}`,
      payload: {
        email: "test@example.com",
        password: "Secret123!",
        rememberMe: true,
      },
    });

    expect(response.statusCode).toBe(HTTP.BAD_REQUEST);
    expect(loginSpy).not.toHaveBeenCalled();

    await app.close();
  });

  it("rejects register payloads when password exceeds the schema max length", async () => {
    const registerSpy = jest.spyOn(authController, "register");
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: `${API_PREFIX}${PATHS.AUTH.REGISTER}`,
      payload: {
        email: "test@example.com",
        password: "a".repeat(73),
      },
    });

    expect(response.statusCode).toBe(HTTP.BAD_REQUEST);
    expect(registerSpy).not.toHaveBeenCalled();

    await app.close();
  });

  it("rejects register payloads when password does not meet complexity rules", async () => {
    const registerSpy = jest.spyOn(authController, "register");
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: `${API_PREFIX}${PATHS.AUTH.REGISTER}`,
      payload: {
        email: "test@example.com",
        password: "onlylowercase1",
      },
    });

    expect(response.statusCode).toBe(HTTP.BAD_REQUEST);
    expect(registerSpy).not.toHaveBeenCalled();

    await app.close();
  });

  it("maps controller HttpErrors through the global error handler", async () => {
    jest
      .spyOn(authController, "login")
      .mockRejectedValue(createHttpError(HTTP.UNAUTHORIZED, ERROR_MESSAGES.INVALID_CREDENTIALS));
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: `${API_PREFIX}${PATHS.AUTH.LOGIN}`,
      payload: {
        email: "test@example.com",
        password: "Secret123!",
      },
    });

    expect(response.statusCode).toBe(HTTP.UNAUTHORIZED);
    expect(response.json()).toMatchObject({
      error: "Unauthorized",
      message: ERROR_MESSAGES.INVALID_CREDENTIALS,
    });

    await app.close();
  });

  it("returns HTTP 500 when the controller throws an unexpected error", async () => {
    jest.spyOn(authController, "register").mockRejectedValue(new Error("database offline"));
    const app = await buildApp();

    const response = await app.inject({
      method: "POST",
      url: `${API_PREFIX}${PATHS.AUTH.REGISTER}`,
      payload: {
        email: "test@example.com",
        password: "Secret123!",
      },
    });

    expect(response.statusCode).toBe(HTTP.INTERNAL_SERVER_ERROR);
    expect(response.json()).toMatchObject({
      error: "Internal Server Error",
      message: "database offline",
      statusCode: HTTP.INTERNAL_SERVER_ERROR,
    });

    await app.close();
  });
});
