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
const moment = __importStar(require("moment-timezone"));
const Joi = __importStar(require("joi"));
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const messageCategories_1 = require("../../Messages/messageCategories");
const failureMessages_1 = require("../../Messages/failureMessages");
const headers_1 = require("../../Server/headers");
const responseCodes_1 = require("../../Server/responseCodes");
const User_1 = require("../../Models/User");
const SoloStreak_1 = require("../../Models/SoloStreak");
const CompleteTask_1 = require("../../Models/CompleteTask");
const validationErrorMessageSenderMiddleware_1 = require("../../SharedMiddleware/validationErrorMessageSenderMiddleware");
exports.soloStreakTaskCompleteParamsValidationSchema = {
    soloStreakId: Joi.string().required()
};
exports.soloStreakTaskCompleteParamsValidationMiddleware = (request, response, next) => {
    Joi.validate(request.params, exports.soloStreakTaskCompleteParamsValidationSchema, validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next));
};
exports.getSoloStreakExistsMiddleware = soloStreakModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { soloStreakId } = request.params;
        const soloStreak = yield soloStreakModel.findOne({ _id: soloStreakId });
        response.locals.soloStreak = soloStreak;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.soloStreakExistsMiddleware = exports.getSoloStreakExistsMiddleware(SoloStreak_1.soloStreakModel);
