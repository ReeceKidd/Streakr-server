import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { activityFeedItemModel, ActivityFeedItemModel } from '../../Models/ActivityFeedItem';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';
import { GetAllActivityFeedItemsResponse } from '@streakoid/streakoid-sdk/lib/activityFeedItems';

const getActivityFeedItemsQueryValidationSchema = {
    limit: Joi.number().required(),
    createdOnBefore: Joi.date(),
    userIds: Joi.array().items(Joi.string()),
    subjectId: Joi.string(),
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

export const formActivityFeedItemsQueryMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { userIds, subjectId, activityFeedItemType } = request.query;

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

        response.locals.query = query;

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormActivityFeedItemsQueryMiddleware, err));
    }
};

export const getCalculateTotalCountOfActivityFeedItemsMiddleware = (
    activityModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { query } = response.locals;

        const totalCountOfActivityFeedItems = await activityModel.find(query).count();

        response.locals.totalCountOfActivityFeedItems = totalCountOfActivityFeedItems;

        next();
    } catch (err) {
        next(new CustomError(ErrorType.CalculateTotalCountOfActivityFeedItemsMiddleware, err));
    }
};

export const calculateTotalCountOfActivityFeedItemsMiddleware = getCalculateTotalCountOfActivityFeedItemsMiddleware(
    activityFeedItemModel,
);

export const getFindActivityFeedItemsMiddleware = (activityModel: mongoose.Model<ActivityFeedItemModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { limit, createdOnBefore } = request.query;
        let { query } = response.locals;

        // Pagination is handled by retreiving the last document.
        if (createdOnBefore) {
            query = {
                ...query,
                createdOn: { $lte: createdOnBefore },
            };
        }
        const activityFeedItems = await activityModel
            .find(query)
            .limit(Number(limit))
            .sort('-createdOn');

        response.locals.activityFeedItems = activityFeedItems;

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindActivityFeedItemsMiddleware, err));
    }
};

export const findActivityFeedItemsMiddleware = getFindActivityFeedItemsMiddleware(activityFeedItemModel);

export const sendActivityFeedItemsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { activityFeedItems, totalCountOfActivityFeedItems } = response.locals;
        const activityFeedItemsResponse: GetAllActivityFeedItemsResponse = {
            activityFeedItems,
            totalCountOfActivityFeedItems,
        };
        response.status(ResponseCodes.success).send(activityFeedItemsResponse);
    } catch (err) {
        next(new CustomError(ErrorType.SendActivityFeedItemsMiddleware, err));
    }
};

export const getAllActivityFeedItemsMiddlewares = [
    getActivityFeedItemsQueryValidationMiddleware,
    formActivityFeedItemsQueryMiddleware,
    calculateTotalCountOfActivityFeedItemsMiddleware,
    findActivityFeedItemsMiddleware,
    sendActivityFeedItemsMiddleware,
];
