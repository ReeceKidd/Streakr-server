import { Router } from "express";

import { loginMiddlewares } from "../RouteMiddlewares/Auth/loginMiddlewares";

export const AuthPaths = {
  login: "login",
  verifyJsonWebToken: "verify-json-web-token"
};

const authRouter = Router();

authRouter.post(
  `/${AuthPaths.login}`,
  ...loginMiddlewares
);

export default authRouter;
