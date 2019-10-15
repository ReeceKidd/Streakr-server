import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import {
    incompleteTeamMemberStreakTaskModel,
    IncompleteTeamMemberStreakTaskModel,
} from '../../Models/IncompleteTeamMemberStreakTask';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const incompleteTeamMemberStreakTaskParamsValidationSchema = {
    incompleteTeamMemberStreakTaskId: Joi.string().required(),
};

export const incompleteTeamMemberStreakTaskParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        incompleteTeamMemberStreakTaskParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDeleteIncompleteTeamMemberStreakTaskMiddleware = (
    incompleteTeamMemberStreakTaskModel: mongoose.Model<IncompleteTeamMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { incompleteTeamMemberStreakTaskId } = request.params;
        const deletedIncompleteTeamMemberStreakTask = await incompleteTeamMemberStreakTaskModel.findByIdAndDelete(
            incompleteTeamMemberStreakTaskId,
        );
        if (!deletedIncompleteTeamMemberStreakTask) {
            throw new CustomError(ErrorType.NoIncompleteTeamMemberStreakTaskToDeleteFound);
        }
        response.locals.deletedIncompleteTeamMemberStreakTask = deletedIncompleteTeamMemberStreakTask;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteIncompleteTeamMemberStreakTaskMiddleware, err));
    }
};

export const deleteIncompleteTeamMemberStreakTaskMiddleware = getDeleteIncompleteTeamMemberStreakTaskMiddleware(
    incompleteTeamMemberStreakTaskModel,
);

export const getSendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware = (
    successfulDeletetionResponseCode: ResponseCodes,
) => (request: Request, response: Response, next: NextFunction): void => {
    try {
        response.status(successfulDeletetionResponseCode).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware, err));
    }
};

export const sendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware = getSendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware(
    ResponseCodes.deleted,
);

export const deleteIncompleteTeamMemberStreakTaskMiddlewares = [
    incompleteTeamMemberStreakTaskParamsValidationMiddleware,
    deleteIncompleteTeamMemberStreakTaskMiddleware,
    sendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware,
];
