import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { streakTrackingEventModel, StreakTrackingEventModel } from '../../Models/StreakTrackingEvent';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

export interface StreakTrackingEventRequestBody {
    type: StreakTrackingEventTypes;
    streakId: string;
    streakType: StreakTypes;
    createdAt: Date;
    modifiedAt: Date;
    userId?: string;
}

const createStreakTrackingEventBodyValidationSchema = {
    type: Joi.string().valid(Object.keys(StreakTrackingEventTypes)),
    streakId: Joi.string().required(),
    streakType: Joi.string()
        .valid(Object.keys(StreakTypes))
        .required(),
    userId: Joi.string(),
};

export const createStreakTrackingEventBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createStreakTrackingEventBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSaveStreakTrackingEventToDatabaseMiddleware = (
    streakTrackingEvent: mongoose.Model<StreakTrackingEventModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { type, streakId, streakType, userId } = request.body;
        const newStreakTrackingEvent = new streakTrackingEvent({
            type,
            streakId,
            streakType,
            userId,
        });
        response.locals.savedStreakTrackingEvent = await newStreakTrackingEvent.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveStreakTrackingEventToDatabase, err));
    }
};

export const saveStreakTrackingEventToDatabaseMiddleware = getSaveStreakTrackingEventToDatabaseMiddleware(
    streakTrackingEventModel,
);

export const sendFormattedStreakTrackingEventMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { savedStreakTrackingEvent } = response.locals;
        response.status(ResponseCodes.created).send(savedStreakTrackingEvent);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedStreakTrackingEventMiddleware, err));
    }
};

export const createStreakTrackingEventMiddlewares = [
    createStreakTrackingEventBodyValidationMiddleware,
    saveStreakTrackingEventToDatabaseMiddleware,
    sendFormattedStreakTrackingEventMiddleware,
];
