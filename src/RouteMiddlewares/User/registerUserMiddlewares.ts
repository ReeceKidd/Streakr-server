import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';

import { userModel, UserModel } from '../../Models/User';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { PopulatedCurrentUser } from '@streakoid/streakoid-sdk/lib';

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
        const user = response.locals.savedUser;
        const formattedUser: PopulatedCurrentUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            membershipInformation: user.membershipInformation,
            userType: user.userType,
            timezone: user.timezone,
            badges: user.badges,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            pushNotificationToken: user.pushNotificationToken,
            notifications: user.notifications,
            profileImages: user.profileImages,
            hasCompletedIntroduction: user.hasCompletedIntroduction,
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
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedUserMiddleware, err));
    }
};

export const registerUserMiddlewares = [
    userRegistrationValidationMiddleware,
    doesUserEmailExistMiddleware,
    setUsernameToLowercaseMiddleware,
    doesUsernameExistMiddleware,
    saveUserToDatabaseMiddleware,
    formatUserMiddleware,
    sendFormattedUserMiddleware,
];
