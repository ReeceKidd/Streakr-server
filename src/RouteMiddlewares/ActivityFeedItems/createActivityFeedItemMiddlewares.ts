import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';

const createActivityFeedItemBodyValidationSchema = {
    activityFeedItemType: Joi.string()
        .valid(Object.keys(ActivityFeedItemTypes))
        .required(),
    userId: Joi.string(),
    username: Joi.string(),
    soloStreakId: Joi.string(),
    soloStreakName: Joi.string(),
    challengeStreakId: Joi.string(),
    challengeId: Joi.string(),
    challengeName: Joi.string(),
    teamStreakId: Joi.string(),
    teamStreakName: Joi.string(),
};

export const createActivityFeedItemBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createActivityFeedItemBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSaveActivityFeedItemToDatabaseMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const activityFeedItem = await createActivityFeedItemFunction(request.body);
        response.locals.activityFeedItem = activityFeedItem;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveActivityFeedItemToDatabaseMiddleware, err));
    }
};

export const saveActivityFeedItemToDatabaseMiddleware = getSaveActivityFeedItemToDatabaseMiddleware(
    createActivityFeedItem,
);

export const sendActivityFeedItemMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { activityFeedItem } = response.locals;
        response.status(ResponseCodes.created).send(activityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.SendActivityFeedItemMiddleware, err));
    }
};

export const createActivityFeedItemMiddlewares = [
    createActivityFeedItemBodyValidationMiddleware,
    saveActivityFeedItemToDatabaseMiddleware,
    sendActivityFeedItemMiddleware,
];
