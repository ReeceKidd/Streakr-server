import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import {
    incompleteGroupMemberStreakTaskModel,
    IncompleteGroupMemberStreakTaskModel,
} from '../../Models/IncompleteGroupMemberStreakTask';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const incompleteGroupMemberStreakTaskQueryValidationSchema = {
    userId: Joi.string(),
    groupMemberStreakId: Joi.string(),
    teamStreakId: Joi.string(),
    streakType: Joi.string(),
};

export const incompleteGroupMemberStreakTaskQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        incompleteGroupMemberStreakTaskQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveIncompleteGroupMemberStreakTasksMiddleware = (
    incompleteGroupMemberStreakTaskModel: mongoose.Model<IncompleteGroupMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, groupMemberStreakId, teamStreakId, streakType } = request.query;
        const query: {
            userId?: string;
            groupMemberStreakId?: string;
            teamStreakId?: string;
            streakType?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }
        if (groupMemberStreakId) {
            query.groupMemberStreakId = groupMemberStreakId;
        }
        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
        }
        if (streakType) {
            query.streakType = streakType;
        }

        response.locals.incompleteGroupMemberStreakTasks = await incompleteGroupMemberStreakTaskModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetIncompleteGroupMemberStreakTasksMiddleware, err));
    }
};

export const retreiveIncompleteGroupMemberStreakTasksMiddleware = getRetreiveIncompleteGroupMemberStreakTasksMiddleware(
    incompleteGroupMemberStreakTaskModel,
);

export const sendIncompleteGroupMemberStreakTasksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteGroupMemberStreakTasks } = response.locals;
        response.status(ResponseCodes.success).send(incompleteGroupMemberStreakTasks);
    } catch (err) {
        next(new CustomError(ErrorType.SendIncompleteGroupMemberStreakTasksResponseMiddleware, err));
    }
};

export const getIncompleteGroupMemberStreakTasksMiddlewares = [
    incompleteGroupMemberStreakTaskQueryValidationMiddleware,
    retreiveIncompleteGroupMemberStreakTasksMiddleware,
    sendIncompleteGroupMemberStreakTasksResponseMiddleware,
];
