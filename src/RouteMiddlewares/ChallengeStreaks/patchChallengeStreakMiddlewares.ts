import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const challengeStreakParamsValidationSchema = {
    challengeStreakId: Joi.string().required(),
};

export const challengeStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        challengeStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const challengeStreakBodyValidationSchema = {
    streakName: Joi.string(),
    status: Joi.string(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number(),
    completedToday: Joi.boolean(),
    timezone: Joi.string(),
    active: Joi.boolean(),
    currentStreak: Joi.object(),
    pastStreaks: Joi.array(),
};

export const challengeStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        challengeStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchChallengeStreakMiddleware = (challengeStreakModel: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { challengeStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedChallengeStreak = await challengeStreakModel.findByIdAndUpdate(
            challengeStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedChallengeStreak) {
            throw new CustomError(ErrorType.UpdatedChallengeStreakNotFound);
        }
        response.locals.updatedChallengeStreak = updatedChallengeStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchChallengeStreakMiddleware, err));
    }
};

export const patchChallengeStreakMiddleware = getPatchChallengeStreakMiddleware(challengeStreakModel);

export const sendUpdatedChallengeStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { updatedChallengeStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedChallengeStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedChallengeStreakMiddleware, err));
    }
};

export const patchChallengeStreakMiddlewares = [
    challengeStreakParamsValidationMiddleware,
    challengeStreakRequestBodyValidationMiddleware,
    patchChallengeStreakMiddleware,
    sendUpdatedChallengeStreakMiddleware,
];
