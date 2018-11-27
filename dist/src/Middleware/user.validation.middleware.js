"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const userDatabaseHelper_1 = require("../DatabaseHelpers/userDatabaseHelper");
const errorMessage_helper_1 = require("../Utils/errorMessage.helper");
const emailKey = "email";
const userNameKey = "userName";
class UserValidationMiddleware {
    static injectDependencies(request, response, next) {
        response.locals.doesUserEmailExist = userDatabaseHelper_1.UserDatabaseHelper.doesUserEmailExist;
        response.locals.doesUserNameExist = userDatabaseHelper_1.UserDatabaseHelper.doesUserNameExist;
        next();
    }
    static doesEmailExist(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = request.body;
            const { doesUserEmailExist } = response.locals;
            const result = yield doesUserEmailExist(email);
            response.locals.emailExists = result;
            next();
        });
    }
    static doesUserNameExist(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userName } = request.body;
            const { doesUserNameExist } = response.locals;
            response.locals.userNameExists = yield doesUserNameExist(userName);
            next();
        });
    }
    static emailExistsValidation(request, response, next) {
        const { emailAlreadyExists, email } = response.locals;
        if (emailAlreadyExists) {
            return response
                .status(400)
                .send({
                message: errorMessage_helper_1.ErrorMessageHelper.generateAlreadyExistsMessage(emailKey, email)
            });
        }
        console.log("Passed email exists validation");
        next();
    }
    static userNameExistsValidation(request, response, next) {
        const { userNameAlreadyExists, userName } = response.locals;
        if (userNameAlreadyExists) {
            return response
                .status(400)
                .send({
                message: errorMessage_helper_1.ErrorMessageHelper.generateAlreadyExistsMessage(userNameKey, userName)
            });
        }
        else
            next();
    }
}
exports.UserValidationMiddleware = UserValidationMiddleware;
//# sourceMappingURL=user.validation.middleware.js.map