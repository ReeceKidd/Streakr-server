import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const getChallengeStreakParamsValidationSchema = {
    challengeStreakId: Joi.string().required(),
};

export const getChallengeStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        getChallengeStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveChallengeStreakMiddleware = (
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { challengeStreakId } = request.params;
        const challengeStreak = await challengeStreakModel.findOne({ _id: challengeStreakId }).lean();
        if (!challengeStreak) {
            throw new CustomError(ErrorType.GetChallengeStreakNoChallengeStreakFound);
        }
        response.locals.challengeStreak = challengeStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveChallengeStreakMiddleware, err));
    }
};

export const retreiveChallengeStreakMiddleware = getRetreiveChallengeStreakMiddleware(challengeStreakModel);

export const getSendChallengeStreakMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { challengeStreak } = response.locals;
        response.status(resourceCreatedResponseCode).send(challengeStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendChallengeStreakMiddleware, err));
    }
};

export const sendChallengeStreakMiddleware = getSendChallengeStreakMiddleware(ResponseCodes.success);

export const getOneChallengeStreakMiddlewares = [
    getChallengeStreakParamsValidationMiddleware,
    retreiveChallengeStreakMiddleware,
    sendChallengeStreakMiddleware,
];
