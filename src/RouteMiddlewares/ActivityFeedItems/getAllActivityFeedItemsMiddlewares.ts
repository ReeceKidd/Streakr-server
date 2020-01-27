import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { activityFeedItemModel, ActivityFeedItemModel } from '../../Models/ActivityFeedItem';

const getActivityFeedItemsQueryValidationSchema = {
    userId: Joi.string(),
    streakId: Joi.string(),
};

export const getActivityFeedItemsQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getActivityFeedItemsQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindActivityFeedItemsMiddleware = (activityModel: mongoose.Model<ActivityFeedItemModel>) => async (
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

        response.locals.activityFeedItems = await activityModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindActivityFeedItemsMiddleware, err));
    }
};

export const findActivityFeedItemsMiddleware = getFindActivityFeedItemsMiddleware(activityFeedItemModel);

export const sendActivityFeedItemsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { activityFeedItems } = response.locals;
        response.status(ResponseCodes.success).send(activityFeedItems);
    } catch (err) {
        next(new CustomError(ErrorType.SendActivityFeedItemsMiddleware, err));
    }
};

export const getAllActivityFeedItemsMiddlewares = [
    getActivityFeedItemsQueryValidationMiddleware,
    findActivityFeedItemsMiddleware,
    sendActivityFeedItemsMiddleware,
];
