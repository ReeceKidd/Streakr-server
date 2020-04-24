import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { streakTrackingEventModel, StreakTrackingEventModel } from '../../Models/StreakTrackingEvent';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const getStreakTrackingEventParamsValidationSchema = {
    streakTrackingEventId: Joi.string().required(),
};

export const getStreakTrackingEventParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        getStreakTrackingEventParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveStreakTrackingEventMiddleware = (
    streakTrackingEventModel: mongoose.Model<StreakTrackingEventModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakTrackingEventId } = request.params;
        const streakTrackingEvent = await streakTrackingEventModel.findOne({ _id: streakTrackingEventId }).lean();
        if (!streakTrackingEvent) {
            throw new CustomError(ErrorType.GetStreakTrackingEventNoStreakTrackingEventFound);
        }
        response.locals.streakTrackingEvent = streakTrackingEvent;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveStreakTrackingEventMiddleware, err));
    }
};

export const retrieveStreakTrackingEventMiddleware = getRetrieveStreakTrackingEventMiddleware(streakTrackingEventModel);

export const getSendStreakTrackingEventMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { streakTrackingEvent } = response.locals;
        response.status(resourceCreatedResponseCode).send(streakTrackingEvent);
    } catch (err) {
        next(new CustomError(ErrorType.SendStreakTrackingEventMiddleware, err));
    }
};

export const sendStreakTrackingEventMiddleware = getSendStreakTrackingEventMiddleware(ResponseCodes.success);

export const getStreakTrackingEventMiddlewares = [
    getStreakTrackingEventParamsValidationMiddleware,
    retrieveStreakTrackingEventMiddleware,
    sendStreakTrackingEventMiddleware,
];
