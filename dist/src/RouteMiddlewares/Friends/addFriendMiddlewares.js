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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const validationErrorMessageSenderMiddleware_1 = require("../../SharedMiddleware/validationErrorMessageSenderMiddleware");
const User_1 = require("../../Models/User");
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const messageCategories_1 = require("../../Messages/messageCategories");
const failureMessages_1 = require("../../Messages/failureMessages");
const successMessages_1 = require("../../Messages/successMessages");
const responseCodes_1 = require("../../Server/responseCodes");
const headers_1 = require("../../Server/headers");
const routeCategories_1 = require("../../routeCategories");
const versions_1 = __importDefault(require("../../Server/versions"));
const addFriendParamsValidationSchema = {
    userId: Joi.string().required()
};
exports.addFriendParamsValidationMiddleware = (request, response, next) => {
    Joi.validate(request.params, addFriendParamsValidationSchema, validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next));
};
const addFriendBodyValidationSchema = {
    friendId: Joi.string().required()
};
exports.addFriendBodyValidationMiddleware = (request, response, next) => {
    Joi.validate(request.body, addFriendBodyValidationSchema, validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next));
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
exports.getUserExistsValidationMiddleware = userDoesNotExistMessage => (request, response, next) => {
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
};
const localisedUserDoesNotExistMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.failureMessages, failureMessages_1.FailureMessageKeys.userDoesNotExistMessage);
exports.userExistsValidationMiddleware = exports.getUserExistsValidationMiddleware(localisedUserDoesNotExistMessage);
exports.getAddFriendMiddleware = userModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { userId } = request.params;
        const { friendId } = request.body;
        const updatedUser = yield userModel.findOneAndUpdate({ _id: userId }, { $addToSet: { friends: friendId } });
        response.locals.updatedUser = updatedUser;
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.addFriendMiddleware = exports.getAddFriendMiddleware(User_1.userModel);
exports.getRetreiveFriendsDetailsMiddleware = userModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { updatedUser } = response.locals;
        const { friends } = updatedUser;
        response.locals.friends = yield userModel.find({ _id: { $in: friends } });
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.retreiveFriendsDetailsMiddleware = exports.getRetreiveFriendsDetailsMiddleware(User_1.userModel);
exports.formatFriendsMiddleware = (request, response, next) => {
    try {
        const { friends } = response.locals;
        response.locals.formattedFriends = friends.map(friend => {
            return {
                userName: friend.userName
            };
        });
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.getDefineLocationPathMiddleware = (apiVersion, userCategory, friendsProperty) => (request, response, next) => {
    try {
        const { userId } = request.params;
        const { friendId } = request.body;
        response.locals.locationPath = `/${apiVersion}/${userCategory}/${userId}/${friendsProperty}/${friendId}`;
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.defineLocationPathMiddleware = exports.getDefineLocationPathMiddleware(versions_1.default.v1, routeCategories_1.RouteCategories.users, routeCategories_1.UserProperties.friends);
exports.getSetLocationHeaderMiddleware = (locationHeader) => (request, response, next) => {
    try {
        const { locationPath } = response.locals;
        response.setHeader(locationHeader, locationPath);
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.setLocationHeaderMiddleware = exports.getSetLocationHeaderMiddleware(headers_1.SupportedResponseHeaders.location);
exports.getSendFriendAddedSuccessMessageMiddleware = (addFriendSuccessMessage) => (request, response, next) => {
    try {
        const { formattedFriends } = response.locals;
        response.status(responseCodes_1.ResponseCodes.created).send({ message: addFriendSuccessMessage, friends: formattedFriends });
    }
    catch (err) {
        next(err);
    }
};
const localisedSuccessfullyAddedFriendMessage = getLocalisedString_1.getLocalisedString(messageCategories_1.MessageCategories.successMessages, successMessages_1.SuccessMessageKeys.successfullyAddedFriend);
exports.sendFriendAddedSuccessMessageMiddleware = exports.getSendFriendAddedSuccessMessageMiddleware(localisedSuccessfullyAddedFriendMessage);
exports.addFriendMiddlewares = [
    exports.addFriendParamsValidationMiddleware,
    exports.addFriendBodyValidationMiddleware,
    exports.retreiveUserMiddleware,
    exports.userExistsValidationMiddleware,
    exports.addFriendMiddleware,
    exports.retreiveFriendsDetailsMiddleware,
    exports.formatFriendsMiddleware,
    exports.defineLocationPathMiddleware,
    exports.setLocationHeaderMiddleware,
    exports.sendFriendAddedSuccessMessageMiddleware
];
//# sourceMappingURL=addFriendMiddlewares.js.map