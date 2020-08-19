import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamMemberStreakModel, teamMemberStreakModel } from '../../../Models/TeamMemberStreak';
import { GetAllTeamMemberStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamMemberStreaks';
import { ErrorType, CustomError } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const getTeamMemberStreaksQueryValidationSchema = {
    teamStreakId: Joi.string(),
    timezone: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    sortField: Joi.string(),
    limit: Joi.number(),
};

export const getCurrentUserTeamMemberStreaksQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getTeamMemberStreaksQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindCurrentUserTeamMemberStreaksMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { teamStreakId, timezone, completedToday, active, sortField } = request.query;

        const defaultLeaderboardLimit = 30;

        const limit = Number(request.query.limit) || defaultLeaderboardLimit;

        const query: {
            userId: string;
            teamStreakId?: string;
            timezone?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
        } = { userId: user._id };

        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
        }
        if (timezone) {
            query.timezone = timezone;
        }
        if (completedToday) {
            query.completedToday = completedToday === 'true';
        }
        if (active) {
            query.active = active === 'true';
        }
        if (sortField === GetAllTeamMemberStreaksSortFields.currentStreak) {
            response.locals.teamMemberStreaks = await teamMemberStreakModel
                .find(query)
                .sort({ 'currentStreak.numberOfDaysInARow': -1 })
                .limit(limit);
        } else if (sortField === GetAllTeamMemberStreaksSortFields.longestTeamMemberStreak) {
            response.locals.teamMemberStreaks = await teamMemberStreakModel
                .find(query)
                .sort({ 'longestTeamMemberStreak.numberOfDays': -1 })
                .limit(limit);
        } else {
            response.locals.teamMemberStreaks = await teamMemberStreakModel.find(query).limit(limit);
        }

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindCurrentUserTeamMemberStreaksMiddleware, err));
    }
};

export const findCurrentUserTeamMemberStreaksMiddleware = getFindCurrentUserTeamMemberStreaksMiddleware(
    teamMemberStreakModel,
);

export const sendCurrentUserTeamMemberStreaksMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamMemberStreaks } = response.locals;
        response.status(ResponseCodes.success).send(teamMemberStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCurrentUserTeamMemberStreaksMiddleware, err));
    }
};

export const getCurrentUserTeamMemberStreaksMiddlewares = [
    getCurrentUserTeamMemberStreaksQueryValidationMiddleware,
    findCurrentUserTeamMemberStreaksMiddleware,
    sendCurrentUserTeamMemberStreaksMiddleware,
];
