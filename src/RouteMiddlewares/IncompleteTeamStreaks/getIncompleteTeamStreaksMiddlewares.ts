import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { IncompleteTeamStreakModel, incompleteTeamStreakModel } from '../../Models/IncompleteTeamStreak';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const incompleteTeamStreakQueryValidationSchema = {
    teamStreakId: Joi.string(),
};

export const incompleteTeamStreakQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        incompleteTeamStreakQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveIncompleteTeamStreaksMiddleware = (
    incompleteTeamStreakModel: mongoose.Model<IncompleteTeamStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamStreakId } = request.query;
        const query: {
            teamStreakId?: string;
        } = {};

        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
        }

        response.locals.incompleteTeamStreaks = await incompleteTeamStreakModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetIncompleteTeamStreaksMiddleware, err));
    }
};

export const retreiveIncompleteTeamStreaksMiddleware = getRetreiveIncompleteTeamStreaksMiddleware(
    incompleteTeamStreakModel,
);

export const sendIncompleteTeamStreaksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteTeamStreaks } = response.locals;
        response.status(ResponseCodes.success).send(incompleteTeamStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendIncompleteTeamStreaksResponseMiddleware, err));
    }
};

export const getIncompleteTeamStreaksMiddlewares = [
    incompleteTeamStreakQueryValidationMiddleware,
    retreiveIncompleteTeamStreaksMiddleware,
    sendIncompleteTeamStreaksResponseMiddleware,
];
