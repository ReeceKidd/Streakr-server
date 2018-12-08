"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_validation_1 = require("../validation/user.validation");
const celebrate_1 = require("celebrate");
const user_validation_middleware_1 = require("../Middleware/user.validation.middleware");
const user_utils_1 = require("../Middleware/user.utils");
const userDatabaseHelper_1 = require("../Middleware/Database/userDatabaseHelper");
const passsord_helper_1 = require("../Middleware/passsord.helper");
class Routes {
    routes(app) {
        // app.route("/users").get(UserLogic.getAllUsers);
        // app
        //   .route("/user/login")
        //   .post(celebrate(UserValidation.login), UserLogic.login);
        app
            .route("/user/register")
            .post(celebrate_1.celebrate(user_validation_1.UserValidation.register), userDatabaseHelper_1.UserDatabaseHelper.injectDependencies, userDatabaseHelper_1.UserDatabaseHelper.doesUserEmailExist, user_validation_middleware_1.UserValidationMiddleware.injectDependencies, user_validation_middleware_1.UserValidationMiddleware.emailExistsValidation, userDatabaseHelper_1.UserDatabaseHelper.doesUserNameExist, user_validation_middleware_1.UserValidationMiddleware.userNameExistsValidation, passsord_helper_1.PasswordHelper.injectDependencies, passsord_helper_1.PasswordHelper.setHashedPassword, user_utils_1.UserUtils.createUserFromRequest, userDatabaseHelper_1.UserDatabaseHelper.saveUserToDatabase);
        app.use(celebrate_1.errors());
    }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map