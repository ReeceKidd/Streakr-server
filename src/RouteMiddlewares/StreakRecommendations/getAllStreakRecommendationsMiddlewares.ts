import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { Model } from 'mongoose';
import { StreakRecommendationModel, streakRecommendationModel } from '../../../src/Models/StreakRecommendation';

const getStreakRecommendationsQueryValidationSchema = {};

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

export const getFindStreakRecommendationsMiddleware = (
    streakRecommendationModel: Model<StreakRecommendationModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        response.locals.streakRecommendations = await streakRecommendationModel.find({});
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindStreakRecommendationsMiddleware, err));
    }
};

export const findStreakRecommendationsMiddleware = getFindStreakRecommendationsMiddleware(streakRecommendationModel);

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
