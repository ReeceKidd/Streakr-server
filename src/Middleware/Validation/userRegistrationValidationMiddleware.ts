import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'

import { getValidationErrorMessageSenderMiddleware } from './validationErrorMessageSenderMiddleware'

const registerValidationSchema = {
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
};


const getUserRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, registerValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
 };

 const userRegistrationValidationMiddleware = getUserRegistrationValidationMiddleware

 export { getUserRegistrationValidationMiddleware, userRegistrationValidationMiddleware}
