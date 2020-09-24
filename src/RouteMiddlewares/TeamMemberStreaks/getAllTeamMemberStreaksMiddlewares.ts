import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { GetAllTeamMemberStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamMemberStreaks';
import TeamVisibilityTypes from '@streakoid/streakoid-models/lib/Types/TeamVisibilityTypes';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

const getTeamMemberStreaksQueryValidationSchema = {
    userId: Joi.string(),
    teamStreakId: Joi.string(),
    timezone: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    sortField: Joi.string(),
    limit: Joi.number(),
    status: Joi.string(),
};

export const getTeamMemberStreaksQueryValidationMiddleware = (
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

export const getFindTeamMemberStreaksMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, teamStreakId, timezone, completedToday, active, sortField, status } = request.query;

        const defaultLeaderboardLimit = 30;

        const limit = Number(request.query.limit) || defaultLeaderboardLimit;

        const query: {
            visibility: TeamVisibilityTypes;
            userId?: string;
            teamStreakId?: string;
            timezone?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
            status?: StreakStatus;
        } = {
            visibility: TeamVisibilityTypes.everyone,
        };

        if (userId) {
            query.userId = userId;
        }
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
        if (status) {
            query.status = status;
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
        next(new CustomError(ErrorType.FindTeamMemberStreaksMiddleware, err));
    }
};

export const findTeamMemberStreaksMiddleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel);

export const sendTeamMemberStreaksMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { teamMemberStreaks } = response.locals;
        response.status(ResponseCodes.success).send(teamMemberStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamMemberStreaksMiddleware, err));
    }
};

export const getAllTeamMemberStreaksMiddlewares = [
    getTeamMemberStreaksQueryValidationMiddleware,
    findTeamMemberStreaksMiddleware,
    sendTeamMemberStreaksMiddleware,
];
