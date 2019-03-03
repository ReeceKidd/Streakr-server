import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../validationErrorMessageSenderMiddleware';
import { DecodedJsonWebToken } from '../../Auth/decodeJsonWebTokenMiddleware';

export interface VerifyJsonWebTokenResponseLocals {
    jsonWebToken?: string;
    decodedJsonWebToken?: DecodedJsonWebToken
    jsonWebTokenError?: object
}

const verifyJsonWebTokenValidationSchema = {};

export const jsonWebTokenVerificationRequestValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, verifyJsonWebTokenValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};