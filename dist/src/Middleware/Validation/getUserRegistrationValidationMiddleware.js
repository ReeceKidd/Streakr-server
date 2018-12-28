"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
const validationHelper_1 = require("./validationHelper");
const registerValidationSchema = {
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
};
exports.getUserRegistrationValidationMiddleware = (request, response, next) => {
    Joi.validate(request.body, registerValidationSchema, validationHelper_1.getValidationCallback(request, response, next));
};
//# sourceMappingURL=getUserRegistrationValidationMiddleware.js.map