import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import {
    completeTeamMemberStreakTaskModel,
    CompleteTeamMemberStreakTaskModel,
} from '../../Models/CompleteTeamMemberStreakTask';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const completeTeamMemberStreakTaskParamsValidationSchema = {
    completeTeamMemberStreakTaskId: Joi.string().required(),
};

export const completeTeamMemberStreakTaskParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        completeTeamMemberStreakTaskParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDeleteCompleteTeamMemberStreakTaskMiddleware = (
    completeTeamMemberStreakTaskModel: mongoose.Model<CompleteTeamMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { completeTeamMemberStreakTaskId } = request.params;
        const deletedCompleteTeamMemberStreakTask = await completeTeamMemberStreakTaskModel.findByIdAndDelete(
            completeTeamMemberStreakTaskId,
        );
        if (!deletedCompleteTeamMemberStreakTask) {
            throw new CustomError(ErrorType.NoCompleteTeamMemberStreakTaskToDeleteFound);
        }
        response.locals.deletedCompleteTeamMemberStreakTask = deletedCompleteTeamMemberStreakTask;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteCompleteTeamMemberStreakTaskMiddleware, err));
    }
};

export const deleteCompleteTeamMemberStreakTaskMiddleware = getDeleteCompleteTeamMemberStreakTaskMiddleware(
    completeTeamMemberStreakTaskModel,
);

export const getSendCompleteTeamMemberStreakTaskDeletedResponseMiddleware = (
    successfulDeletetionResponseCode: ResponseCodes,
) => (request: Request, response: Response, next: NextFunction): void => {
    try {
        response.status(successfulDeletetionResponseCode).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteTeamMemberStreakTaskDeletedResponseMiddleware, err));
    }
};

export const sendCompleteTeamMemberStreakTaskDeletedResponseMiddleware = getSendCompleteTeamMemberStreakTaskDeletedResponseMiddleware(
    ResponseCodes.deleted,
);

export const deleteCompleteTeamMemberStreakTaskMiddlewares = [
    completeTeamMemberStreakTaskParamsValidationMiddleware,
    deleteCompleteTeamMemberStreakTaskMiddleware,
    sendCompleteTeamMemberStreakTaskDeletedResponseMiddleware,
];
