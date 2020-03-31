import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { UserModel, userModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User, FormattedUser } from '@streakoid/streakoid-sdk/lib';

export const minimumSeachQueryLength = 1;
export const maximumSearchQueryLength = 64;

const getUsersValidationSchema = {
    limit: Joi.number(),
    skip: Joi.number(),
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

export const formUsersQueryMiddleware = (request: Request, response: Response, next: NextFunction): void => {
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
        response.locals.query = query;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormUsersQueryMiddleware, err));
    }
};

export const getCalculateTotalUsersCountMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { query } = response.locals;

        const totalUserCount = await userModel.find(query).countDocuments();

        response.setHeader('x-total-count', totalUserCount);

        next();
    } catch (err) {
        next(new CustomError(ErrorType.CalculateTotalUsersCountMiddleware, err));
    }
};

export const calculateTotalUsersCountMiddleware = getCalculateTotalUsersCountMiddleware(userModel);

export const getFindUsersMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { skip, limit } = request.query;
        const { query } = response.locals;

        const users = await userModel
            .find(query)
            .skip(Number(skip))
            .limit(Number(limit))
            .lean();

        response.locals.users = users;

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindUsersMiddleware, err));
    }
};

export const findUsersMiddleware = getFindUsersMiddleware(userModel);

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
                badges: user.badges,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                profileImages: user.profileImages,
                pushNotificationToken: user.pushNotificationToken,
                hasCompletedIntroduction: user.hasCompletedIntroduction,
            };
            return formattedUser;
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormatUsersMiddleware, err));
    }
};

export const sendUsersMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { users } = response.locals;
        response.status(ResponseCodes.success).send(users);
    } catch (err) {
        next(new CustomError(ErrorType.SendUsersMiddleware, err));
    }
};

export const getAllUsersMiddlewares = [
    getUsersValidationMiddleware,
    formUsersQueryMiddleware,
    calculateTotalUsersCountMiddleware,
    findUsersMiddleware,
    formatUsersMiddleware,
    sendUsersMiddleware,
];