exports.getSendSoloStreakDoesNotExistErrorMessageMiddleware = (unprocessableEntityStatusCode, localisedSoloStreakDoesNotExistErrorMessage) => (request, response, next) => {
    try {
        const { soloStreak } = response.locals;
        if (!soloStreak) {
            return response.status(unprocessableEntityStatusCode).send({ message: localisedSoloStreakDoesNotExistErrorMessage });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
const localisedSoloStreakDoesNotExistMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.soloStreakDoesNotExist);
exports.sendSoloStreakDoesNotExistErrorMessageMiddleware = exports.getSendSoloStreakDoesNotExistErrorMessageMiddleware(responseCodes_1.ResponseCodes.unprocessableEntity, localisedSoloStreakDoesNotExistMessage);
exports.getRetreiveTimezoneHeaderMiddleware = timezoneHeader => (request, response, next) => {
    try {
        response.locals.timezone = request.header(timezoneHeader);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.retreiveTimezoneHeaderMiddleware = exports.getRetreiveTimezoneHeaderMiddleware(headers_1.SupportedRequestHeaders.xTimezone);
exports.getSendMissingTimezoneErrorResponseMiddleware = (unprocessableEntityCode, localisedErrorMessage) => (request, response, next) => {
    try {
        const { timezone } = response.locals;
        if (!timezone) {
            return response.status(unprocessableEntityCode).send({ message: localisedErrorMessage });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
const localisedMissingTimezoneHeaderMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.missingTimezoneHeaderMessage);
exports.sendMissingTimezoneErrorResponseMiddleware = exports.getSendMissingTimezoneErrorResponseMiddleware(responseCodes_1.ResponseCodes.unprocessableEntity, localisedMissingTimezoneHeaderMessage);
exports.getValidateTimezoneMiddleware = isValidTimezone => (request, response, next) => {
    try {
        const { timezone } = response.locals;
        response.locals.validTimezone = isValidTimezone(timezone);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.validateTimezoneMiddleware = exports.getValidateTimezoneMiddleware(moment.tz.zone);
exports.getSendInvalidTimezoneErrorResponseMiddleware = (unprocessableEntityCode, localisedErrorMessage) => (request, response, next) => {
    try {
        const { validTimezone } = response.locals;
        if (!validTimezone) {
            return response.status(unprocessableEntityCode).send({ message: localisedErrorMessage });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
const localisedInvalidTimezoneMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.invalidTimezoneMessage);
exports.sendInvalidTimezoneErrorResponseMiddleware = exports.getSendInvalidTimezoneErrorResponseMiddleware(responseCodes_1.ResponseCodes.unprocessableEntity, localisedInvalidTimezoneMessage);
exports.getRetreiveUserMiddleware = userModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { minimumUserData } = response.locals;
        const user = yield userModel.findOne({ _id: minimumUserData._id }).lean();
        response.locals.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.retreiveUserMiddleware = exports.getRetreiveUserMiddleware(User_1.userModel);
exports.getSendUserDoesNotExistErrorMiddlware = (unprocessableEntityCode, localisedUserDoesNotExistErrorMessage) => (request, response, next) => {
    try {
        const { user } = response.locals;
        if (!user) {
            return response.status(unprocessableEntityCode).send({ message: localisedUserDoesNotExistErrorMessage });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
const localisedUserDoesNotExistErrorMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.userDoesNotExistMessage);
exports.sendUserDoesNotExistErrorMiddleware = exports.getSendUserDoesNotExistErrorMiddlware(responseCodes_1.ResponseCodes.unprocessableEntity, localisedUserDoesNotExistErrorMessage);
exports.getSetTaskCompleteTimeMiddleware = moment => (request, response, next) => {
    try {
        const { timezone } = response.locals;
        const taskCompleteTime = moment().tz(timezone);
        response.locals.taskCompleteTime = taskCompleteTime;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.setTaskCompleteTimeMiddleware = exports.getSetTaskCompleteTimeMiddleware(moment);
exports.getSetDayTaskWasCompletedMiddleware = (dayFormat) => (request, response, next) => {
    try {
        const { taskCompleteTime } = response.locals;
        const taskCompleteDay = taskCompleteTime.format(dayFormat);
        response.locals.taskCompleteDay = taskCompleteDay;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.dayFormat = "YYYY-MM-DD";
exports.setDayTaskWasCompletedMiddleware = exports.getSetDayTaskWasCompletedMiddleware(exports.dayFormat);
exports.getHasTaskAlreadyBeenCompletedTodayMiddleware = completeTaskModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { soloStreakId } = request.params;
        const { taskCompleteDay, user } = response.locals;
        const taskAlreadyCompletedToday = yield completeTaskModel.findOne({ userId: user._id, streakId: soloStreakId, taskCompleteDay });
        response.locals.taskAlreadyCompletedToday = taskAlreadyCompletedToday;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.hasTaskAlreadyBeenCompletedTodayMiddleware = exports.getHasTaskAlreadyBeenCompletedTodayMiddleware(CompleteTask_1.completeTaskModel);
exports.getSendTaskAlreadyCompletedTodayErrorMiddleware = (unprocessableEntityResponseCode, localisedTaskAlreadyCompletedTodayErrorMessage) => (request, response, next) => {
    try {
        const { taskAlreadyCompletedToday } = response.locals;
        if (taskAlreadyCompletedToday) {
            return response.status(unprocessableEntityResponseCode).send({ message: localisedTaskAlreadyCompletedTodayErrorMessage });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
const localisedTaskAlreadyCompletedTodayErrorMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.taskAlreadyCompleted);
exports.sendTaskAlreadyCompletedTodayErrorMiddleware = exports.getSendTaskAlreadyCompletedTodayErrorMiddleware(responseCodes_1.ResponseCodes.unprocessableEntity, localisedTaskAlreadyCompletedTodayErrorMessage);
exports.getCreateCompleteTaskDefinitionMiddleware = (streakType) => (request, response, next) => {
    try {
        const { soloStreakId } = request.params;
        const { taskCompleteTime, taskCompleteDay, user } = response.locals;
        const completeTaskDefinition = {
            userId: user._id,
            streakId: soloStreakId,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
            streakType
        };
        response.locals.completeTaskDefinition = completeTaskDefinition;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.createCompleteTaskDefinitionMiddleware = exports.getCreateCompleteTaskDefinitionMiddleware(CompleteTask_1.TypesOfStreak.soloStreak);
exports.getSaveTaskCompleteMiddleware = (completeTaskModel) => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { completeTaskDefinition } = response.locals;
        const completeTask = yield new completeTaskModel(completeTaskDefinition).save();
        response.locals.completeTask = completeTask;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.saveTaskCompleteMiddleware = exports.getSaveTaskCompleteMiddleware(CompleteTask_1.completeTaskModel);
exports.getStreakMaintainedMiddleware = soloStreakModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { soloStreakId } = request.params;
        yield soloStreakModel.updateOne({ _id: soloStreakId }, { completedToday: true, $inc: { "currentStreak.numberOfDaysInARow": 1 } });
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.streakMaintainedMiddleware = exports.getStreakMaintainedMiddleware(SoloStreak_1.soloStreakModel);
exports.getSendTaskCompleteResponseMiddleware = (resourceCreatedResponseCode) => (request, response, next) => {
    try {
        const { completeTask } = response.locals;
        return response.status(resourceCreatedResponseCode).send({ completeTask });
    }
    catch (err) {
        next(err);
    }
};
exports.sendTaskCompleteResponseMiddleware = exports.getSendTaskCompleteResponseMiddleware(responseCodes_1.ResponseCodes.created);
exports.createSoloStreakCompleteTaskMiddlewares = [
    exports.soloStreakTaskCompleteParamsValidationMiddleware,
    exports.soloStreakExistsMiddleware,
    exports.sendSoloStreakDoesNotExistErrorMessageMiddleware,
    exports.retreiveTimezoneHeaderMiddleware,
    exports.sendMissingTimezoneErrorResponseMiddleware,
    exports.validateTimezoneMiddleware,
    exports.sendInvalidTimezoneErrorResponseMiddleware,
    exports.retreiveUserMiddleware,
    exports.sendUserDoesNotExistErrorMiddleware,
    exports.setTaskCompleteTimeMiddleware,
    exports.setDayTaskWasCompletedMiddleware,
    exports.hasTaskAlreadyBeenCompletedTodayMiddleware,
    exports.sendTaskAlreadyCompletedTodayErrorMiddleware,
    exports.createCompleteTaskDefinitionMiddleware,
    exports.saveTaskCompleteMiddleware,
    exports.streakMaintainedMiddleware,
    exports.sendTaskCompleteResponseMiddleware
];
//# sourceMappingURL=createSoloStreakCompleteTaskMiddlewares.js.map