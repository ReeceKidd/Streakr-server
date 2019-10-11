import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { streakTrackingEventModel, StreakTrackingEventModel } from '../../Models/StreakTrackingEvent';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';
import { StreakTypes, GroupStreakTypes, StreakTrackingEventTypes } from '@streakoid/streakoid-sdk/lib';

const streakTrackingEventQueryValidationSchema = {
    type: Joi.string().valid(Object.keys(StreakTrackingEventTypes)),
    streakId: Joi.string(),
    userId: Joi.string(),
    streakType: Joi.string().valid(Object.keys(StreakTypes)),
    groupStreakType: Joi.string().valid(Object.keys(GroupStreakTypes)),
};

export const streakTrackingEventQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        streakTrackingEventQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveStreakTrackingEventsMiddleware = (
    streakTrackingEventModel: mongoose.Model<StreakTrackingEventModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const query: {
            type?: string;
            streakId?: string;
            userId?: string;
            streakType?: StreakTypes;
            groupStreakType?: GroupStreakTypes;
        } = {};

        const { type, userId, streakId, streakType, groupStreakType } = request.query;
        if (type) {
            query.type = type;
        }
        if (streakId) {
            query.streakId = streakId;
        }
        if (userId) {
            query.userId = userId;
        }
        if (streakType) {
            query.streakType = streakType;
        }
        if (groupStreakType) {
            query.groupStreakType;
        }

        response.locals.streakTrackingEvents = await streakTrackingEventModel.find(query);

        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetStreakTrackingEventsMiddleware, err));
    }
};

export const retreiveStreakTrackingEventsMiddleware = getRetreiveStreakTrackingEventsMiddleware(
    streakTrackingEventModel,
);

export const sendStreakTrackingEventsResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { streakTrackingEvents } = response.locals;
        response.status(ResponseCodes.success).send(streakTrackingEvents);
    } catch (err) {
        next(new CustomError(ErrorType.SendStreakTrackingEventsResponseMiddleware, err));
    }
};

export const getAllStreakTrackingEventsMiddlewares = [
    streakTrackingEventQueryValidationMiddleware,
    retreiveStreakTrackingEventsMiddleware,
    sendStreakTrackingEventsResponseMiddleware,
];
