import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import {
    completeChallengeStreakTaskModel,
    CompleteChallengeStreakTaskModel,
} from '../../Models/CompleteChallengeStreakTask';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const completeChallengeStreakTaskQueryValidationSchema = {
    userId: Joi.string(),
    challengeStreakId: Joi.string(),
};

export const completeChallengeStreakTaskQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        completeChallengeStreakTaskQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveCompleteChallengeStreakTasksMiddleware = (
    completeChallengeStreakTaskModel: mongoose.Model<CompleteChallengeStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, challengeStreakId } = request.query;
        const query: {
            userId?: string;
            challengeStreakId?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }
        if (challengeStreakId) {
            query.challengeStreakId = challengeStreakId;
        }

        response.locals.completeChallengeStreakTasks = await completeChallengeStreakTaskModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCompleteChallengeStreakTasksMiddleware, err));
    }
};

export const retreiveCompleteChallengeStreakTasksMiddleware = getRetreiveCompleteChallengeStreakTasksMiddleware(
    completeChallengeStreakTaskModel,
);

export const sendCompleteChallengeStreakTasksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeChallengeStreakTasks } = response.locals;
        response.status(ResponseCodes.success).send(completeChallengeStreakTasks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteChallengeStreakTasksResponseMiddleware, err));
    }
};

export const getCompleteChallengeStreakTasksMiddlewares = [
    completeChallengeStreakTaskQueryValidationMiddleware,
    retreiveCompleteChallengeStreakTasksMiddleware,
    sendCompleteChallengeStreakTasksResponseMiddleware,
];
