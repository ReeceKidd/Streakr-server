import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { badgeModel, BadgeModel } from '../../Models/Badge';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const level = Joi.object().keys({
    level: Joi.number().required(),
    color: Joi.string().required(),
    criteria: Joi.string().required(),
});

const createBadgeBodyValidationSchema = {
    name: Joi.string().required(),
    description: Joi.string().required(),
    icon: Joi.string().required(),
    levels: Joi.array().items(level),
};

export const createBadgeBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        createBadgeBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSaveBadgeToDatabaseMiddleware = (badge: mongoose.Model<BadgeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name, description, icon, levels } = request.body;
        const newBadge = new badge({
            name,
            description,
            icon,
            levels,
        });
        response.locals.savedBadge = await newBadge.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateBadgeFromRequestMiddleware, err));
    }
};

export const saveBadgeToDatabaseMiddleware = getSaveBadgeToDatabaseMiddleware(badgeModel);

export const sendFormattedBadgeMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedBadge } = response.locals;
        response.status(ResponseCodes.created).send(savedBadge);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedBadgeMiddleware, err));
    }
};

export const createBadgeMiddlewares = [
    createBadgeBodyValidationMiddleware,
    saveBadgeToDatabaseMiddleware,
    sendFormattedBadgeMiddleware,
];
