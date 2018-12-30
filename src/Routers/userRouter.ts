import * as bcrypt from "bcryptjs";
import { Router } from "express";

import { UserModel } from "../Models/User";
import { getHashPasswordMiddleware } from "../Middleware/Password/hashPasswordMiddleware";
import { getCompareHashedRequestPasswordToUserPasswordMiddleware} from "../Middleware/Password/compareHashedRequestPasswordToUserPasswordMiddleware"
import { getUserLoginValidationMiddleware } from "../Middleware/Validation/userLoginValidationMiddleware";
import { getPasswordsMatchValidationMiddleware } from "../Middleware/Validation/passwordsMatchValidationMiddleware"
import { getRetreiveUserWithEmailMiddleware } from "../Middleware/Database/retreiveUserWithEmailMiddleware";
import { loginSuccessfulMiddleware } from "../Middleware/Auth/loginSuccessfulMiddleware"
import { registerUserMiddlewares } from "../Routes/User/user.register"


const saltRounds = 10;

const User = {
  register: "register",
  login: "login"
};


const userRouter = Router();

const hashPasswordMiddleware = getHashPasswordMiddleware(
  bcrypt.hash,
  saltRounds
);


// Write test for below code. 
userRouter.post(
  `/${User.register}`,
  ...registerUserMiddlewares
);

const retreiveUserWithEmailMiddleware = getRetreiveUserWithEmailMiddleware(
  UserModel
);
const compareHashedRequestPasswordToUserPasswordMiddleware = getCompareHashedRequestPasswordToUserPasswordMiddleware(bcrypt.compare)
const passwordsMatchValidationMiddleware = getPasswordsMatchValidationMiddleware('Incorrect login details')

// Idea for the middleware is to export the computed middleware with the file so that it doesn't have to be exported differently each time. 
// Can also export the getter to allow it to be configured. 

// Need to research session tokens to figure out how they work and add it to this route. 
userRouter.post(
  `/${User.login}`,
  getUserLoginValidationMiddleware,
  retreiveUserWithEmailMiddleware,
  hashPasswordMiddleware,
  compareHashedRequestPasswordToUserPasswordMiddleware,
  passwordsMatchValidationMiddleware,
  loginSuccessfulMiddleware
);

export default userRouter;
