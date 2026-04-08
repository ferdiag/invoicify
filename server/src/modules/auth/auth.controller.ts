import { FastifyReply, FastifyRequest } from "fastify";
import { LoginInput } from "../../services/login/login.service";
import { RegisterInput } from "../../services/register/register.service";
import { loginService, registerService } from "../../services/services.container";
import { HTTP } from "../../constants/api";

export class AuthController {
  public async register(req: FastifyRequest<{ Body: RegisterInput }>, res: FastifyReply) {
    const response = await registerService.execute(req.body);
    return res.status(HTTP.CREATED).send(response);
  }

  public async login(req: FastifyRequest<{ Body: LoginInput }>, res: FastifyReply) {
    const response = await loginService.execute(req.body);
    return res.status(HTTP.OK).send(response);
  }
}

export const authController = new AuthController();
