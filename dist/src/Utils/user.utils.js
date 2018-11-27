"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("./../Models/User");
class UserUtils {
    static createUserFromRequest(userName, email, hashedPassword) {
        return new User_1.default({ userName, email, password: hashedPassword });
    }
}
exports.UserUtils = UserUtils;
//# sourceMappingURL=user.utils.js.map