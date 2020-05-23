import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { Model } from 'mongoose';
import { ChallengeModel, challengeModel } from '../../../src/Models/Challenge';

const getStreakRecommendationsQueryValidationSchema = {
    limit: Joi.number().required(),
    random: Joi.boolean(),
    sortedByNumberOfMembers: Joi.boolean(),
};

export const getStreakRecommendationsQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getStreakRecommendationsQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindStreakRecommendationsMiddleware = (challengeModel: Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { random, limit, sortedByNumberOfMembers } = request.query;
        const aggregation = [];
        if (random) {
            aggregation.push({ $sample: { size: Number(limit) } });
        }
        if (sortedByNumberOfMembers) {
            aggregation.push({ $sort: { numberOfMembers: -1 } });
        }
        aggregation.push({ $limit: Number(limit) });

        response.locals.streakRecommendations = await challengeModel.aggregate(aggregation);

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindStreakRecommendationsMiddleware, err));
    }
};

export const findStreakRecommendationsMiddleware = getFindStreakRecommendationsMiddleware(challengeModel);

export const sendStreakRecommendationsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { streakRecommendations } = response.locals;
        response.status(ResponseCodes.success).send(streakRecommendations);
    } catch (err) {
        next(new CustomError(ErrorType.SendStreakRecommendationsMiddleware, err));
    }
};

export const getAllStreakRecommendationsMiddlewares = [
    getStreakRecommendationsQueryValidationMiddleware,
    findStreakRecommendationsMiddleware,
    sendStreakRecommendationsMiddleware,
];
