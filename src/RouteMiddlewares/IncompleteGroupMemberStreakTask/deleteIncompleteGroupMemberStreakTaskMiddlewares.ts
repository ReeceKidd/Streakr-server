import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import {
    incompleteGroupMemberStreakTaskModel,
    IncompleteGroupMemberStreakTaskModel,
} from '../../Models/IncompleteGroupMemberStreakTask';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const incompleteGroupMemberStreakTaskParamsValidationSchema = {
    incompleteGroupMemberStreakTaskId: Joi.string().required(),
};

export const incompleteGroupMemberStreakTaskParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        incompleteGroupMemberStreakTaskParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDeleteIncompleteGroupMemberStreakTaskMiddleware = (
    incompleteGroupMemberStreakTaskModel: mongoose.Model<IncompleteGroupMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { incompleteGroupMemberStreakTaskId } = request.params;
        const deletedIncompleteGroupMemberStreakTask = await incompleteGroupMemberStreakTaskModel.findByIdAndDelete(
            incompleteGroupMemberStreakTaskId,
        );
        if (!deletedIncompleteGroupMemberStreakTask) {
            throw new CustomError(ErrorType.NoIncompleteGroupMemberStreakTaskToDeleteFound);
        }
        response.locals.deletedIncompleteGroupMemberStreakTask = deletedIncompleteGroupMemberStreakTask;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteIncompleteGroupMemberStreakTaskMiddleware, err));
    }
};

export const deleteIncompleteGroupMemberStreakTaskMiddleware = getDeleteIncompleteGroupMemberStreakTaskMiddleware(
    incompleteGroupMemberStreakTaskModel,
);

export const getSendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware = (
    successfulDeletetionResponseCode: ResponseCodes,
) => (request: Request, response: Response, next: NextFunction): void => {
    try {
        response.status(successfulDeletetionResponseCode).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware, err));
    }
};

export const sendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware = getSendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware(
    ResponseCodes.deleted,
);

export const deleteIncompleteGroupMemberStreakTaskMiddlewares = [
    incompleteGroupMemberStreakTaskParamsValidationMiddleware,
    deleteIncompleteGroupMemberStreakTaskMiddleware,
    sendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware,
];
