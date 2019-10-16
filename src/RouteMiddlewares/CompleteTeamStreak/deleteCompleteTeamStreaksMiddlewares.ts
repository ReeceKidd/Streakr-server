import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { completeTeamStreakModel, CompleteTeamStreakModel } from '../../Models/CompleteTeamStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const completeTeamStreakParamsValidationSchema = {
    completeTeamStreakId: Joi.string().required(),
};

export const completeTeamStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        completeTeamStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDeleteCompleteTeamStreakMiddleware = (
    completeTeamStreakModel: mongoose.Model<CompleteTeamStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { completeTeamStreakId } = request.params;
        const deletedCompleteTeamStreak = await completeTeamStreakModel.findByIdAndDelete(completeTeamStreakId);
        if (!deletedCompleteTeamStreak) {
            throw new CustomError(ErrorType.NoCompleteTeamStreakToDeleteFound);
        }
        response.locals.deletedCompleteTeamStreak = deletedCompleteTeamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteCompleteTeamStreakMiddleware, err));
    }
};

export const deleteCompleteTeamStreakMiddleware = getDeleteCompleteTeamStreakMiddleware(completeTeamStreakModel);

export const sendCompleteTeamStreakDeletedResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        response.status(ResponseCodes.deleted).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteTeamStreakDeletedResponseMiddleware, err));
    }
};

export const deleteCompleteTeamStreakMiddlewares = [
    completeTeamStreakParamsValidationMiddleware,
    deleteCompleteTeamStreakMiddleware,
    sendCompleteTeamStreakDeletedResponseMiddleware,
];
