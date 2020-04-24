import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { completeSoloStreakTaskModel, CompleteSoloStreakTaskModel } from '../../Models/CompleteSoloStreakTask';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const completeSoloStreakTaskQueryValidationSchema = {
    userId: Joi.string(),
    streakId: Joi.string(),
};

export const completeSoloStreakTaskQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        completeSoloStreakTaskQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveCompleteSoloStreakTasksMiddleware = (
    completeSoloStreakTaskModel: mongoose.Model<CompleteSoloStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, streakId } = request.query;
        const query: {
            userId?: string;
            streakId?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }
        if (streakId) {
            query.streakId = streakId;
        }

        response.locals.completeSoloStreakTasks = await completeSoloStreakTaskModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCompleteSoloStreakTasksMiddleware, err));
    }
};

export const retrieveCompleteSoloStreakTasksMiddleware = getRetrieveCompleteSoloStreakTasksMiddleware(
    completeSoloStreakTaskModel,
);

export const sendCompleteSoloStreakTasksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeSoloStreakTasks } = response.locals;
        response.status(ResponseCodes.success).send(completeSoloStreakTasks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteSoloStreakTasksResponseMiddleware, err));
    }
};

export const getCompleteSoloStreakTasksMiddlewares = [
    completeSoloStreakTaskQueryValidationMiddleware,
    retrieveCompleteSoloStreakTasksMiddleware,
    sendCompleteSoloStreakTasksResponseMiddleware,
];
