import { Router } from "express";

import { hashPasswordMiddleware } from "../Middleware/Password/hashPasswordMiddleware";
import { compareHashedRequestPasswordToUserPasswordMiddleware} from "../Middleware/Password/compareHashedRequestPasswordToUserPasswordMiddleware"
import { userLoginValidationMiddleware } from "../Middleware/Validation/userLoginValidationMiddleware";
import { passwordsMatchValidationMiddleware } from "../Middleware/Validation/passwordsMatchValidationMiddleware"
import { retreiveUserWithEmailMiddleware } from "../Middleware/Database/retreiveUserWithEmailMiddleware";
import { loginSuccessfulMiddleware } from "../Middleware/Auth/loginSuccessfulMiddleware"
import { registerUserMiddlewares } from "../Routes/User/user.register"

const User = {
  register: "register",
  login: "login"
};

const userRouter = Router();

// Write test for below code. 
userRouter.post(
  `/${User.register}`,
  ...registerUserMiddlewares
);

// Need to research session tokens to figure out how they work and add it to this route. 
userRouter.post(
  `/${User.login}`,
  userLoginValidationMiddleware,
  retreiveUserWithEmailMiddleware,
  hashPasswordMiddleware,
  compareHashedRequestPasswordToUserPasswordMiddleware,
  passwordsMatchValidationMiddleware,
  loginSuccessfulMiddleware
);

export default userRouter;
