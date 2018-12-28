import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'

import { getValidationCallback } from './validationHelper'

const loginValidationSchema = {
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
};


export const getUserLoginValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, loginValidationSchema, getValidationCallback(request, response, next));
 };
