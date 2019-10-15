import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const getTeamMemberStreaksQueryValidationSchema = {
    userId: Joi.string(),
    timezone: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
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
        const { userId, timezone, completedToday, active } = request.query;

        const query: {
            userId?: string;
            timezone?: string;
            completedToday?: boolean;
            active?: boolean;
        } = {};

        if (userId) {
            query.userId = userId;
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

        response.locals.teamMemberStreaks = await teamMemberStreakModel.find(query);
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
