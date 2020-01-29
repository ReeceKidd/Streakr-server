import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { activityFeedItemModel, ActivityFeedItemModel } from '../../Models/ActivityFeedItem';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

const getActivityFeedItemsQueryValidationSchema = {
    userId: Joi.string(),
    streakId: Joi.string(),
    challengeId: Joi.string(),
    activityFeedItemType: Joi.string().valid(Object.keys(ActivityFeedItemTypes)),
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
        const { userId, streakId, challengeId, activityFeedItemType } = request.query;

        const query: {
            userId?: string;
            streakId?: string;
            challengeId?: string;
            activityFeedItemType?: string;
        } = {};

        if (userId) {
            query.userId = userId;
        }

        if (streakId) {
            query.streakId = streakId;
        }

        if (challengeId) {
            query.challengeId = challengeId;
        }

        if (activityFeedItemType) {
            query.activityFeedItemType = activityFeedItemType;
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
