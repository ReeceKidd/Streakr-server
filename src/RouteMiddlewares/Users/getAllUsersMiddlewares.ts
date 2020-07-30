import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { UserModel, userModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { getFormattedUser } from '../../formatters/getFormattedUser';

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
    userIds: Joi.array().items(Joi.string()),
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
        const { searchQuery, username, email, userIds } = request.query;

        const query: {
            username?: { $regex: string } | string;
            email?: string;
            _id?: { $in: string[] };
        } = {};
        if (searchQuery) {
            query.username = { $regex: searchQuery.toLowerCase() };
        } else if (username) {
            query.username = username;
        } else if (email) {
            query.email = email;
        } else if (userIds) {
            const parsedUserIds = JSON.parse(userIds);
            query._id = { $in: parsedUserIds };
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
            .sort({ 'longestEverStreak.numberOfDays': -1 })
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

export const getFormatUsersMiddleware = (formatUser: typeof getFormattedUser) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const users: User[] = response.locals.users;
        response.locals.users = users.map(user => {
            return formatUser({ user });
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormatUsersMiddleware, err));
    }
};

export const formatUsersMiddleware = getFormatUsersMiddleware(getFormattedUser);

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
