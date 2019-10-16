import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { completeTeamStreakModel, CompleteTeamStreakModel } from '../../Models/CompleteTeamStreak';
import { CustomError, ErrorType } from '../../customError';
import { ResponseCodes } from '../../Server/responseCodes';

const completeTeamStreakQueryValidationSchema = {
    teamStreakId: Joi.string(),
};

export const completeTeamStreakQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        completeTeamStreakQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveCompleteTeamStreaksMiddleware = (
    completeTeamStreakModel: mongoose.Model<CompleteTeamStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamStreakId } = request.query;
        const query: {
            teamStreakId?: string;
        } = {};

        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
        }

        response.locals.completeTeamStreaks = await completeTeamStreakModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCompleteTeamStreaksMiddleware, err));
    }
};

export const retreiveCompleteTeamStreaksMiddleware = getRetreiveCompleteTeamStreaksMiddleware(completeTeamStreakModel);

export const sendCompleteTeamStreaksResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeTeamStreaks } = response.locals;
        response.status(ResponseCodes.success).send(completeTeamStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteTeamStreaksResponseMiddleware, err));
    }
};

export const getCompleteTeamStreaksMiddlewares = [
    completeTeamStreakQueryValidationMiddleware,
    retreiveCompleteTeamStreaksMiddleware,
    sendCompleteTeamStreaksResponseMiddleware,
];
