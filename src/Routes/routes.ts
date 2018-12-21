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

const SALT_ROUNDS = 10;

export class Routes {
  public routes(app): void {
    //app.route("/users").get(UserRouter.getAllUsers);
    // app
    //   .route("/user/login")
    //   .post(celebrate(UserValidation.login), UserLogic.login);
    app
      .route("/user/register")
      .post(
        getUserRegistrationValidationMiddleware, 
        doesUserEmailExist(UserModel),
        emailExistsValidation(ErrorMessageHelper.generateAlreadyExistsMessage),
        doesUserNameExist(UserModel),
        userNameExistsValidation(
          ErrorMessageHelper.generateAlreadyExistsMessage
        ),
        hashPassword(bcrypt.hash, SALT_ROUNDS),
        createUserFromRequest(UserModel),
        saveUserToDatabase,
        sendFormattedUser
      );
  }
}
