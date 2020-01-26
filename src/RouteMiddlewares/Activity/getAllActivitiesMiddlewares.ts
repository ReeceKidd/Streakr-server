import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { activityModel, ActivityModel } from '../../Models/Activity';

const getActivitiesQueryValidationSchema = {
    userId: Joi.string(),
    streakId: Joi.string(),
};

export const getActivitiesQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getActivitiesQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindActivitiesMiddleware = (activityModel: mongoose.Model<ActivityModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, streakId } = request.query;

        const query: {
            userId?: string;
            streakId?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }

        if (streakId) {
            query.streakId = streakId;
        }

        response.locals.activities = await activityModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindActivitiesMiddleware, err));
    }
};

export const findActivitiesMiddleware = getFindActivitiesMiddleware(activityModel);

export const sendActivitiesMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { activities } = response.locals;
        response.status(ResponseCodes.success).send(activities);
    } catch (err) {
        next(new CustomError(ErrorType.SendActivitiesMiddleware, err));
    }
};

export const getAllActivitiesMiddlewares = [
    getActivitiesQueryValidationMiddleware,
    findActivitiesMiddleware,
    sendActivitiesMiddleware,
];
