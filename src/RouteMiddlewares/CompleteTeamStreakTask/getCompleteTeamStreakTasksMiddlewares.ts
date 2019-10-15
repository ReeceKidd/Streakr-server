import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { completeTeamStreakTaskModel, CompleteTeamStreakTaskModel } from '../../Models/CompleteTeamStreakTask';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const completeTeamStreakTaskQueryValidationSchema = {
    teamStreakId: Joi.string(),
};

export const completeTeamStreakTaskQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        completeTeamStreakTaskQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveCompleteTeamStreakTasksMiddleware = (
    completeTeamStreakTaskModel: mongoose.Model<CompleteTeamStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamStreakId } = request.query;
        const query: {
            teamStreakId?: string;
        } = {};

        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
        }

        response.locals.completeTeamStreakTasks = await completeTeamStreakTaskModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCompleteTeamStreakTasksMiddleware, err));
    }
};

export const retreiveCompleteTeamStreakTasksMiddleware = getRetreiveCompleteTeamStreakTasksMiddleware(
    completeTeamStreakTaskModel,
);

export const sendCompleteTeamStreakTasksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeTeamStreakTasks } = response.locals;
        response.status(ResponseCodes.success).send(completeTeamStreakTasks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteTeamStreakTasksResponseMiddleware, err));
    }
};

export const getCompleteTeamStreakTasksMiddlewares = [
    completeTeamStreakTaskQueryValidationMiddleware,
    retreiveCompleteTeamStreakTasksMiddleware,
    sendCompleteTeamStreakTasksResponseMiddleware,
];
