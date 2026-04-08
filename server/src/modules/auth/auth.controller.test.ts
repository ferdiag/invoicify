import { AuthController } from "./auth.controller";
import { HTTP } from "../../constants/api";
import { loginService, registerService } from "../../services/services.container";
import { FastifyRequest, FastifyReply } from "fastify";

jest.mock("../../services/services.container", () => ({
  loginService: { execute: jest.fn() },
  registerService: { execute: jest.fn() },
}));

describe("AuthController.register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("delegates to registerService and returns HTTP 201", async () => {
    const controller = new AuthController();
    const reqBody = {
      email: "test@example.com",
      password: "Secret123!",
      company: "Invoicify",
    };

    (registerService.execute as jest.Mock).mockResolvedValue({
      id: "11111111-2222-3333-4444-555555555555",
    });

    const req = { body: reqBody } as FastifyRequest<{
      Body: { email: string; password: string; company: string };
    }>;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;

    await controller.register(req, res);

    expect(registerService.execute).toHaveBeenCalledWith(reqBody);
    expect(res.status).toHaveBeenCalledWith(HTTP.CREATED);
    expect(res.send).toHaveBeenCalledWith({
      id: "11111111-2222-3333-4444-555555555555",
    });
  });
});

describe("AuthController.login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("delegates to loginService and returns HTTP 200", async () => {
    const controller = new AuthController();
    const reqBody = {
      email: "test@example.com",
      password: "Secret123!",
    };

    (loginService.execute as jest.Mock).mockResolvedValue({
      token: "jwt-token",
      user: {
        id: "11111111-2222-3333-4444-555555555555",
        email: "test@example.com",
      },
    });

    const req = { body: reqBody } as FastifyRequest<{
      Body: { email: string; password: string };
    }>;
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown as FastifyReply;

    await controller.login(req, res);

    expect(loginService.execute).toHaveBeenCalledWith(reqBody);
    expect(res.status).toHaveBeenCalledWith(HTTP.OK);
    expect(res.send).toHaveBeenCalledWith({
      token: "jwt-token",
      user: {
        id: "11111111-2222-3333-4444-555555555555",
        email: "test@example.com",
      },
    });
  });
});
