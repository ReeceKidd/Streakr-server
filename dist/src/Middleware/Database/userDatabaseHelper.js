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
const User_1 = require("../../Models/User");
class UserDatabaseHelper {
    static injectDependencies(request, response, next) {
        response.locals.userModel = User_1.default;
        next();
    }
    static saveUserToDatabase(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { newUser } = response.locals;
            console.log(newUser);
            try {
                const user = yield newUser.save();
                return response.send(user);
            }
            catch (err) {
                next(err);
            }
            // response.locals.user = user;
            // next();
        });
    }
    static doesUserEmailExist(request, response, next) {
        const { email } = request.body;
        const { userModel } = response.locals;
        userModel.findOne({ email }, UserDatabaseHelper.doesEmailExist(response, next));
    }
    static doesUserNameExist(request, response, next) {
        const { userName } = request.body;
        const { userModel } = response.locals;
        userModel.findOne({ userName: userName }, UserDatabaseHelper.doesUserNameExistCallBack(response, next));
    }
}
UserDatabaseHelper.doesEmailExist = (response, next) => (err, email) => {
    if (err)
        return response.send(err);
    if (email)
        response.locals.emailExists = true;
    next();
};
UserDatabaseHelper.doesUserNameExistCallBack = (response, next) => (err, userName) => {
    if (err)
        return response.send(err);
    if (userName)
        response.locals.userNameExists = true;
    next();
};
exports.UserDatabaseHelper = UserDatabaseHelper;
//# sourceMappingURL=userDatabaseHelper.js.map