import { Router } from "express";

import { loginMiddlewares } from "../RouteMiddlewares/Auth/loginMiddlewares";

export const AuthPaths = {
  login: "login"
};

const authRouter = Router();

authRouter.post(`/${AuthPaths.login}`, ...loginMiddlewares);

export default authRouter;
