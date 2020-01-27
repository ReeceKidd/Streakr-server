import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User } from '@streakoid/streakoid-sdk/lib';
import ActivityTypes from '@streakoid/streakoid-sdk/lib/ActivityTypes';
import { activityFeedItemModel, ActivityFeedItemModel } from '../../Models/ActivityFeedItem';

const createSoloStreakBodyValidationSchema = {
    userId: Joi.string().required(),
    streakName: Joi.string().required(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number().positive(),
};

export const createSoloStreakBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createSoloStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateSoloStreakFromRequestMiddleware = (soloStreak: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { timezone } = response.locals;
        const { streakName, streakDescription, userId, numberOfMinutes } = request.body;
        const newSoloStreak = new soloStreak({
            streakName,
            streakDescription,
            userId,
            timezone,
            numberOfMinutes,
        });
        response.locals.savedSoloStreak = await newSoloStreak.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateSoloStreakFromRequestMiddleware, err));
    }
};

export const createSoloStreakFromRequestMiddleware = getCreateSoloStreakFromRequestMiddleware(soloStreakModel);

export const sendFormattedSoloStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedSoloStreak } = response.locals;
        response.status(ResponseCodes.created).send(savedSoloStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedSoloStreakMiddleware, err));
    }
};

export const getCreateSoloStreakActivityMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const savedSoloStreak = response.locals.savedSoloStreak;
        const newActivity = new activityFeedItemModel({
            activityType: ActivityTypes.createdSoloStreak,
            userId: user._id,
            streakId: savedSoloStreak._id,
        });
        await newActivity.save();
    } catch (err) {
        next(new CustomError(ErrorType.CreateSoloStreakActivityMiddleware, err));
    }
};

export const createSoloStreakActivityMiddleware = getCreateSoloStreakActivityMiddleware(activityFeedItemModel);

export const createSoloStreakMiddlewares = [
    createSoloStreakBodyValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    sendFormattedSoloStreakMiddleware,
    createSoloStreakActivityMiddleware,
];
