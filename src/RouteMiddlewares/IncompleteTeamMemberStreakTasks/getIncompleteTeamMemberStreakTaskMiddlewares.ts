import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import {
    incompleteTeamMemberStreakTaskModel,
    IncompleteTeamMemberStreakTaskModel,
} from '../../Models/IncompleteTeamMemberStreakTask';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const incompleteTeamMemberStreakTaskQueryValidationSchema = {
    userId: Joi.string(),
    teamMemberStreakId: Joi.string(),
    teamStreakId: Joi.string(),
};

export const incompleteTeamMemberStreakTaskQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        incompleteTeamMemberStreakTaskQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveIncompleteTeamMemberStreakTasksMiddleware = (
    incompleteTeamMemberStreakTaskModel: mongoose.Model<IncompleteTeamMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, teamMemberStreakId, teamStreakId } = request.query;
        const query: {
            userId?: string;
            teamMemberStreakId?: string;
            teamStreakId?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }
        if (teamMemberStreakId) {
            query.teamMemberStreakId = teamMemberStreakId;
        }
        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
        }

        response.locals.incompleteTeamMemberStreakTasks = await incompleteTeamMemberStreakTaskModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetIncompleteTeamMemberStreakTasksMiddleware, err));
    }
};

export const retrieveIncompleteTeamMemberStreakTasksMiddleware = getRetrieveIncompleteTeamMemberStreakTasksMiddleware(
    incompleteTeamMemberStreakTaskModel,
);

export const sendIncompleteTeamMemberStreakTasksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteTeamMemberStreakTasks } = response.locals;
        response.status(ResponseCodes.success).send(incompleteTeamMemberStreakTasks);
    } catch (err) {
        next(new CustomError(ErrorType.SendIncompleteTeamMemberStreakTasksResponseMiddleware, err));
    }
};

export const getIncompleteTeamMemberStreakTasksMiddlewares = [
    incompleteTeamMemberStreakTaskQueryValidationMiddleware,
    retrieveIncompleteTeamMemberStreakTasksMiddleware,
    sendIncompleteTeamMemberStreakTasksResponseMiddleware,
];
