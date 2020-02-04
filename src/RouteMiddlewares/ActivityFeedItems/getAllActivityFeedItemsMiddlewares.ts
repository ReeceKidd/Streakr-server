import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { activityFeedItemModel, ActivityFeedItemModel } from '../../Models/ActivityFeedItem';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

export const DEFAULT_ACTIVITY_FEED_ITEMS_LIMIT = 10;
export const DEFAULT_ACTIVITY_FEED_ITEMS_SKIP = 0;

const getActivityFeedItemsQueryValidationSchema = {
    userIds: Joi.array().items(Joi.string()),
    subjectId: Joi.string(),
    activityFeedItemType: Joi.string().valid(Object.keys(ActivityFeedItemTypes)),
    limit: Joi.number(),
    skip: Joi.number(),
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
        const { userIds, subjectId, activityFeedItemType } = request.query;
        let { limit, skip } = request.query;

        const query: {
            userId?: { $in: string[] };
            subjectId?: string;
            activityFeedItemType?: string;
        } = {};

        if (userIds) {
            const parsedUserIds = JSON.parse(userIds);
            query.userId = { $in: parsedUserIds };
        }

        if (subjectId) {
            query.subjectId = subjectId;
        }

        if (activityFeedItemType) {
            query.activityFeedItemType = activityFeedItemType;
        }

        if (!limit) {
            limit = DEFAULT_ACTIVITY_FEED_ITEMS_LIMIT;
        }

        if (!skip) {
            skip = DEFAULT_ACTIVITY_FEED_ITEMS_SKIP;
        }

        response.locals.activityFeedItems = await activityModel
            .find(query)
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 });
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
