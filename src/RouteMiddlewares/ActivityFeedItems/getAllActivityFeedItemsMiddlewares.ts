import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { activityFeedItemModel, ActivityFeedItemModel } from '../../Models/ActivityFeedItem';
import { ActivityFeedItemTypes, SupportedResponseHeaders } from '@streakoid/streakoid-sdk/lib';

const getActivityFeedItemsQueryValidationSchema = {
    limit: Joi.number().required(),
    createdAtBefore: Joi.date().iso(),
    userIds: Joi.array().items(Joi.string()),
    soloStreakId: Joi.string(),
    challengeStreakId: Joi.string(),
    challengeId: Joi.string(),
    teamStreakId: Joi.string(),
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
        const {
            userIds,
            soloStreakId,
            challengeStreakId,
            challengeId,
            teamStreakId,
            activityFeedItemType,
        } = request.query;

        const query: {
            userId?: { $in: string[] };
            soloStreakId?: string;
            challengeStreakId?: string;
            challengeId?: string;
            teamStreakId?: string;
            activityFeedItemType?: string;
        } = {};

        if (userIds) {
            const parsedUserIds = JSON.parse(userIds);
            query.userId = { $in: parsedUserIds };
        }

        if (soloStreakId) {
            query.soloStreakId = soloStreakId;
        }

        if (challengeStreakId) {
            query.challengeStreakId = challengeStreakId;
        }

        if (challengeId) {
            query.challengeId = challengeId;
        }

        if (teamStreakId) {
            query.teamStreakId = teamStreakId;
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

        const totalCountOfActivityFeedItems = await activityModel.find(query).countDocuments();

        response.set(SupportedResponseHeaders.TotalCount, String(totalCountOfActivityFeedItems));

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
        const { createdAtBefore, limit } = request.query;
        let { query } = response.locals;

        // Pagination is handled by retreiving the last document.
        if (createdAtBefore) {
            query = {
                ...query,
                createdAt: { $lte: createdAtBefore },
            };
        }
        const activityFeedItems = await activityModel
            .find(query)
            .sort({ _id: -1 })
            .limit(Number(limit));

        response.locals.activityFeedItems = activityFeedItems;

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
    formActivityFeedItemsQueryMiddleware,
    calculateTotalCountOfActivityFeedItemsMiddleware,
    findActivityFeedItemsMiddleware,
    sendActivityFeedItemsMiddleware,
];
