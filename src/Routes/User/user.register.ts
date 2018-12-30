
import { doesUserEmailExistMiddleware } from "../../Middleware/Database/doesUserEmailExistMiddleware";
import { emailExistsValidationMiddleware } from "../../Middleware/Validation/emailExistsValidationMiddleware";
import { doesUserNameExistMiddleware } from "../../Middleware/Database/doesUserNameExistMiddleware";
import { userNameExistsValidationMiddleware } from "../../Middleware/Validation/userNameExistsValidationMiddleware";
import { hashPasswordMiddleware } from "../../Middleware/Password/hashPasswordMiddleware";
import { createUserFromRequestMiddleware } from "../../Middleware/User/createUserFromRequestMiddleware";
import { saveUserToDatabaseMiddleware } from "../../Middleware/Database/saveUserToDatabaseMiddleware";
import { sendFormattedUserMiddleware } from "../../Middleware/User/sendFormattedUserMiddleware";
import { userRegistrationValidationMiddleware } from "../../Middleware/Validation/userRegistrationValidationMiddleware";

export const registerUserMiddlewares = [
  userRegistrationValidationMiddleware,
  doesUserEmailExistMiddleware,
  emailExistsValidationMiddleware,
  doesUserNameExistMiddleware,
  userNameExistsValidationMiddleware,
  hashPasswordMiddleware,
  createUserFromRequestMiddleware,
  saveUserToDatabaseMiddleware,
  sendFormattedUserMiddleware
];
