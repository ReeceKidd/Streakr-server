import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';

import { userModel, UserModel } from '../../Models/User';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { generateRandomUsername } from '../../helpers/generateRandomUsername';
import { createUser } from '../../helpers/createUser';

const registerValidationSchema = {
    userIdentifier: Joi.string().required(),
};

export const temporaryUserRegistrationValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        registerValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDoesUserIdentifierExistMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userIdentifier } = request.body;
        const user = await userModel.findOne({ userIdentifier });
        if (user) {
            throw new CustomError(ErrorType.UserIdentifierExists);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DoesUserIdentifierExistMiddleware, err));
    }
};

export const doesUserIdentifierExistMiddleware = getDoesUserIdentifierExistMiddleware(userModel);

export const getGenerateRandomUsernameMiddleware = (getRandomUsername: typeof generateRandomUsername) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        response.locals.randomUsername = getRandomUsername();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GenerateRandomUsernameMiddleware, err));
    }
};

export const generateRandomUsernameMiddleware = getGenerateRandomUsernameMiddleware(generateRandomUsername);

export const getSaveTemporaryUserToDatabaseMiddleware = (createUserFunction: typeof createUser) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userIdentifier } = request.body;
        const { timezone, randomUsername } = response.locals;

        response.locals.savedUser = await createUserFunction({ userIdentifier, timezone, username: randomUsername });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveTemporaryUserToDatabaseMiddleware, err));
    }
};

export const saveTemporaryUserToDatabaseMiddleware = getSaveTemporaryUserToDatabaseMiddleware(createUser);

export const formatTemporaryUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.savedUser;
        const formattedUser: PopulatedCurrentUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            membershipInformation: user.membershipInformation,
            userType: user.userType,
            timezone: user.timezone,
            totalStreakCompletes: Number(user.totalStreakCompletes),
            totalLiveStreaks: Number(user.totalLiveStreaks),
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            pushNotification: user.pushNotification,
            pushNotifications: user.pushNotifications,
            profileImages: user.profileImages,
            hasCompletedTutorial: user.hasCompletedTutorial,
            hasCompletedIntroduction: user.hasCompletedIntroduction,
            onboarding: user.onboarding,
            hasCompletedOnboarding: user.hasCompletedOnboarding,
            followers: [],
            following: [],
            achievements: [],
        };
        response.locals.user = formattedUser;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RegisterTemporaryUserFormatUserMiddleware, err));
    }
};

export const sendFormattedTemporaryUserMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { user } = response.locals;
        response.status(ResponseCodes.created).send(user);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedTemporaryUserMiddleware, err));
    }
};

export const registerWithUserIdentifierMiddlewares = [
    temporaryUserRegistrationValidationMiddleware,
    doesUserIdentifierExistMiddleware,
    generateRandomUsernameMiddleware,
    saveTemporaryUserToDatabaseMiddleware,
    formatTemporaryUserMiddleware,
    sendFormattedTemporaryUserMiddleware,
];
