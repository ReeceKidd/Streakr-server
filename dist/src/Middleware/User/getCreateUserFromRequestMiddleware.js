"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getCreateUserFromRequestMiddleware = (User) => (request, response, next) => {
    const { hashedPassword } = response.locals;
    const { userName, email } = request.body;
    response.locals.newUser = new User({ userName, email, password: hashedPassword });
    next();
};
exports.getCreateUserFromRequestMiddleware = getCreateUserFromRequestMiddleware;
//# sourceMappingURL=getCreateUserFromRequestMiddleware.js.map