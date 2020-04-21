import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const createChallengeBodyValidationSchema = {
    name: Joi.string(),
    description: Joi.string(),
    icon: Joi.string(),
    color: Joi.string(),
    numberOfMinutes: Joi.number(),
    whatsappGroupLink: Joi.string(),
    discordGroupLink: Joi.string(),
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
        const name: string = request.body.name;
        const { description, icon, color, numberOfMinutes, whatsappGroupLink, discordGroupLink } = request.body;
        const databaseName = name.toLowerCase();
        const newChallenge = new challenge({
            databaseName,
            name,
            description,
            icon,
            color,
            numberOfMinutes,
            whatsappGroupLink,
            discordGroupLink,
        });
        response.locals.challenge = await newChallenge.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateChallengeFromRequestMiddleware, err));
    }
};

export const saveChallengeToDatabaseMiddleware = getSaveChallengeToDatabaseMiddleware(challengeModel);

export const sendFormattedChallengeMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { challenge } = response.locals;
        response.status(ResponseCodes.created).send({ challenge });
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedChallengeMiddleware, err));
    }
};

export const createChallengeMiddlewares = [
    createChallengeBodyValidationMiddleware,
    saveChallengeToDatabaseMiddleware,
    sendFormattedChallengeMiddleware,
];
