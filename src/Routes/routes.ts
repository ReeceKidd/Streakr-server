
import { UserValidation } from "../validation/user.validation";
import { celebrate, errors } from "celebrate";
import { UserValidationMiddleware } from "../Middleware/user.validation.middleware";
import { UserUtils } from "../Middleware/user.utils";
import { UserDatabaseHelper } from "../Middleware/Database/userDatabaseHelper";

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
       UserValidationMiddleware.injectDependencies,
        UserValidationMiddleware.doesEmailExist,
        UserValidationMiddleware.emailExistsValidation,
        UserValidationMiddleware.doesUserNameExist,
        UserValidationMiddleware.userNameExistsValidation,
        UserUtils.createUserFromRequest,
        UserDatabaseHelper.saveUserToDatabase
      );

    // app
    //   .route("/streak")
    //   .get(StreakLogic.get)
    //   .post(StreakLogic.post);
    // app
    //   .route("/streak/:id")
    //   .get(StreakLogic.getById)
    //   .delete(StreakLogic.delete)
    //   .put(StreakLogic.update);
    app.use(errors());
  }
}
