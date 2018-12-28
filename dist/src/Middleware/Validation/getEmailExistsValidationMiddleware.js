"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getEmailExistsValidationMiddleware = (generateAlreadyExistsMessage, emailKey) => (request, response, next) => {
    try {
        const { emailExists } = response.locals;
        const { email } = request.body;
        if (emailExists) {
            return response.status(400).send({
                message: generateAlreadyExistsMessage(emailKey, email)
            });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.getEmailExistsValidationMiddleware = getEmailExistsValidationMiddleware;
//# sourceMappingURL=getEmailExistsValidationMiddleware.js.map