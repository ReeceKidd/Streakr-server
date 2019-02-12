import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../validationErrorMessageSenderMiddleware';

// FIgure out what has to be imported here. 
export enum SupportedWhoIsInvolvedOptions {
    justMe = 'justMe',
    group = 'Group'
}

export interface StreakRegistrationRequestBody {
    userId: string,
    streakName: string,
    streakDescription: string,
    whoIsInvolved: string,
    soloForfeitDescription?: string,
    soloRewardDescription?: string,
    groupForfeitDescription?: string,
    groupRewardDescription?: string
}

const streakRegisterstrationValidationSchema = {
    userId: Joi.string().required(),
    streakName: Joi.string().required(),
    streakDescription: Joi.string().required(),
    whoIsInvolved: Joi.string().required(),
    soloForfeitDescription: Joi.string(),
    soloRewardDescription: Joi.string(),
    groupForfeitDescription: Joi.string(),
    groupRewardDescription: Joi.string()
};

export const streakRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, streakRegisterstrationValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};
