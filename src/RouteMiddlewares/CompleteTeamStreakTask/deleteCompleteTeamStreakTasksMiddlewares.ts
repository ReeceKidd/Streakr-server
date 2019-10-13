import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { completeTeamStreakTaskModel, CompleteTeamStreakTaskModel } from '../../Models/CompleteTeamStreakTask';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const completeTeamStreakTaskParamsValidationSchema = {
    completeTeamStreakTaskId: Joi.string().required(),
};

export const completeTeamStreakTaskParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        completeTeamStreakTaskParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDeleteCompleteTeamStreakTaskMiddleware = (
    completeTeamStreakTaskModel: mongoose.Model<CompleteTeamStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { completeTeamStreakTaskId } = request.params;
        const deletedCompleteTeamStreakTask = await completeTeamStreakTaskModel.findByIdAndDelete(
            completeTeamStreakTaskId,
        );
        if (!deletedCompleteTeamStreakTask) {
            throw new CustomError(ErrorType.NoCompleteTeamStreakTaskToDeleteFound);
        }
        response.locals.deletedCompleteTeamStreakTask = deletedCompleteTeamStreakTask;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteCompleteTeamStreakTaskMiddleware, err));
    }
};

export const deleteCompleteTeamStreakTaskMiddleware = getDeleteCompleteTeamStreakTaskMiddleware(
    completeTeamStreakTaskModel,
);

export const sendCompleteTeamStreakTaskDeletedResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        response.status(ResponseCodes.deleted).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteTeamStreakTaskDeletedResponseMiddleware, err));
    }
};

export const deleteCompleteTeamStreakTaskMiddlewares = [
    completeTeamStreakTaskParamsValidationMiddleware,
    deleteCompleteTeamStreakTaskMiddleware,
    sendCompleteTeamStreakTaskDeletedResponseMiddleware,
];
