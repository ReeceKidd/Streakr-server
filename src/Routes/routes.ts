import * as bcrypt from "bcryptjs";

import {UserModel} from "../Models/User";
import { doesUserEmailExist } from "../Middleware/Database/doesEmailExist";
import { emailExistsValidation } from "../Middleware/Validation/emailExistsValidation";
import { ErrorMessageHelper } from "../Utils/errorMessage.helper";
import { doesUserNameExist } from "../Middleware/Database/doesUserNameExist";
import { userNameExistsValidation } from "../Middleware/Validation/userNameExistsValidation";
import { hashPassword } from "../Middleware/Password/hashPassword";
import { createUserFromRequest } from "../Middleware/User/createUserFromRequest";
import { saveUserToDatabase } from "../Middleware/Database/saveUserToDatabase";
import { sendFormattedUser } from "../Middleware/User/sendFormattedUser";
import { getUserRegistrationValidationMiddleware } from "../Middleware/Validation/getUserRegistrationValidationMiddleware";

const SaltRounds = 10;

const User = 'user'
const UserActions = {
  register: 'register'
}

const emailKey = 'email'

export class Routes {
  public routes(app): void {
    app
      .route(`/${User}/${UserActions.register}`)
      .post(
        getUserRegistrationValidationMiddleware, 
        doesUserEmailExist(UserModel),
        emailExistsValidation(ErrorMessageHelper.generateAlreadyExistsMessage, emailKey),
        doesUserNameExist(UserModel),
        userNameExistsValidation(
          ErrorMessageHelper.generateAlreadyExistsMessage
        ),
        hashPassword(bcrypt.hash, SaltRounds),
        createUserFromRequest(UserModel),
        saveUserToDatabase,
        sendFormattedUser
      );
  }
}
