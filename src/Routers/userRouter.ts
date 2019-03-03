import { Router } from "express";

import { registerUserMiddlewares } from "../RouteMiddlewares/User/registerUserMiddlewares"

const userPaths = {
  register: "register",
};

const userRouter = Router();

userRouter.post(
  `/${userPaths.register}`,
  ...registerUserMiddlewares
);

export default userRouter;
