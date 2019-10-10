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
import { GroupStreakTypes } from '@streakoid/streakoid-sdk/lib';

const completeGroupMemberStreakTaskQueryValidationSchema = {
    userId: Joi.string(),
    groupMemberStreakId: Joi.string(),
    groupStreakType: Joi.string().valid(Object.keys(GroupStreakTypes)),
    teamStreakId: Joi.string(),
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
        const { userId, groupMemberStreakId, groupStreakType, teamStreakId } = request.query;

        const query: {
            userId?: string;
            groupMemberStreakId?: string;
            groupStreakType?: GroupStreakTypes;
            teamStreakId?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }
        if (groupStreakType) {
            query.groupStreakType = groupStreakType;
        }
        if (groupMemberStreakId) {
            query.groupMemberStreakId = groupMemberStreakId;
        }
        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
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
