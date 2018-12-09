import { UserValidation } from "../validation/user.validation";
import { celebrate, errors } from "celebrate";
import { UserValidationMiddleware } from "../Middleware/user.validation.middleware";
import { UserUtils } from "../Middleware/user.utils";
import { UserDatabaseHelper } from "../Middleware/Database/userDatabaseHelper";
import { PasswordHelper } from "../Middleware/passsord.helper";

export class Routes {
  public routes(app): void {
    // app.route("/users").get(UserLogic.getAllUsers);
    // app
    //   .route("/user/login")
    //   .post(celebrate(UserValidation.login), UserLogic.login);
    app
      .route("/user/register")
      .post(
        celebrate(UserValidation.register),
        UserDatabaseHelper.injectDependencies,
        UserDatabaseHelper.doesUserEmailExist,
        UserValidationMiddleware.injectDependencies,
        UserValidationMiddleware.emailExistsValidation,
        UserDatabaseHelper.doesUserNameExist,
        UserValidationMiddleware.userNameExistsValidation,
        PasswordHelper.injectDependencies,
        PasswordHelper.setHashedPassword,
        UserUtils.createUserFromRequest,
       // UserDatabaseHelper.saveUserToDatabase
      );
    app.use(errors());
    
  }
}
