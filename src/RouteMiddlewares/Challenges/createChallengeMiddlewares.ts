import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const createChallengeBodyValidationSchema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    icon: Joi.string().required(),
    color: Joi.string().required(),
};

export const createChallengeBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createChallengeBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSaveChallengeToDatabaseMiddleware = (challenge: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name, description, icon, color } = request.body;
        const newChallenge = new challenge({
            name,
            description,
            icon,
            color,
        });
        response.locals.savedChallenge = await newChallenge.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateChallengeFromRequestMiddleware, err));
    }
};

export const saveChallengeToDatabaseMiddleware = getSaveChallengeToDatabaseMiddleware(challengeModel);

export const sendFormattedChallengeMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedChallenge } = response.locals;
        response.status(ResponseCodes.created).send(savedChallenge);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedChallengeMiddleware, err));
    }
};

export const createChallengeMiddlewares = [
    createChallengeBodyValidationMiddleware,
    saveChallengeToDatabaseMiddleware,
    sendFormattedChallengeMiddleware,
];
