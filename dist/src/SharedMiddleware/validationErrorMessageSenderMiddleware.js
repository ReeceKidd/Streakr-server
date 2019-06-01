"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseCodes_1 = require("../Server/responseCodes");
const notAllowedParameterErrorRegExp = /is not allowed/;
exports.getValidationErrorMessageSenderMiddleware = (request, response, next) => (error) => {
    if (error) {
        if (notAllowedParameterErrorRegExp.test(error.message)) {
            response.status(responseCodes_1.ResponseCodes.badRequest).send({ message: error.message });
        }
        else {
            response.status(responseCodes_1.ResponseCodes.unprocessableEntity).send({ message: error.message });
        }
    }
    else {
        next();
    }
};
//# sourceMappingURL=validationErrorMessageSenderMiddleware.js.map