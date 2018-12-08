"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const register = {
    body: Joi.object().keys({
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    }),
};
const login = {
    body: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })
};
const UserValidation = {
    register,
    login
};
exports.UserValidation = UserValidation;
//# sourceMappingURL=user.validation.js.map