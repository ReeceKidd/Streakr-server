"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const validationErrorMessageSenderMiddleware_1 = require("../../SharedMiddleware/validationErrorMessageSenderMiddleware");
const SoloStreak_1 = require("../../Models/SoloStreak");
const responseCodes_1 = require("../../Server/responseCodes");
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const failureMessages_1 = require("../../Messages/failureMessages");
const messageCategories_1 = require("../../Messages/messageCategories");
const getSoloStreakParamsValidationSchema = {
    soloStreakId: Joi.string().required()
};
exports.getSoloStreakParamsValidationMiddleware = (request, response, next) => {
    Joi.validate(request.params, getSoloStreakParamsValidationSchema, validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next));
};
exports.getRetreiveSoloStreakMiddleware = soloStreakModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { soloStreakId } = request.params;
        response.locals.soloStreak = yield soloStreakModel.findOne({ _id: soloStreakId }).lean();
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.retreiveSoloStreakMiddleware = exports.getRetreiveSoloStreakMiddleware(SoloStreak_1.soloStreakModel);
exports.getSendSoloStreakDoesNotExistErrorMessageMiddleware = (doesNotExistErrorResponseCode, localisedSoloStreakDoesNotExistErrorMessage) => (request, response, next) => {
    try {
        const { soloStreak } = response.locals;
        if (!soloStreak) {
            return response.status(doesNotExistErrorResponseCode).send({ message: localisedSoloStreakDoesNotExistErrorMessage });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
const localisedSoloStreakDoesNotExistErrorMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.soloStreakDoesNotExist);
exports.sendSoloStreakDoesNotExistErrorMessageMiddleware = exports.getSendSoloStreakDoesNotExistErrorMessageMiddleware(responseCodes_1.ResponseCodes.badRequest, localisedSoloStreakDoesNotExistErrorMessage);
exports.getSendSoloStreakMiddleware = (resourceCreatedResponseCode) => (request, response, next) => {
    try {
        const { soloStreak } = response.locals;
        return response.status(resourceCreatedResponseCode).send(Object.assign({}, soloStreak));
    }
    catch (err) {
        next(err);
    }
};
exports.sendSoloStreakMiddleware = exports.getSendSoloStreakMiddleware(responseCodes_1.ResponseCodes.success);
exports.getSoloStreakMiddlewares = [
    exports.getSoloStreakParamsValidationMiddleware,
    exports.retreiveSoloStreakMiddleware,
    exports.sendSoloStreakDoesNotExistErrorMessageMiddleware,
    exports.sendSoloStreakMiddleware
];
//# sourceMappingURL=getSoloStreakMiddlewares.js.map