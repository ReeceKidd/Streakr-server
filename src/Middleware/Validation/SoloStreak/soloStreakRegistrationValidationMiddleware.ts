import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../validationErrorMessageSenderMiddleware';


export interface SoloStreakRegistrationRequestBody {
    userId: string,
    streakName: string,
    streakDescription: string,
    createdAt: Date,
    modifiedAt: Date
}

const soloStreakRegisterstrationValidationSchema = {
    userId: Joi.string().required(),
    streakName: Joi.string().required(),
    streakDescription: Joi.string().required(),
};

export const soloStreakRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, soloStreakRegisterstrationValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};
