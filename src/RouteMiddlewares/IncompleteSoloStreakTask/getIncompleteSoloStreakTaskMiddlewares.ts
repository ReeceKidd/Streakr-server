import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { incompleteSoloStreakTaskModel, IncompleteSoloStreakTaskModel } from '../../Models/IncompleteSoloStreakTask';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const incompleteSoloStreakTaskQueryValidationSchema = {
    userId: Joi.string(),
    streakId: Joi.string(),
};

export const incompleteSoloStreakTaskQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        incompleteSoloStreakTaskQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveIncompleteSoloStreakTasksMiddleware = (
    incompleteSoloStreakTaskModel: mongoose.Model<IncompleteSoloStreakTaskModel>,
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

        response.locals.incompleteSoloStreakTasks = await incompleteSoloStreakTaskModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetIncompleteSoloStreakTasksMiddleware, err));
    }
};

export const retreiveIncompleteSoloStreakTasksMiddleware = getRetreiveIncompleteSoloStreakTasksMiddleware(
    incompleteSoloStreakTaskModel,
);

export const sendIncompleteSoloStreakTasksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteSoloStreakTasks } = response.locals;
        response.status(ResponseCodes.success).send(incompleteSoloStreakTasks);
    } catch (err) {
        next(new CustomError(ErrorType.SendIncompleteSoloStreakTasksResponseMiddleware, err));
    }
};

export const getIncompleteSoloStreakTasksMiddlewares = [
    incompleteSoloStreakTaskQueryValidationMiddleware,
    retreiveIncompleteSoloStreakTasksMiddleware,
    sendIncompleteSoloStreakTasksResponseMiddleware,
];
