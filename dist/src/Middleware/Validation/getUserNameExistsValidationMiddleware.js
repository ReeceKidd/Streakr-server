"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserNameExistsValidationMiddleware = (generateAlreadyExistsMessage, userNameKey) => (request, response, next) => {
    try {
        const { userNameExists } = response.locals;
        const { userName } = request.body;
        if (userNameExists) {
            return response.status(400).send({
                message: generateAlreadyExistsMessage(userNameKey, userName)
            });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.getUserNameExistsValidationMiddleware = getUserNameExistsValidationMiddleware;
//# sourceMappingURL=getUserNameExistsValidationMiddleware.js.map