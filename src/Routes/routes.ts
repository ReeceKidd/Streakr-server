import StreakLogic from "../Logic/Streak/streak";
import UserLogic from "../Logic/User/user";
import { UserValidation } from "../validation/user.validation";
import { celebrate, errors } from "celebrate";
import { isAuthenticated } from "../../config/passport";
import { UserMiddleware } from "../Middleware/user.middleware";

export class Routes {
  public routes(app): void {
  
    app.route("/users").get(UserLogic.getAllUsers);
    app
      .route("/user/login")
      .post(celebrate(UserValidation.login), UserLogic.login);
    app
      .route("/user/register")
      .post(
        celebrate(UserValidation.register),
        UserMiddleware.doesUserEmailExist,
        UserMiddleware.userEmailExistsValidation,
        UserMiddleware.doesUserNameExist,
        UserMiddleware.userNameExistsValidation,
        UserLogic.register
      );

    app
      .route("/streak")
      .get(StreakLogic.get)
      .post(StreakLogic.post);
    app
      .route("/streak/:id")
      .get(StreakLogic.getById)
      .delete(StreakLogic.delete)
      .put(StreakLogic.update);
    app.use(errors());
  }
}
