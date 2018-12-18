import { UserValidation } from "../validation/user.validation";
import { celebrate, errors } from "celebrate";
import * as bcrypt from 'bcrypt'
import { default as User } from "../Models/User"

import  UserRouter from "../Logic/User/user";
import UserModel from "../Models/User"
import { doesUserEmailExist } from "../Middleware/Database/doesEmailExist";
import { emailExistsValidation} from "../Middleware/Validation/emailExistsValidation";
import { ErrorMessageHelper } from "../Utils/errorMessage.helper";
import { doesUserNameExist } from "../Middleware/Database/doesUserNameExist";
import { userNameExistsValidation } from "../Middleware/Validation/userNameExistsValidation";
import { hashPassword } from "../Middleware/Password/hashPassword";
import { createUserFromRequest} from "../Middleware/User/createUserFromRequest";
import { saveUserToDatabase } from "../Middleware/Database/saveUserToDatabase";

const SALT_ROUNDS = 10

export class Routes {
  public routes(app): void {
     app.route("/users").get(UserRouter.getAllUsers);
    // app
    //   .route("/user/login")
    //   .post(celebrate(UserValidation.login), UserLogic.login);
    app
      .route("/user/register")
      .post(
        celebrate(UserValidation.register),
        doesUserEmailExist(UserModel.findOne),
        emailExistsValidation(ErrorMessageHelper.generateAlreadyExistsMessage),
        doesUserNameExist(UserModel.findOne),
        userNameExistsValidation(ErrorMessageHelper.generateAlreadyExistsMessage),
        hashPassword(bcrypt.hash, SALT_ROUNDS),
        createUserFromRequest(User),
       saveUserToDatabase
      );
    app.use(errors());
    
  }
}
