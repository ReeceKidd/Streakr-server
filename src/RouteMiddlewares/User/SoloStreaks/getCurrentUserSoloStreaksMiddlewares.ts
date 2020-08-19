import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel, SoloStreakModel } from '../../../Models/SoloStreak';
import { ResponseCodes } from '../../../Server/responseCodes';
import { CustomError, ErrorType } from '../../../customError';
import { GetAllSoloStreaksSortFields } from '@streakoid/streakoid-sdk/lib/soloStreaks';
import VisibilityTypes from '@streakoid/streakoid-models/lib/Types/VisibilityTypes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const getSoloStreaksQueryValidationSchema = {
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

export const getFindSoloStreaksForCurrentUserMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { completedToday, active, status, sortField } = request.query;

        const defaultLeaderboardLimit = 30;

        const limit = Number(request.query.limit) || defaultLeaderboardLimit;

        const query: {
            userId: string;
            status?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
            visibility?: VisibilityTypes;
        } = { userId: user._id };

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
        next(new CustomError(ErrorType.FindSoloStreaksForCurrentUserMiddleware, err));
    }
};

export const findSoloStreaksForCurrentUserMiddleware = getFindSoloStreaksForCurrentUserMiddleware(soloStreakModel);

export const sendSoloStreaksForCurrentUserMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { soloStreaks } = response.locals;
        response.status(ResponseCodes.success).send(soloStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendSoloStreaksForCurrentUserMiddleware, err));
    }
};

export const getCurrentUserSoloStreaksMiddlewares = [
    getSoloStreaksQueryValidationMiddleware,
    findSoloStreaksForCurrentUserMiddleware,
    sendSoloStreaksForCurrentUserMiddleware,
];
