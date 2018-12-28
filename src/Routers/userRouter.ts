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
import { getUserLoginValidationMiddleware } from "../Middleware/Validation/getUserLoginValidationMiddleware";
import { getRetreiveUserWithEmailMiddleware } from "Middleware/Database/getRetreiveUserWithEmailMiddleware";
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
const emailExistsValidationMiddleware = getEmailExistsValidationMiddleware(
  ErrorMessageHelper.generateAlreadyExistsMessage,
  emailKey
);
const doesUserNameExistMiddleware = getDoesUserNameExistMiddleware(UserModel);
const userNameExistsValidationMiddleware = getUserNameExistsValidationMiddleware(
  ErrorMessageHelper.generateAlreadyExistsMessage,
  userNameKey
);
const hashPasswordMiddleware = getHashPasswordMiddleware(
  bcrypt.hash,
  saltRounds
);
const createUserFromRequestMiddleware = getCreateUserFromRequestMiddleware(
  UserModel
);

// Once I've done the login route create a function in its own file that returns the user registration route. To clear this file up. 
// This file should only contain the declaration of the rouer and its paths. Write a unit test for the created function to make sure
// it has imported everything in the middleware path as expected. 

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

const retreiveUserWithEmailMiddleware = getRetreiveUserWithEmailMiddleware(
  UserModel
);

userRouter.post(
  `/${User.login}`,
  getUserLoginValidationMiddleware,
  retreiveUserWithEmailMiddleware
);

// Validate parameters being passed. Check that email and password exist. (Done)
// Check that user exists with email.
// Hash password
// Compare hashed password
// Return success message.

export default userRouter;
