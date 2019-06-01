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
const messageCategories_1 = require("../../Messages/messageCategories");
const failureMessages_1 = require("../../Messages/failureMessages");
const soloStreakParamsValidationSchema = {
    soloStreakId: Joi.string().required()
};
exports.soloStreakParamsValidationMiddleware = (request, response, next) => {
    Joi.validate(request.params, soloStreakParamsValidationSchema, validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next));
};
const soloStreakBodyValidationSchema = {
    userId: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    completedToday: Joi.boolean()
};
exports.soloStreakRequestBodyValidationMiddleware = (request, response, next) => {
    Joi.validate(request.body, soloStreakBodyValidationSchema, validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next));
};
exports.getPatchSoloStreakMiddleware = (soloStreakModel) => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { soloStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedSoloStreak = yield soloStreakModel.findByIdAndUpdate(soloStreakId, Object.assign({}, keysToUpdate), { new: true });
        response.locals.updatedSoloStreak = updatedSoloStreak;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.getSoloStreakDoesNotExistErrorMessageMiddleware = (badRequestReponseCode, localisedSoloStreakDoesNotExistErrorMessage) => (request, response, next) => {
    try {
        const { updatedSoloStreak } = response.locals;
        if (!updatedSoloStreak) {
            return response.status(badRequestReponseCode).send({ message: localisedSoloStreakDoesNotExistErrorMessage });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
const localisedSoloStreakDoesNotExistErrorMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.soloStreakDoesNotExist);
exports.soloStreakDoesNotExistErrorMessageMiddleware = exports.getSoloStreakDoesNotExistErrorMessageMiddleware(responseCodes_1.ResponseCodes.badRequest, localisedSoloStreakDoesNotExistErrorMessage);
exports.getSendUpdatedSoloStreakMiddleware = (updatedResourceResponseCode) => (request, response, next) => {
    try {
        const { updatedSoloStreak } = response.locals;
        return response.status(updatedResourceResponseCode).send({ data: updatedSoloStreak });
    }
    catch (err) {
        next(err);
    }
};
exports.sendUpdatedSoloStreakMiddleware = exports.getSendUpdatedSoloStreakMiddleware(responseCodes_1.ResponseCodes.success);
exports.patchSoloStreakMiddleware = exports.getPatchSoloStreakMiddleware(SoloStreak_1.soloStreakModel);
exports.patchSoloStreakMiddlewares = [
    exports.soloStreakParamsValidationMiddleware,
    exports.soloStreakRequestBodyValidationMiddleware,
    exports.patchSoloStreakMiddleware,
    exports.soloStreakDoesNotExistErrorMessageMiddleware,
    exports.sendUpdatedSoloStreakMiddleware
];
//# sourceMappingURL=patchSoloStreakMiddlewares.js.map