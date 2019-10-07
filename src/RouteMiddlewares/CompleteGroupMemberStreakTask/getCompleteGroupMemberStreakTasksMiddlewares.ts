import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import {
    completeGroupMemberStreakTaskModel,
    CompleteGroupMemberStreakTaskModel,
} from '../../Models/CompleteGroupMemberStreakTask';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const completeGroupMemberStreakTaskQueryValidationSchema = {
    userId: Joi.string(),
    teamStreakId: Joi.string(),
    groupMemberStreakId: Joi.string(),
};

export const completeGroupMemberStreakTaskQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        completeGroupMemberStreakTaskQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveCompleteGroupMemberStreakTasksMiddleware = (
    completeGroupMemberStreakTaskModel: mongoose.Model<CompleteGroupMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, teamStreakId, groupMemberStreakId } = request.query;

        const query: {
            userId?: string;
            teamStreakId?: string;
            groupMemberStreakId?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }
        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
        }
        if (groupMemberStreakId) {
            query.groupMemberStreakId = groupMemberStreakId;
        }

        response.locals.completeGroupMemberStreakTasks = await completeGroupMemberStreakTaskModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCompleteGroupMemberStreakTasksMiddleware, err));
    }
};

export const retreiveCompleteGroupMemberStreakTasksMiddleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
    completeGroupMemberStreakTaskModel,
);

export const sendCompleteGroupMemberStreakTasksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeGroupMemberStreakTasks } = response.locals;
        response.status(ResponseCodes.success).send(completeGroupMemberStreakTasks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteGroupMemberStreakTasksResponseMiddleware, err));
    }
};

export const getCompleteGroupMemberStreakTasksMiddlewares = [
    completeGroupMemberStreakTaskQueryValidationMiddleware,
    retreiveCompleteGroupMemberStreakTasksMiddleware,
    sendCompleteGroupMemberStreakTasksResponseMiddleware,
];
