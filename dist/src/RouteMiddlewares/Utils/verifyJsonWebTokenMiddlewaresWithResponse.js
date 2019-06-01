"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyJsonWebTokenMiddlewares_1 = require("./verifyJsonWebTokenMiddlewares");
const successMessages_1 = require("../../Messages/successMessages");
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const messageCategories_1 = require("../../Messages/messageCategories");
exports.getJsonWebTokenVerificationSuccessfulMiddleware = (jsonWebTokenVerificationSuccessfulMessage) => (request, response, next) => {
    try {
        const { decodedJsonWebToken } = response.locals;
        const jsonWebTokenVerificationSuccessfulResponse = { decodedJsonWebToken, message: jsonWebTokenVerificationSuccessfulMessage, auth: true };
        return response.send(jsonWebTokenVerificationSuccessfulResponse);
    }
    catch (err) {
        next(err);
    }
};
const localisedJsonWebTokenVerificationSuccessMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.successMessages, successMessages_1.SuccessMessageKeys.jsonWebTokenVerificationSuccessfulMessage);
exports.jsonWebTokenVerificationSuccessfulMiddleware = exports.getJsonWebTokenVerificationSuccessfulMiddleware(localisedJsonWebTokenVerificationSuccessMessage);
exports.verifyJsonWebTokenMiddlewaresWithResponse = [
    verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares,
    exports.jsonWebTokenVerificationSuccessfulMiddleware
];
//# sourceMappingURL=verifyJsonWebTokenMiddlewaresWithResponse.js.map