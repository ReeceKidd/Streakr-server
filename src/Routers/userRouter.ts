import { Router } from "express";

import { registerUserMiddlewares } from "../Routes/User/registerUserMiddlewares"

const userPaths = {
  register: "register",
};

const userRouter = Router();

userRouter.post(
  `/${userPaths.register}`,
  ...registerUserMiddlewares
);

export default userRouter;
