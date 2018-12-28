"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcryptjs");
const User_1 = require("../Models/User");
const getDoesUserEmailExistMiddleware_1 = require("../Middleware/Database/getDoesUserEmailExistMiddleware");
const getEmailExistsValidationMiddleware_1 = require("../Middleware/Validation/getEmailExistsValidationMiddleware");
const errorMessage_helper_1 = require("../Utils/errorMessage.helper");
const getDoesUserNameExistMiddleware_1 = require("../Middleware/Database/getDoesUserNameExistMiddleware");
const getUserNameExistsValidationMiddleware_1 = require("../Middleware/Validation/getUserNameExistsValidationMiddleware");
const getHashPasswordMiddleware_1 = require("../Middleware/Password/getHashPasswordMiddleware");
const getCreateUserFromRequestMiddleware_1 = require("../Middleware/User/getCreateUserFromRequestMiddleware");
const getSaveUserToDatabaseMiddleware_1 = require("../Middleware/Database/getSaveUserToDatabaseMiddleware");
const getSendFormattedUserMiddleware_1 = require("../Middleware/User/getSendFormattedUserMiddleware");
const getUserRegistrationValidationMiddleware_1 = require("../Middleware/Validation/getUserRegistrationValidationMiddleware");
const express_1 = require("express");
const saltRounds = 10;
const User = {
    register: "register",
    login: "login"
};
const emailKey = "email";
const userNameKey = "userName";
const userRouter = express_1.Router();
const doesUserEmailExistMiddleware = getDoesUserEmailExistMiddleware_1.getDoesUserEmailExistMiddleware(User_1.UserModel);
const emailExistsValidationMiddleware = getEmailExistsValidationMiddleware_1.getEmailExistsValidationMiddleware(errorMessage_helper_1.ErrorMessageHelper.generateAlreadyExistsMessage, emailKey);
const doesUserNameExistMiddleware = getDoesUserNameExistMiddleware_1.getDoesUserNameExistMiddleware(User_1.UserModel);
const userNameExistsValidationMiddleware = getUserNameExistsValidationMiddleware_1.getUserNameExistsValidationMiddleware(errorMessage_helper_1.ErrorMessageHelper.generateAlreadyExistsMessage, userNameKey);
const hashPasswordMiddleware = getHashPasswordMiddleware_1.getHashPasswordMiddleware(bcrypt.hash, saltRounds);
const createUserFromRequestMiddleware = getCreateUserFromRequestMiddleware_1.getCreateUserFromRequestMiddleware(User_1.UserModel);
userRouter.post(`/${User.register}`, getUserRegistrationValidationMiddleware_1.getUserRegistrationValidationMiddleware, doesUserEmailExistMiddleware, emailExistsValidationMiddleware, doesUserNameExistMiddleware, userNameExistsValidationMiddleware, hashPasswordMiddleware, createUserFromRequestMiddleware, getSaveUserToDatabaseMiddleware_1.getSaveUserToDatabaseMiddleware, getSendFormattedUserMiddleware_1.getSendFormattedUserMiddleware);
userRouter.post(`/${User.login}`);
exports.default = userRouter;
//# sourceMappingURL=userRouter.js.map