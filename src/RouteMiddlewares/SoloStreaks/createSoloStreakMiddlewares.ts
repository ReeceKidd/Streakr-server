import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { userModel, UserModel } from '../../../src/Models/User';
import IndividualVisibilityTypes from '@streakoid/streakoid-models/lib/Types/IndividualVisibilityTypes';

const createSoloStreakBodyValidationSchema = {
    userId: Joi.string().required(),
    streakName: Joi.string().required(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number().positive(),
    visibility: Joi.string().valid(Object.keys(IndividualVisibilityTypes)),
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
        const { streakName, streakDescription, userId, numberOfMinutes, visibility } = request.body;
        const newSoloStreak = new soloStreak({
            streakName,
            streakDescription,
            userId,
            timezone,
            numberOfMinutes,
            visibility,
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

export const getIncreaseUsersTotalLiveStreaksByOneMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        await userModel.findByIdAndUpdate(user._id, { $inc: { totalLiveStreaks: 1 } });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateSoloStreakIncreaseUsersTotalLiveStreaksByOneMiddleware, err));
    }
};

export const increaseUsersTotalLiveStreaksByOneMiddleware = getIncreaseUsersTotalLiveStreaksByOneMiddleware(userModel);

export const getCreateSoloStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const savedSoloStreak: SoloStreak = response.locals.savedSoloStreak;
        const createdSoloStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.createdSoloStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            soloStreakId: savedSoloStreak._id,
            soloStreakName: savedSoloStreak.streakName,
        };
        await createActivityFeedItemFunction(createdSoloStreakActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreateSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createSoloStreakActivityFeedItemMiddleware = getCreateSoloStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const createSoloStreakMiddlewares = [
    createSoloStreakBodyValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    sendFormattedSoloStreakMiddleware,
    increaseUsersTotalLiveStreaksByOneMiddleware,
    createSoloStreakActivityFeedItemMiddleware,
];
