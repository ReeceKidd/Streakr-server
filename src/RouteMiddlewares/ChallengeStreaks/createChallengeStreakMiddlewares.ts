import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const createChallengeStreakBodyValidationSchema = {
    userId: Joi.string().required(),
    challengeId: Joi.string().required(),
};

export const createChallengeStreakBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createChallengeStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateChallengeStreakFromRequestMiddleware = (
    challengeStreak: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { timezone } = response.locals;
        const { userId, challengeId } = request.body;
        const newChallengeStreak = new challengeStreak({
            userId,
            challengeId,
            timezone,
        });
        response.locals.savedChallengeStreak = await newChallengeStreak.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateChallengeStreakFromRequestMiddleware, err));
    }
};

export const createChallengeStreakFromRequestMiddleware = getCreateChallengeStreakFromRequestMiddleware(
    challengeStreakModel,
);

export const sendFormattedChallengeStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { savedChallengeStreak } = response.locals;
        response.status(ResponseCodes.created).send(savedChallengeStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedChallengeStreakMiddleware, err));
    }
};

export const createChallengeStreakMiddlewares = [
    createChallengeStreakBodyValidationMiddleware,
    createChallengeStreakFromRequestMiddleware,
    sendFormattedChallengeStreakMiddleware,
];
