import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { GetAllSoloStreaksSortFields } from '@streakoid/streakoid-sdk/lib/soloStreaks';
import IndividualVisibilityTypes from '@streakoid/streakoid-models/lib/Types/IndividualVisibilityTypes';

const getSoloStreaksQueryValidationSchema = {
    userId: Joi.string(),
    timezone: Joi.string(),
    status: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    sortField: Joi.string(),
    limit: Joi.number(),
};

export const getSoloStreaksQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getSoloStreaksQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindSoloStreaksMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, timezone, completedToday, active, status, sortField } = request.query;

        const defaultLeaderboardLimit = 30;

        const limit = Number(request.query.limit) || defaultLeaderboardLimit;

        const query: {
            visibility: IndividualVisibilityTypes;
            userId?: string;
            timezone?: string;
            status?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
        } = {
            visibility: IndividualVisibilityTypes.everyone,
        };

        if (userId) {
            query.userId = userId;
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

        if (sortField === GetAllSoloStreaksSortFields.currentStreak) {
            response.locals.soloStreaks = await soloStreakModel
                .find(query)
                .sort({ 'currentStreak.numberOfDaysInARow': -1 })
                .limit(limit);
        } else if (sortField === GetAllSoloStreaksSortFields.longestSoloStreak) {
            response.locals.soloStreaks = await soloStreakModel
                .find(query)
                .sort({ 'longestSoloStreak.numberOfDays': -1 })
                .limit(limit);
        } else {
            response.locals.soloStreaks = await soloStreakModel.find(query).limit(limit);
        }

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindSoloStreaksMiddleware, err));
    }
};

export const findSoloStreaksMiddleware = getFindSoloStreaksMiddleware(soloStreakModel);

export const sendSoloStreaksMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { soloStreaks } = response.locals;
        response.status(ResponseCodes.success).send(soloStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendSoloStreaksMiddleware, err));
    }
};

export const getAllSoloStreaksMiddlewares = [
    getSoloStreaksQueryValidationMiddleware,
    findSoloStreaksMiddleware,
    sendSoloStreaksMiddleware,
];
