import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { streakRecommendationModel, StreakRecommendationModel } from '../../Models/StreakRecommendation';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const createStreakRecommendationBodyValidationSchema = {
    streakName: Joi.string().required(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number().positive(),
};

export const createStreakRecommendationBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createStreakRecommendationBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateStreakRecommendationFromRequestMiddleware = (
    streakRecommendation: mongoose.Model<StreakRecommendationModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { timezone } = response.locals;
        const { streakName, streakDescription, userId, numberOfMinutes } = request.body;
        const newStreakRecommendation = new streakRecommendation({
            streakName,
            streakDescription,
            userId,
            timezone,
            numberOfMinutes,
        });
        response.locals.savedStreakRecommendation = await newStreakRecommendation.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateStreakRecommendationFromRequestMiddleware, err));
    }
};

export const createStreakRecommendationFromRequestMiddleware = getCreateStreakRecommendationFromRequestMiddleware(
    streakRecommendationModel,
);

export const sendFormattedStreakRecommendationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { savedStreakRecommendation } = response.locals;
        response.status(ResponseCodes.created).send(savedStreakRecommendation);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedStreakRecommendationMiddleware, err));
    }
};

export const createStreakRecommendationMiddlewares = [
    createStreakRecommendationBodyValidationMiddleware,
    createStreakRecommendationFromRequestMiddleware,
    sendFormattedStreakRecommendationMiddleware,
];
