import { Router } from "express";

import { registerUserMiddlewares } from "../Routes/User/user.register"
import { userLoginMiddlewares } from "../Routes/User/user.login";

const UserPaths = {
  register: "register",
  login: "login"
};

const userRouter = Router();

userRouter.post(
  `/${UserPaths.register}`,
  ...registerUserMiddlewares
);
 
userRouter.post(
  `/${UserPaths.login}`,
  ...userLoginMiddlewares
);

export default userRouter;
