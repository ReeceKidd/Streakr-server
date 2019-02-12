import { Router } from "express";

import { loginMiddlewares } from "../Routes/Auth/login";
import { verifyJsonWebTokenMiddlewares } from "../Routes/Auth/verifyJsonWebTokenMiddlewares";

export const authPaths = {
  login: "login",
  verifyJsonWebToken: "verify-json-web-token"
};

const authRouter = Router();

authRouter.post(
  `/${authPaths.login}`,
  ...loginMiddlewares
);

authRouter.post(
  `/${authPaths.verifyJsonWebToken}`,
  ...verifyJsonWebTokenMiddlewares)


export default authRouter;
