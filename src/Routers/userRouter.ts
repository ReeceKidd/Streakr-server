import { Router } from "express";

import { registerUserMiddlewares } from "../RouteMiddlewares/User/registerUserMiddlewares"

export const UserPaths = {
  register: "register",
};

const userRouter = Router();

userRouter.post(
  `/${UserPaths.register}`,
  ...registerUserMiddlewares
);

export default userRouter;
