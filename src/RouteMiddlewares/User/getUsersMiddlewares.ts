import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User, FormattedUser } from '@streakoid/streakoid-sdk/lib';

export const minimumSeachQueryLength = 1;
export const maximumSearchQueryLength = 64;

const getUsersValidationSchema = {
    searchQuery: Joi.string()
        .min(minimumSeachQueryLength)
        .max(maximumSearchQueryLength),
    username: Joi.string(),
    email: Joi.string().email(),
};

export const getUsersValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.query,
        getUsersValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveUsersMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { searchQuery, username, email } = request.query;

        const query: {
            username?: { $regex: string } | string;
            email?: string;
        } = {};
        if (searchQuery) {
            query.username = { $regex: searchQuery.toLowerCase() };
        } else if (username) {
            query.username = username;
        } else if (email) {
            query.email = email;
        }
        response.locals.users = await userModel.find(query).lean();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RetreiveUsersMiddleware, err));
    }
};

export const retreiveUsersMiddleware = getRetreiveUsersMiddleware(userModel);

export const formatUsersMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const users: User[] = response.locals.users;
        response.locals.users = users.map(user => {
            const formattedUser: FormattedUser = {
                _id: user._id,
                username: user.username,
                isPayingMember: user.membershipInformation.isPayingMember,
                userType: user.userType,
                timezone: user.timezone,
                friends: user.friends,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                profileImages: user.profileImages,
                endpointArn: user.endpointArn,
            };
            return formattedUser;
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormatUsersMiddleware, err));
    }
};

export const sendFormattedUsersMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { users } = response.locals;
        response.status(ResponseCodes.success).send(users);
    } catch (err) {
        next(new CustomError(ErrorType.SendUsersMiddleware, err));
    }
};

export const getUsersMiddlewares = [
    getUsersValidationMiddleware,
    retreiveUsersMiddleware,
    formatUsersMiddleware,
    sendFormattedUsersMiddleware,
];
