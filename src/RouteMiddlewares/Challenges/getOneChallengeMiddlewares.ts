import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const challengeParamsValidationSchema = {
    challengeId: Joi.string()
        .required()
        .length(24),
};

export const challengeParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        challengeParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveChallengeMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { challengeId } = request.params;
        const challenge = await challengeModel.findOne({ _id: challengeId }).lean();
        if (!challenge) {
            throw new CustomError(ErrorType.NoChallengeFound);
        }
        response.locals.challenge = challenge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetRetreiveChallengeMiddleware, err));
    }
};

export const retreiveChallengeMiddleware = getRetreiveChallengeMiddleware(challengeModel);

export const sendChallengeMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { challenge } = response.locals;
        response.status(ResponseCodes.success).send(challenge);
    } catch (err) {
        next(new CustomError(ErrorType.SendChallengeMiddleware, err));
    }
};

export const getChallengeMiddlewares = [
    challengeParamsValidationMiddleware,
    retreiveChallengeMiddleware,
    sendChallengeMiddleware,
];
