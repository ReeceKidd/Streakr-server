import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';

const getChallengesQueryValidationSchema = {
    name: Joi.string(),
};

export const getChallengesQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getChallengesQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindChallengesMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { name } = request.query;

        const query: {
            databaseName?: { $regex: string } | string;
        } = {};

        if (name) {
            query.databaseName = { $regex: name.toLowerCase() };
        }

        response.locals.challenges = await challengeModel.find(query).sort({ numberOfMembers: -1 });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindChallengesMiddleware, err));
    }
};

export const findChallengesMiddleware = getFindChallengesMiddleware(challengeModel);

export const sendChallengesMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { challenges } = response.locals;
        response.status(ResponseCodes.success).send(challenges);
    } catch (err) {
        next(new CustomError(ErrorType.SendChallengesMiddleware, err));
    }
};

export const getAllChallengesMiddlewares = [
    getChallengesQueryValidationMiddleware,
    findChallengesMiddleware,
    sendChallengesMiddleware,
];
