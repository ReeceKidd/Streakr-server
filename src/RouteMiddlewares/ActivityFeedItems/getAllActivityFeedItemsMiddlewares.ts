import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { activityFeedItemModel, ActivityFeedItemModel } from '../../Models/ActivityFeedItem';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

const getActivityFeedItemsQueryValidationSchema = {
    limit: Joi.number().required(),
    skip: Joi.number().required(),
    userIds: Joi.array().items(Joi.string()),
    subjectId: Joi.string(),
    activityFeedItemType: Joi.string().valid(Object.keys(ActivityFeedItemTypes)),
};

export const getActivityFeedItemsQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    console.log(1);
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
        console.log(2);
        const { limit, skip, userIds, subjectId, activityFeedItemType } = request.query;

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

        const activityFeedItems = await activityModel
            .find(query)
            .skip(Number(skip))
            .limit(Number(limit));

        response.locals.activityFeedItems = activityFeedItems;

        next();
    } catch (err) {
        console.log(err);
        next(new CustomError(ErrorType.FindActivityFeedItemsMiddleware, err));
    }
};

export const findActivityFeedItemsMiddleware = getFindActivityFeedItemsMiddleware(activityFeedItemModel);

export const sendActivityFeedItemsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        console.log(3);
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
