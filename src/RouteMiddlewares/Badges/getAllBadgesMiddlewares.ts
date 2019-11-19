import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { badgeModel, BadgeModel } from '../../Models/Badge';

const getBadgesQueryValidationSchema = {
    name: Joi.string(),
};

export const getBadgesQueryValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.query,
        getBadgesQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindBadgesMiddleware = (badgeModel: mongoose.Model<BadgeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name } = request.query;

        const query: {
            name?: string;
        } = {};

        if (name) {
            query.name = name;
        }

        response.locals.badges = await badgeModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindBadgesMiddleware, err));
    }
};

export const findBadgesMiddleware = getFindBadgesMiddleware(badgeModel);

export const sendBadgesMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { badges } = response.locals;
        response.status(ResponseCodes.success).send(badges);
    } catch (err) {
        next(new CustomError(ErrorType.SendBadgesMiddleware, err));
    }
};

export const getAllBadgesMiddlewares = [getBadgesQueryValidationMiddleware, findBadgesMiddleware, sendBadgesMiddleware];
