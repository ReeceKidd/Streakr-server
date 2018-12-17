import { UserValidation } from "../validation/user.validation";
import { celebrate, errors } from "celebrate";
import { UserUtils } from "../Middleware/user.utils";
import { PasswordHelper } from "../Middleware/passsord.helper";
import  UserRouter from "../Logic/User/user";
import UserModel from "../Models/User"
import { doesUserEmailExist } from "../Middleware/Database/doesEmailExist";

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
        //doesUserEmailExist(),
        //UserValidationMiddleware.emailExistsValidation,
        //UserDatabaseHelper.doesUserNameExist,
        //UserValidationMiddleware.userNameExistsValidation,
        PasswordHelper.injectDependencies,
        PasswordHelper.setHashedPassword,
        UserUtils.createUserFromRequest,
       // UserDatabaseHelper.saveUserToDatabase
      );
    app.use(errors());
    
  }
}
