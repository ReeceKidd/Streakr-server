import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import {
    completeTeamMemberStreakTaskModel,
    CompleteTeamMemberStreakTaskModel,
} from '../../Models/CompleteTeamMemberStreakTask';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const completeTeamMemberStreakTaskQueryValidationSchema = {
    userId: Joi.string(),
    teamMemberStreakId: Joi.string(),
    teamStreakId: Joi.string(),
};

export const completeTeamMemberStreakTaskQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        completeTeamMemberStreakTaskQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveCompleteTeamMemberStreakTasksMiddleware = (
    completeTeamMemberStreakTaskModel: mongoose.Model<CompleteTeamMemberStreakTaskModel>,
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

        response.locals.completeTeamMemberStreakTasks = await completeTeamMemberStreakTaskModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCompleteTeamMemberStreakTasksMiddleware, err));
    }
};

export const retreiveCompleteTeamMemberStreakTasksMiddleware = getRetreiveCompleteTeamMemberStreakTasksMiddleware(
    completeTeamMemberStreakTaskModel,
);

export const sendCompleteTeamMemberStreakTasksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeTeamMemberStreakTasks } = response.locals;
        response.status(ResponseCodes.success).send(completeTeamMemberStreakTasks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteTeamMemberStreakTasksResponseMiddleware, err));
    }
};

export const getCompleteTeamMemberStreakTasksMiddlewares = [
    completeTeamMemberStreakTaskQueryValidationMiddleware,
    retreiveCompleteTeamMemberStreakTasksMiddleware,
    sendCompleteTeamMemberStreakTasksResponseMiddleware,
];
