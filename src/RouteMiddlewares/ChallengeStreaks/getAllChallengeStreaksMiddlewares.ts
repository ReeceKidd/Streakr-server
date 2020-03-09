import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { GetAllChallengeStreaksSortFields } from '@streakoid/streakoid-sdk/lib/challengeStreak';

const getChallengeStreaksQueryValidationSchema = {
    userId: Joi.string(),
    challengeId: Joi.string(),
    timezone: Joi.string(),
    status: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    sortField: Joi.string().valid(Object.keys(GetAllChallengeStreaksSortFields)),
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

export const getFindChallengeStreaksMiddleware = (challengeStreakModel: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, challengeId, timezone, completedToday, active, status, sortField } = request.query;

        const query: {
            userId?: string;
            challengeId?: string;
            timezone?: string;
            status?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }
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
        if (sortField) {
            response.locals.challengeStreaks = await challengeStreakModel
                .find(query)
                .sort({ 'currentStreak.numberOfDaysInARow': -1 });
        } else {
            response.locals.challengeStreaks = await challengeStreakModel.find(query);
        }

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindChallengeStreaksMiddleware, err));
    }
};

export const findChallengeStreaksMiddleware = getFindChallengeStreaksMiddleware(challengeStreakModel);

export const sendChallengeStreaksMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { challengeStreaks } = response.locals;
        response.status(ResponseCodes.success).send(challengeStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendChallengeStreaksMiddleware, err));
    }
};

export const getAllChallengeStreaksMiddlewares = [
    getChallengeStreaksQueryValidationMiddleware,
    findChallengeStreaksMiddleware,
    sendChallengeStreaksMiddleware,
];
