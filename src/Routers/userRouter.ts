import * as bcrypt from "bcryptjs";

import { UserModel } from "../Models/User";
import { getDoesUserEmailExistMiddleware } from "../Middleware/Database/getDoesUserEmailExistMiddleware";
import { getEmailExistsValidationMiddleware } from "../Middleware/Validation/getEmailExistsValidationMiddleware";
import { ErrorMessageHelper } from "../Utils/errorMessage.helper";
import { getDoesUserNameExistMiddleware } from "../Middleware/Database/getDoesUserNameExistMiddleware";
import { getUserNameExistsValidationMiddleware } from "../Middleware/Validation/getUserNameExistsValidationMiddleware";
import { getHashPasswordMiddleware } from "../Middleware/Password/getHashPasswordMiddleware";
import { getCreateUserFromRequestMiddleware } from "../Middleware/User/getCreateUserFromRequestMiddleware";
import { getSaveUserToDatabaseMiddleware } from "../Middleware/Database/getSaveUserToDatabaseMiddleware";
import { getSendFormattedUserMiddleware } from "../Middleware/User/getSendFormattedUserMiddleware";
import { getUserRegistrationValidationMiddleware } from "../Middleware/Validation/getUserRegistrationValidationMiddleware";
import { Router } from "express";

const saltRounds = 10;

const User = {
  register: "register",
  login: "login"
};

const emailKey = "email";
const userNameKey = "userName";

const userRouter = Router();

const doesUserEmailExistMiddleware = getDoesUserEmailExistMiddleware(UserModel);
const emailExistsValidationMiddleware = getEmailExistsValidationMiddleware(ErrorMessageHelper.generateAlreadyExistsMessage, emailKey)
const doesUserNameExistMiddleware = getDoesUserNameExistMiddleware(UserModel);
const userNameExistsValidationMiddleware = getUserNameExistsValidationMiddleware(ErrorMessageHelper.generateAlreadyExistsMessage, userNameKey)
const hashPasswordMiddleware = getHashPasswordMiddleware(bcrypt.hash, saltRounds)
const createUserFromRequestMiddleware = getCreateUserFromRequestMiddleware(UserModel)

userRouter.post(
  `/${User.register}`,
  getUserRegistrationValidationMiddleware,
  doesUserEmailExistMiddleware,
  emailExistsValidationMiddleware,
  doesUserNameExistMiddleware,
  userNameExistsValidationMiddleware,
  hashPasswordMiddleware,
  createUserFromRequestMiddleware,
  getSaveUserToDatabaseMiddleware,
  getSendFormattedUserMiddleware
);

userRouter.post(`/${User.login}`);

export default userRouter;
