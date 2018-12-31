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

/*
Need to read up on using passport and Json Web Tokens to provide authentication for the routes.
Probably best to look at the passport docs and a youtube tutorial or two. 
*/

export default userRouter;
