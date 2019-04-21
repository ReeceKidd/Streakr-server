import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { IUser } from "../../Models/User";
import { ISoloStreak, soloStreakModel } from "../../Models/SoloStreak";
import { ResponseCodes } from '../../Server/responseCodes';

export interface SoloStreakRegistrationRequestBody {
    userId: string,
    name: string,
    description: string,
    createdAt: Date,
    modifiedAt: Date
}

export interface SoloStreakResponseLocals {
    user?: IUser,
    newSoloStreak?: ISoloStreak,
    savedSoloStreak?: ISoloStreak,
}


const soloStreakRegisterstrationValidationSchema = {
    userId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
};

export const soloStreakRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, soloStreakRegisterstrationValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};

export const getCreateSoloStreakFromRequestMiddleware = soloStreak => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { name, description, userId } = request.body
        response.locals.newSoloStreak = new soloStreak({ name, description, userId });
        next();
    } catch (err) {
        next(err)
    }
};

export const createSoloStreakFromRequestMiddleware = getCreateSoloStreakFromRequestMiddleware(soloStreakModel);


export const saveSoloStreakToDatabaseMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const newSoloStreak: ISoloStreak = response.locals.newSoloStreak;
        response.locals.savedSoloStreak = await newSoloStreak.save();
        next();
    } catch (err) {
        next(err);
    }
};

export const sendFormattedSoloStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { savedSoloStreak } = response.locals as SoloStreakResponseLocals;
        return response.status(ResponseCodes.success).send(savedSoloStreak);
    } catch (err) {
        next(err);
    }
};

export const createSoloStreakMiddlewares = [
    soloStreakRegistrationValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware
];
