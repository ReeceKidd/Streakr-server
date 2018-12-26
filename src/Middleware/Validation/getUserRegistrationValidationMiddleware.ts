import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'

import { getValidationCallback } from './validationHelper'

const registerValidationSchema = {
        userName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
};


export const getUserRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, registerValidationSchema, getValidationCallback(request, response, next));
 };