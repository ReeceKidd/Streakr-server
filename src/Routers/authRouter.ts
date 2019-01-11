import { Router } from "express";

import { loginMiddlewares } from "Routes/Auth/login";

const authPaths = {
  login: "login"
};

const authRouter = Router();

authRouter.post(
  `/${authPaths.login}`,
  ...loginMiddlewares
);


export default authRouter;
