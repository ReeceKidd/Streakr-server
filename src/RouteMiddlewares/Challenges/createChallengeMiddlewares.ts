import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { BadgeModel, badgeModel } from '../../../src/Models/Badge';
import { BadgeTypes, Badge } from '@streakoid/streakoid-sdk/lib';

const level = Joi.object().keys({
    level: Joi.number().required(),
    criteria: Joi.string().required(),
});

const createChallengeBodyValidationSchema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    icon: Joi.string().required(),
    color: Joi.string().required(),
    levels: Joi.array()
        .items(level)
        .required(),
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

export const getCreateBadgeForChallengeMiddleware = (badge: mongoose.Model<BadgeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name, description, icon } = request.body;
        const badgeType = BadgeTypes.challenge;
        const newBadge = new badge({
            name,
            description,
            icon,
            badgeType,
        });
        response.locals.badge = await newBadge.save();
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateBadgeForChallengeMiddleware, err));
    }
};

export const createBadgeForChallengeMiddleware = getCreateBadgeForChallengeMiddleware(badgeModel);

export const getSaveChallengeToDatabaseMiddleware = (challenge: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const badge: Badge = response.locals.badge;
        const {
            name,
            description,
            icon,
            color,
            numberOfMinutes,
            levels,
            whatsappGroupLink,
            discordGroupLink,
        } = request.body;
        const newChallenge = new challenge({
            name,
            description,
            icon,
            color,
            badgeId: badge._id,
            levels,
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

export const sendFormattedChallengeAndBadgeMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { badge, challenge } = response.locals;
        response.status(ResponseCodes.created).send({ badge, challenge });
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedChallengeMiddleware, err));
    }
};

export const createChallengeMiddlewares = [
    createChallengeBodyValidationMiddleware,
    createBadgeForChallengeMiddleware,
    saveChallengeToDatabaseMiddleware,
    sendFormattedChallengeAndBadgeMiddleware,
];
