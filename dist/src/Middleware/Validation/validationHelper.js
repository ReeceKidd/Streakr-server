"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notAllowedParameterErrorRegExp = /is not allowed/;
exports.getValidationCallback = (request, response, next) => (error) => {
    if (error) {
        if (notAllowedParameterErrorRegExp.test(error.message)) {
            response.status(400).send({ message: error.message });
        }
        else {
            response.status(422).send({ message: error.message });
        }
    }
    else {
        next();
    }
};
//# sourceMappingURL=validationHelper.js.map