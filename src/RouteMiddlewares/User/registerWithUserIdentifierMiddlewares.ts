import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';

import { userModel, UserModel } from '../../Models/User';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { generateRandomUsername } from '../../helpers/generateRandomUsername';
import { createUser } from '../../helpers/createUser';
import { generateTemporaryPassword } from '../../helpers/generateTemporaryPassword';
import { awsCognitoSignup } from '../../helpers/awsCognitoSignup';
import { getPopulatedCurrentUser } from '../../formatters/getPopulatedCurrentUser';

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

export const getGenerateTemporaryPasswordMiddleware = (
    getTemporaryPassword: typeof generateTemporaryPassword,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        response.locals.temporaryPassword = getTemporaryPassword();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GenerateTemporaryPasswordMiddleware, err));
    }
};

export const generateTemporaryPasswordMiddleware = getGenerateTemporaryPasswordMiddleware(generateTemporaryPassword);

export const getAwsCognitoSignUpMiddleware = (signUp: typeof awsCognitoSignup) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { randomUsername, temporaryPassword } = response.locals;

        await signUp({ username: randomUsername, password: temporaryPassword });

        next();
    } catch (err) {
        next(new CustomError(ErrorType.AwsCognitoSignUpMiddleware, err));
    }
};

export const awsCognitoSignUpMiddleware = getAwsCognitoSignUpMiddleware(awsCognitoSignup);

export const getSaveTemporaryUserToDatabaseMiddleware = (createUserFunction: typeof createUser) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userIdentifier } = request.body;
        const { timezone, randomUsername, temporaryPassword } = response.locals;

        response.locals.savedUser = await createUserFunction({
            userIdentifier,
            timezone,
            username: randomUsername,
            temporaryPassword,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveTemporaryUserToDatabaseMiddleware, err));
    }
};

export const saveTemporaryUserToDatabaseMiddleware = getSaveTemporaryUserToDatabaseMiddleware(createUser);

export const getFormatTemporaryUserMiddleware = (getPopulatedCurrentUserFunction: typeof getPopulatedCurrentUser) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const user: User = response.locals.savedUser;
        response.locals.formattedUser = getPopulatedCurrentUserFunction({
            user,
            following: [],
            followers: [],
            achievements: [],
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RegisterTemporaryUserFormatUserMiddleware, err));
    }
};

export const formatTemporaryUserMiddleware = getFormatTemporaryUserMiddleware(getPopulatedCurrentUser);

export const sendFormattedTemporaryUserMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { formattedUser } = response.locals;
        response.status(ResponseCodes.created).send(formattedUser);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedTemporaryUserMiddleware, err));
    }
};

export const registerWithUserIdentifierMiddlewares = [
    temporaryUserRegistrationValidationMiddleware,
    doesUserIdentifierExistMiddleware,
    generateRandomUsernameMiddleware,
    generateTemporaryPasswordMiddleware,
    awsCognitoSignUpMiddleware,
    saveTemporaryUserToDatabaseMiddleware,
    formatTemporaryUserMiddleware,
    sendFormattedTemporaryUserMiddleware,
];
