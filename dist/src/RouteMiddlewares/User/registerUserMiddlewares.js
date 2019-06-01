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
const bcryptjs_1 = require("bcryptjs");
const User_1 = require("../../Models/User");
const validationErrorMessageSenderMiddleware_1 = require("../../SharedMiddleware/validationErrorMessageSenderMiddleware");
const generateAlreadyExistsMessage_1 = require("../../Utils/generateAlreadyExistsMessage");
const keys_1 = require("../../Constants/Keys/keys");
const saltRounds_1 = require("../../Constants/Auth/saltRounds");
const responseCodes_1 = require("../../Server/responseCodes");
const registerValidationSchema = {
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
};
exports.userRegistrationValidationMiddleware = (request, response, next) => {
    Joi.validate(request.body, registerValidationSchema, validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next));
};
exports.getDoesUserEmailExistMiddleware = userModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email } = request.body;
        const user = yield userModel.findOne({ email });
        if (user) {
            response.locals.emailExists = true;
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.doesUserEmailExistMiddleware = exports.getDoesUserEmailExistMiddleware(User_1.userModel);
exports.getEmailExistsValidationMiddleware = (emailAlreadyExistsMessage, subject, emailKey) => (request, response, next) => {
    try {
        const { emailExists } = response.locals;
        const { email } = request.body;
        if (emailExists) {
            return response.status(responseCodes_1.ResponseCodes.badRequest).send({
                message: emailAlreadyExistsMessage(subject, emailKey, email),
            });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.emailExistsValidationMiddleware = exports.getEmailExistsValidationMiddleware(generateAlreadyExistsMessage_1.generateAlreadyExistsMessage, "User", keys_1.emailKey);
exports.setUserNameToLowercaseMiddleware = (request, response, next) => {
    try {
        const { userName } = request.body;
        response.locals.lowerCaseUserName = userName.toLowerCase();
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.getDoesUserNameExistMiddleware = userModel => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { lowerCaseUserName } = response.locals;
        const user = yield userModel.findOne({ userName: lowerCaseUserName });
        if (user) {
            response.locals.userNameExists = true;
        }
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.doesUserNameExistMiddleware = exports.getDoesUserNameExistMiddleware(User_1.userModel);
exports.getUserNameExistsValidationMiddleware = (generateAlreadyExistsMessage, subject, userNameKey) => (request, response, next) => {
    try {
        const { userNameExists, lowerCaseUserName } = response.locals;
        if (userNameExists) {
            return response.status(responseCodes_1.ResponseCodes.badRequest).send({
                message: generateAlreadyExistsMessage(subject, userNameKey, lowerCaseUserName),
            });
        }
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.userNameExistsValidationMiddleware = exports.getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage_1.generateAlreadyExistsMessage, "User", keys_1.userNameKey);
exports.getHashPasswordMiddleware = (hash, salt) => (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { password } = request.body;
        response.locals.hashedPassword = yield hash(password, salt);
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.hashPasswordMiddleware = exports.getHashPasswordMiddleware(bcryptjs_1.hash, saltRounds_1.saltRounds);
exports.getCreateUserFromRequestMiddleware = user => (request, response, next) => {
    try {
        const { hashedPassword, lowerCaseUserName } = response.locals;
        const { email } = request.body;
        response.locals.newUser = new user({ userName: lowerCaseUserName, email, password: hashedPassword });
        next();
    }
    catch (err) {
        next(err);
    }
};
exports.createUserFromRequestMiddleware = exports.getCreateUserFromRequestMiddleware(User_1.userModel);
exports.saveUserToDatabaseMiddleware = (request, response, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { newUser } = response.locals;
        response.locals.savedUser = yield newUser.save();
        next();
    }
    catch (err) {
        next(err);
    }
});
exports.sendFormattedUserMiddleware = (request, response, next) => {
    try {
        const { savedUser } = response.locals;
        savedUser.password = undefined;
        return response.status(responseCodes_1.ResponseCodes.created).send(savedUser);
    }
    catch (err) {
        next(err);
    }
};
exports.registerUserMiddlewares = [
    exports.userRegistrationValidationMiddleware,
    exports.doesUserEmailExistMiddleware,
    exports.emailExistsValidationMiddleware,
    exports.setUserNameToLowercaseMiddleware,
    exports.doesUserNameExistMiddleware,
    exports.userNameExistsValidationMiddleware,
    exports.hashPasswordMiddleware,
    exports.createUserFromRequestMiddleware,
    exports.saveUserToDatabaseMiddleware,
    exports.sendFormattedUserMiddleware
];
//# sourceMappingURL=registerUserMiddlewares.js.map