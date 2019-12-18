import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { badgeModel, BadgeModel } from '../../Models/Badge';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const badgeParamsValidationSchema = {
    badgeId: Joi.string()
        .required()
        .length(24),
};

export const badgeParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        badgeParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveBadgeMiddleware = (badgeModel: mongoose.Model<BadgeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { badgeId } = request.params;
        const badge = await badgeModel.findOne({ _id: badgeId }).lean();
        if (!badge) {
            throw new CustomError(ErrorType.NoBadgeFound);
        }
        response.locals.badge = badge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetRetreiveBadgeMiddleware, err));
    }
};

export const retreiveBadgeMiddleware = getRetreiveBadgeMiddleware(badgeModel);

export const sendBadgeMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { badge } = response.locals;
        response.status(ResponseCodes.success).send(badge);
    } catch (err) {
        next(new CustomError(ErrorType.SendBadgeMiddleware, err));
    }
};

export const getOneBadgeMiddlewares = [badgeParamsValidationMiddleware, retreiveBadgeMiddleware, sendBadgeMiddleware];
