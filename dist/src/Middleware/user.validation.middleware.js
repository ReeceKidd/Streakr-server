"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userDatabaseHelper_1 = require("./Database/userDatabaseHelper");
const errorMessage_helper_1 = require("../Utils/errorMessage.helper");
const emailKey = "email";
const userNameKey = "userName";
class UserValidationMiddleware {
    static injectDependencies(request, response, next) {
        response.locals.doesUserEmailExist = userDatabaseHelper_1.UserDatabaseHelper.doesUserEmailExist;
        response.locals.doesUserNameExist = userDatabaseHelper_1.UserDatabaseHelper.doesUserNameExist;
        next();
    }
    static emailExistsValidation(request, response, next) {
        const { emailExists } = response.locals;
        const { email } = request.body.email;
        if (emailExists) {
            return response.status(400).send({
                message: errorMessage_helper_1.ErrorMessageHelper.generateAlreadyExistsMessage(emailKey, email)
            });
        }
        next();
    }
    static userNameExistsValidation(request, response, next) {
        const { userNameExists } = response.locals;
        const { userName } = request.body;
        if (userNameExists) {
            return response.status(400).send({
                message: errorMessage_helper_1.ErrorMessageHelper.generateAlreadyExistsMessage(userNameKey, userName)
            });
        }
        else
            next();
    }
}
exports.UserValidationMiddleware = UserValidationMiddleware;
//# sourceMappingURL=user.validation.middleware.js.map