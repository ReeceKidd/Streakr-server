import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { incompleteSoloStreakTaskModel, IncompleteSoloStreakTaskModel } from '../../Models/IncompleteSoloStreakTask';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const incompleteSoloStreakTaskParamsValidationSchema = {
    incompleteSoloStreakTaskId: Joi.string().required(),
};

export const incompleteSoloStreakTaskParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        incompleteSoloStreakTaskParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDeleteIncompleteSoloStreakTaskMiddleware = (
    incompleteSoloStreakTaskModel: mongoose.Model<IncompleteSoloStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { incompleteSoloStreakTaskId } = request.params;
        const deletedIncompleteSoloStreakTask = await incompleteSoloStreakTaskModel.findByIdAndDelete(
            incompleteSoloStreakTaskId,
        );
        if (!deletedIncompleteSoloStreakTask) {
            throw new CustomError(ErrorType.NoIncompleteSoloStreakTaskToDeleteFound);
        }
        response.locals.deletedIncompleteSoloStreakTask = deletedIncompleteSoloStreakTask;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteIncompleteSoloStreakTaskMiddleware, err));
    }
};

export const deleteIncompleteSoloStreakTaskMiddleware = getDeleteIncompleteSoloStreakTaskMiddleware(
    incompleteSoloStreakTaskModel,
);

export const getSendIncompleteSoloStreakTaskDeletedResponseMiddleware = (
    successfulDeletetionResponseCode: ResponseCodes,
) => (request: Request, response: Response, next: NextFunction): void => {
    try {
        response.status(successfulDeletetionResponseCode).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendIncompleteSoloStreakTaskDeletedResponseMiddleware, err));
    }
};

export const sendIncompleteSoloStreakTaskDeletedResponseMiddleware = getSendIncompleteSoloStreakTaskDeletedResponseMiddleware(
    ResponseCodes.deleted,
);

export const deleteIncompleteSoloStreakTaskMiddlewares = [
    incompleteSoloStreakTaskParamsValidationMiddleware,
    deleteIncompleteSoloStreakTaskMiddleware,
    sendIncompleteSoloStreakTaskDeletedResponseMiddleware,
];
