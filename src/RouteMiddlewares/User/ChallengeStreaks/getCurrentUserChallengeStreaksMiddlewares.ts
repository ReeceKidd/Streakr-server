import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { GetAllChallengeStreaksSortFields } from '@streakoid/streakoid-sdk/lib/challengeStreaks';
import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ChallengeStreakModel, challengeStreakModel } from '../../../Models/ChallengeStreak';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const getChallengeStreaksQueryValidationSchema = {
    challengeId: Joi.string(),
    timezone: Joi.string(),
    status: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    sortField: Joi.string(),
    limit: Joi.number(),
};

export const getChallengeStreaksQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getChallengeStreaksQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindCurrentUserChallengeStreaksMiddleware = (
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { challengeId, timezone, completedToday, active, status, sortField } = request.query;

        const defaultLeaderboardItems = 30;

        const limit = Number(request.query.limit) || defaultLeaderboardItems;

        const query: {
            userId: string;
            challengeId?: string;
            timezone?: string;
            status?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
        } = { userId: user._id };

        if (challengeId) {
            query.challengeId = challengeId;
        }
        if (timezone) {
            query.timezone = timezone;
        }
        if (status) {
            query.status = status;
        }
        if (completedToday) {
            query.completedToday = completedToday === 'true';
        }
        if (active) {
            query.active = active === 'true';
        }

        if (sortField === GetAllChallengeStreaksSortFields.currentStreak) {
            response.locals.challengeStreaks = await challengeStreakModel
                .find(query)
                .sort({ 'currentStreak.numberOfDaysInARow': -1 })
                .limit(limit);
        } else if (sortField === GetAllChallengeStreaksSortFields.longestChallengeStreak) {
            response.locals.challengeStreaks = await challengeStreakModel
                .find(query)
                .sort({ 'longestChallengeStreak.numberOfDays': -1 })
                .limit(limit);
        } else {
            response.locals.challengeStreaks = await challengeStreakModel.find(query).limit(limit);
        }

        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCurrentUserChallengeStreaksMiddlewares, err));
    }
};

export const findCurrentUserChallengeStreaksMiddleware = getFindCurrentUserChallengeStreaksMiddleware(
    challengeStreakModel,
);

export const sendCurrentUserChallengeStreaksMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { challengeStreaks } = response.locals;
        response.status(ResponseCodes.success).send(challengeStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCurrentUserChallengeStreaksMiddleware, err));
    }
};

export const getCurrentUserChallengeStreaksMiddleware = [
    getChallengeStreaksQueryValidationMiddleware,
    findCurrentUserChallengeStreaksMiddleware,
    sendCurrentUserChallengeStreaksMiddleware,
];
