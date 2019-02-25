import { Router } from "express";

import { loginMiddlewares } from "../Routes/Auth/login";

export const authPaths = {
  login: "login",
  verifyJsonWebToken: "verify-json-web-token"
};

const authRouter = Router();

authRouter.post(
  `/${authPaths.login}`,
  ...loginMiddlewares
);

export default authRouter;
