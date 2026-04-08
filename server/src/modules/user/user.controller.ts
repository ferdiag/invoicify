import { HTTP } from "@/constants/api";
import { editCompanyService } from "@/services/services.container";
import { UserPatchType } from "@/zod/user.schema";
import { FastifyReply, FastifyRequest } from "fastify";

type IdParams = { id: string };

export class UserController {
  public async edit(
    req: FastifyRequest<{ Params: IdParams; Body: UserPatchType }>,
    res: FastifyReply
  ) {
    const response = await editCompanyService.execute(req.params.id, req.body);
    return res.status(HTTP.OK).send(response);
  }
}

export const userController = new UserController();
