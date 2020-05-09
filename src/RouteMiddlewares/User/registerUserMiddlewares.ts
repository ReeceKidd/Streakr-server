import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';

import { userModel, UserModel } from '../../Models/User';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { PopulatedCurrentUser } from '@streakoid/streakoid-models/lib/Models/PopulatedCurrentUser';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

const registerValidationSchema = {
    username: Joi.string().required(),
    email: Joi.string()
        .email()
        .required(),
};

export const userRegistrationValidationMiddleware = (
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

export const getDoesUserEmailExistMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { email } = request.body;
        const user = await userModel.findOne({ email });
        if (user) {
            throw new CustomError(ErrorType.UserEmailAlreadyExists);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DoesUserEmailExistMiddleware, err));
    }
};

export const doesUserEmailExistMiddleware = getDoesUserEmailExistMiddleware(userModel);

export const setUsernameToLowercaseMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { username } = request.body;
        response.locals.lowerCaseUsername = username.toLowerCase();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetUsernameToLowercaseMiddleware, err));
    }
};

export const getDoesUsernameExistMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { lowerCaseUsername } = response.locals;
        const user = await userModel.findOne({ username: lowerCaseUsername });
        if (user) {
            throw new CustomError(ErrorType.UsernameAlreadyExists);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DoesUsernameAlreadyExistMiddleware));
    }
};

export const doesUsernameExistMiddleware = getDoesUsernameExistMiddleware(userModel);

export const getSaveUserToDatabaseMiddleware = (user: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { lowerCaseUsername, timezone } = response.locals;
        const { email } = request.body;
        const newUser = new user({
            username: lowerCaseUsername,
            email,
            timezone,
        });
        response.locals.savedUser = await newUser.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveUserToDatabaseMiddleware, err));
    }
};

export const saveUserToDatabaseMiddleware = getSaveUserToDatabaseMiddleware(userModel);

export const formatUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.savedUser;
        const formattedUser: PopulatedCurrentUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            membershipInformation: user.membershipInformation,
            userType: user.userType,
            timezone: user.timezone,
            totalStreakCompletes: user.totalStreakCompletes,
            totalLiveStreaks: user.totalLiveStreaks,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            pushNotificationToken: user.pushNotificationToken,
            pushNotifications: user.pushNotifications,
            profileImages: user.profileImages,
            hasCompletedIntroduction: user.hasCompletedIntroduction,
            followers: [],
            following: [],
            achievements: [],
        };
        response.locals.user = formattedUser;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RegisterUserFormatUserMiddleware, err));
    }
};

export const sendFormattedUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { user } = response.locals;
        response.status(ResponseCodes.created).send(user);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedUserMiddleware, err));
    }
};

export const getCreatedAccountActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const createdAccountActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.createdAccount,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
        };
        await createActivityFeedItemFunction(createdAccountActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreatedAccountActivityFeedItemMiddleware, err));
    }
};

export const createdAccountActivityFeedItemMiddleware = getCreatedAccountActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const registerUserMiddlewares = [
    userRegistrationValidationMiddleware,
    doesUserEmailExistMiddleware,
    setUsernameToLowercaseMiddleware,
    doesUsernameExistMiddleware,
    saveUserToDatabaseMiddleware,
    formatUserMiddleware,
    sendFormattedUserMiddleware,
    createdAccountActivityFeedItemMiddleware,
];
