import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { achievementModel } from '../../../src/Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

const createAchievementBodyValidationSchema = {
    achievementType: Joi.string()
        .valid(Object.keys(AchievementTypes))
        .required(),
    name: Joi.string(),
    description: Joi.string(),
};

export const createAchievementBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createAchievementBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSaveAchievementToDatabaseMiddleware = (achievement: typeof achievementModel) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const achievementDocument = new achievement({ ...request.body });
        response.locals.achievement = await achievementDocument.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveAchievementToDatabaseMiddleware, err));
    }
};

export const saveAchievementToDatabaseMiddleware = getSaveAchievementToDatabaseMiddleware(achievementModel);

export const sendAchievementMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { achievement } = response.locals;
        response.status(ResponseCodes.created).send(achievement);
    } catch (err) {
        next(new CustomError(ErrorType.SendAchievementMiddleware, err));
    }
};

export const createAchievementMiddlewares = [
    createAchievementBodyValidationMiddleware,
    saveAchievementToDatabaseMiddleware,
    sendAchievementMiddleware,
];
