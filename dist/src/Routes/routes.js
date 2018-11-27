"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const streak_1 = require("../Logic/Streak/streak");
const user_1 = require("../Logic/User/user");
const user_validation_1 = require("../validation/user.validation");
const celebrate_1 = require("celebrate");
const user_validation_middleware_1 = require("../Middleware/user.validation.middleware");
class Routes {
    routes(app) {
        app.route("/users").get(user_1.default.getAllUsers);
        // app
        //   .route("/user/login")
        //   .post(celebrate(UserValidation.login), UserLogic.login);
        app
            .route("/user/register")
            .post(celebrate_1.celebrate(user_validation_1.UserValidation.register), user_validation_middleware_1.UserValidationMiddleware.injectDependencies, user_validation_middleware_1.UserValidationMiddleware.doesEmailExist, user_validation_middleware_1.UserValidationMiddleware.emailExistsValidation, user_validation_middleware_1.UserValidationMiddleware.doesUserNameExist, user_validation_middleware_1.UserValidationMiddleware.userNameExistsValidation);
        app
            .route("/streak")
            .get(streak_1.default.get)
            .post(streak_1.default.post);
        app
            .route("/streak/:id")
            .get(streak_1.default.getById)
            .delete(streak_1.default.delete)
            .put(streak_1.default.update);
        app.use(celebrate_1.errors());
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map