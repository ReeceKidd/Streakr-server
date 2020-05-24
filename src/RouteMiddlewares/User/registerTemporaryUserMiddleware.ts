import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';

import { userModel, UserModel } from '../../Models/User';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';

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

// export const getDoesUserIdentifierAlreadyExistMiddleware = (user: Model<UserModel>) => async (
//     request: Request,
//     response: Response,
//     next: NextFunction,
// ): Promise<void> => {
//     try {
//         const { userIdentifier } = request.body;
//         const { timezone } = response.locals;
//         const newUser = new user({
//             userIdentifier,
//             userType: UserTypes.unregistered,
//             timezone,
//         });
//         response.locals.savedUser = await newUser.save();
//         next();
//     } catch (err) {
//         next(new CustomError(ErrorType.UserIdentifierAlreadyExistMiddleware, err));
//     }
// };

export const getSaveTemporaryUserToDatabaseMiddleware = (user: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userIdentifier } = request.body;
        const { timezone } = response.locals;
        const newUser = new user({
            userIdentifier,
            userType: UserTypes.unregistered,
            timezone,
        });
        response.locals.savedUser = await newUser.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveTemporaryUserToDatabaseMiddleware, err));
    }
};

export const saveTemporaryUserToDatabaseMiddleware = getSaveTemporaryUserToDatabaseMiddleware(userModel);

export const formatTemporaryUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.savedUser;
        const formattedUser: PopulatedCurrentUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
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

export const registerTemporaryUserMiddlewares = [
    temporaryUserRegistrationValidationMiddleware,
    saveTemporaryUserToDatabaseMiddleware,
    formatTemporaryUserMiddleware,
    sendFormattedTemporaryUserMiddleware,
];
