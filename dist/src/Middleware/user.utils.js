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
const User_1 = require("../Models/User");
class UserUtils {
    static createUserFromRequest(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { hashedPassword } = response.locals;
            const { userName, email, password } = request.body;
            response.locals.newUser = new User_1.default({ userName, email, password: hashedPassword });
            next();
        });
    }
}
exports.UserUtils = UserUtils;
//# sourceMappingURL=user.utils.js.map