import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { IUser } from "../../Models/User";
import { userModel } from '../../Models/User';
import { ISoloStreak, soloStreakModel } from "../../Models/SoloStreak";
import { MessageCategories } from '../../Messages/messageCategories';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { FailureMessageKeys } from '../../Messages/failureMessages';


export interface SoloStreakRegistrationRequestBody {
    userId: string,
    streakName: string,
    streakDescription: string,
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
    streakName: Joi.string().required(),
    streakDescription: Joi.string().required(),
};

export const soloStreakRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, soloStreakRegisterstrationValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};

export const getRetreiveUserWhoCreatedSoloStreakMiddleware = userModel => async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId });
        response.locals.user = user;
        next();
    } catch (err) {
        next(err);
    }
};

export const retreiveUserWhoCreatedSoloStreakMiddleware = getRetreiveUserWhoCreatedSoloStreakMiddleware(userModel);

export const getUserExistsValidationMiddleware = userDoesNotExistMessage => (
    request: Request,
    response: Response,
    next: NextFunction,
) => {

    try {
        const { user } = response.locals as SoloStreakResponseLocals;
        if (!user) {
            return response.status(400).send({
                message: userDoesNotExistMessage,
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};
const localisedUserDoesNotExistMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.loginUnsuccessfulMessage)

export const userExistsValidationMiddleware = getUserExistsValidationMiddleware(localisedUserDoesNotExistMessage);

export const formatResponseLocalsUserMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = response.locals as SoloStreakResponseLocals
        user.password = undefined
        response.locals.user = user
        next()
    } catch (err) {
        next(err)
    }
}

export const getCreateSoloStreakFromRequestMiddleware = soloStreak => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = response.locals;
        const { streakName, streakDescription } = request.body
        response.locals.newSoloStreak = new soloStreak({ streakName, streakDescription, user });
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
        return response.send(savedSoloStreak);
    } catch (err) {
        next(err);
    }
};

export const createSoloStreakMiddlewares = [
    soloStreakRegistrationValidationMiddleware,
    retreiveUserWhoCreatedSoloStreakMiddleware,
    userExistsValidationMiddleware,
    formatResponseLocalsUserMiddleware,
    createSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware
];
