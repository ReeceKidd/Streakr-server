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
const User_1 = require("../../Models/User");
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const messageCategories_1 = require("../../Messages/messageCategories");
const failureMessages_1 = require("../../Messages/failureMessages");
const responseCodes_1 = require("../../Server/responseCodes");
const getFriendsValidationSchema = {
    userId: Joi.string().required()
};
exports.getFriendsValidationMiddleware = (request, response, next) => {
    Joi.validate(request.params, getFriendsValidationSchema, validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next));
};
exports.getRetreiveUserMiddleware = userModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { userId } = request.params;
        const user = yield userModel.findOne({ _id: userId });
        response.locals.user = user;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.retreiveUserMiddleware = exports.getRetreiveUserMiddleware(User_1.userModel);
exports.getUserExistsValidationMiddleware = userDoesNotExistMessage => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { user } = response.locals;
        if (!user) {
            return response.status(responseCodes_1.ResponseCodes.badRequest).send({
                message: userDoesNotExistMessage,
            });
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
const localisedUserDoesNotExistMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.userDoesNotExistMessage);
exports.userExistsValidationMiddleware = exports.getUserExistsValidationMiddleware(localisedUserDoesNotExistMessage);
exports.getRetreiveFriendsMiddleware = userModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { user } = response.locals;
        const { friends } = user;
        response.locals.friends = yield Promise.all(friends.map(friendId => {
            return userModel.findOne({ _id: friendId });
        }));
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.retreiveFriendsMiddleware = exports.getRetreiveFriendsMiddleware(User_1.userModel);
exports.formatFriendsMiddleware = (request, response, next) => {
    try {
        const { friends } = response.locals;
        const formattedFriends = friends.map(friend => {
            return {
                userName: friend.userName
            };
        });
        response.locals.formattedFriends = formattedFriends;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.sendFormattedFriendsMiddleware = (request, response, next) => {
    try {
        const { formattedFriends } = response.locals;
        return response.status(responseCodes_1.ResponseCodes.success).send({ friends: formattedFriends });
    }
    catch (err) {
        next(err);
    }
};
exports.getFriendsMiddlewares = [
    exports.getFriendsValidationMiddleware,
    exports.retreiveUserMiddleware,
    exports.userExistsValidationMiddleware,
    exports.retreiveFriendsMiddleware,
    exports.formatFriendsMiddleware,
    exports.sendFormattedFriendsMiddleware
];
//# sourceMappingURL=getFriendsMiddlewares.js.map