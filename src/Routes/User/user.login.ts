import { userLoginValidationMiddleware } from "../../Middleware/Validation/userLoginValidationMiddleware";
import { retreiveUserWithEmailMiddleware } from "../../Middleware/Database/retreiveUserWithEmailMiddleware";
import { compareRequestPasswordToUserHashedPasswordMiddleware } from "../../Middleware/Password/compareRequestPasswordToUserHashedPasswordMiddleware";
import { passwordsMatchValidationMiddleware } from "../../Middleware/Validation/passwordsMatchValidationMiddleware";
import { loginSuccessfulMiddleware } from "../../Middleware/Auth/loginSuccessfulMiddleware";
import { setMinimumUserDataMiddleware } from "../../Middleware/User/setMinimumUserDataMiddleware";
import { setJsonWebTokenMiddleware } from "../../Middleware/Auth/setJsonWebtTokenMiddleware";

export const userLoginMiddlewares = [
  userLoginValidationMiddleware,
  retreiveUserWithEmailMiddleware,
  compareRequestPasswordToUserHashedPasswordMiddleware,
  passwordsMatchValidationMiddleware,
  setMinimumUserDataMiddleware,
  setJsonWebTokenMiddleware,
  loginSuccessfulMiddleware
];
