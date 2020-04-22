import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';

const getChallengesQueryValidationSchema = {
    limit: Joi.number(),
    searchQuery: Joi.string(),
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

export const formChallengesQueryMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { searchQuery } = request.query;

        const query: {
            databaseName?: { $regex: string } | string;
        } = {};

        if (searchQuery) {
            query.databaseName = { $regex: searchQuery.toLowerCase() };
        }

        response.locals.query = query;

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormChallengesQueryMiddleware, err));
    }
};

export const getCalculateTotalChallengesCountMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { query } = response.locals;

        const totalChallengesCount = await challengeModel.find(query).countDocuments();

        response.setHeader('x-total-count', totalChallengesCount);

        next();
    } catch (err) {
        next(new CustomError(ErrorType.CalculateTotalChallengesCountMiddleware, err));
    }
};

export const calculateChallengesCountMiddleware = getCalculateTotalChallengesCountMiddleware(challengeModel);

export const getFindChallengesMiddleware = (userModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { limit } = request.query;
        const { query } = response.locals;

        if (limit) {
            response.locals.challenges = await userModel
                .find(query)
                .sort({ numberOfMembers: -1 })
                .limit(Number(limit))
                .lean();
        } else {
            response.locals.challenges = await userModel
                .find(query)
                .sort({ numberOfMembers: -1 })
                .lean();
        }

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
    formChallengesQueryMiddleware,
    calculateChallengesCountMiddleware,
    findChallengesMiddleware,
    sendChallengesMiddleware,
];
