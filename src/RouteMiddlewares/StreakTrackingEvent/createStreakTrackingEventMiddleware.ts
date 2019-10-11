import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { streakTrackingEventModel, StreakTrackingEventModel } from '../../Models/StreakTrackingEvent';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakTrackingEvent, StreakTypes, GroupStreakTypes } from '@streakoid/streakoid-sdk/lib';

export interface StreakTrackingEventRequestBody {
    type: StreakTrackingEvent;
    streakId: string;
    userId: string;
    streakType: StreakTypes;
    createdAt: Date;
    modifiedAt: Date;
    groupStreakType: GroupStreakTypes;
}

const createStreakTrackingEventBodyValidationSchema = {
    type: Joi.string().required(),
    streakId: Joi.string().required(),
    userId: Joi.string().required(),
    streakType: Joi.string()
        .valid(Object.keys(StreakTypes))
        .required(),
    groupStreakType: Joi.string().valid(Object.keys(GroupStreakTypes)),
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
        const { type, streakId, userId, streakType, groupStreakType } = request.body;
        const newStreakTrackingEvent = new streakTrackingEvent({
            type,
            streakId,
            userId,
            streakType,
            groupStreakType,
        });
        response.locals.savedStreakTrackingEvent = await newStreakTrackingEvent.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateStreakTrackingEventFromRequestMiddleware, err));
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
