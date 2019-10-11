import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { streakTrackingEventModel, StreakTrackingEventModel } from '../../Models/StreakTrackingEvent';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakTrackingEventTypes, StreakTypes, GroupStreakTypes } from '@streakoid/streakoid-sdk/lib';

export interface StreakTrackingEventRequestBody {
    type: StreakTrackingEventTypes;
    streakId: string;
    userId: string;
    streakType: StreakTypes;
    createdAt: Date;
    modifiedAt: Date;
    groupStreakType: GroupStreakTypes;
}

const createStreakTrackingEventBodyValidationSchema = {
    type: Joi.string().valid(Object.keys(StreakTrackingEventTypes)),
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

export const validateStreakTrackingEventBody = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { streakType, groupStreakType } = request.body;
        if (streakType === StreakTypes.soloStreak && groupStreakType) {
            throw new CustomError(ErrorType.GroupStreakTypeShouldNotBeDefined);
        }
        if (streakType === StreakTypes.groupMemberStreak && !groupStreakType) {
            throw new CustomError(ErrorType.GroupStreakTypeMustBeDefined);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.ValidateStreakTrackingEventBody, err));
    }
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
    validateStreakTrackingEventBody,
    saveStreakTrackingEventToDatabaseMiddleware,
    sendFormattedStreakTrackingEventMiddleware,
];
