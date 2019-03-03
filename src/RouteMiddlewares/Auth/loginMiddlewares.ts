import { loginRequestValidationMiddleware } from "../../Middleware/Validation/Auth/loginRequestValidationMiddleware";
import { retreiveUserWithEmailMiddleware } from "../../Middleware/Database/retreiveUserWithEmailMiddleware";
import { userExistsValidationMiddleware } from "../../Middleware/Validation/User/userExistsValidationMiddleware";
import { compareRequestPasswordToUserHashedPasswordMiddleware } from "../../Middleware/Password/compareRequestPasswordToUserHashedPasswordMiddleware";
import { passwordsMatchValidationMiddleware } from "../../Middleware/Validation/User/passwordsMatchValidationMiddleware";
import { loginSuccessfulMiddleware } from "../../Middleware/Handlers/loginSuccessfulMiddleware";
import { setMinimumUserDataMiddleware } from "../../Middleware/User/setMinimumUserDataMiddleware";
import { setJsonWebTokenMiddleware } from "../../Middleware/Auth/signJsonWebTokenMiddleware";
import { IUser, IMinimumUserData } from "../../Models/User";


export interface LoginRequestBody {
  email: string;
  password: string
}

export interface LoginResponseLocals {
  user?: IUser,
  passwordMatchesHash?: boolean;
  minimumUserData?: IMinimumUserData;
  jsonWebToken?: string;

}

export const loginMiddlewares = [
  loginRequestValidationMiddleware,
  retreiveUserWithEmailMiddleware,
  userExistsValidationMiddleware,
  compareRequestPasswordToUserHashedPasswordMiddleware,
  passwordsMatchValidationMiddleware,
  setMinimumUserDataMiddleware,
  setJsonWebTokenMiddleware,
  loginSuccessfulMiddleware
];


