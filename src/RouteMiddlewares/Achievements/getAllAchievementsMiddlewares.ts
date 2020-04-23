import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { SupportedResponseHeaders, AchievementTypes } from '@streakoid/streakoid-sdk/lib';
import { AchievementModel, achievementModel } from '../../../src/Models/Achievement';

const getAchievementsQueryValidationSchema = {
    achievementType: Joi.string().valid(Object.keys(AchievementTypes)),
};

export const getAchievementsQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getAchievementsQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const formAchievementsQueryMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { achievementType } = request.query;

        const query: {
            achievementType?: string;
        } = {};

        if (achievementType) {
            query.achievementType = achievementType;
        }

        response.locals.query = query;

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormAchievementsQueryMiddleware, err));
    }
};

export const getCalculateTotalCountOfAchievementsMiddleware = (
    achivementModel: mongoose.Model<AchievementModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { query } = response.locals;

        const totalCountOfAchievements = await achivementModel.find(query).countDocuments();

        response.set(SupportedResponseHeaders.TotalCount, String(totalCountOfAchievements));

        next();
    } catch (err) {
        next(new CustomError(ErrorType.CalculateTotalCountOfAchievementsMiddleware, err));
    }
};

export const calculateTotalCountOfAchievementsMiddleware = getCalculateTotalCountOfAchievementsMiddleware(
    achievementModel,
);

export const getFindAchievementsMiddleware = (achivementModel: mongoose.Model<AchievementModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { query } = response.locals;

        const achievements = await achivementModel.find(query);

        response.locals.achievements = achievements;

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindAchievementsMiddleware, err));
    }
};

export const findAchievementsMiddleware = getFindAchievementsMiddleware(achievementModel);

export const sendAchievementsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { achievements } = response.locals;
        response.status(ResponseCodes.success).send(achievements);
    } catch (err) {
        next(new CustomError(ErrorType.SendAchievementsMiddleware, err));
    }
};

export const getAllAchievementsMiddlewares = [
    getAchievementsQueryValidationMiddleware,
    formAchievementsQueryMiddleware,
    calculateTotalCountOfAchievementsMiddleware,
    findAchievementsMiddleware,
    sendAchievementsMiddleware,
];
