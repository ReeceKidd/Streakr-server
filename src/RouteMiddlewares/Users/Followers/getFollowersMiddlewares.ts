import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../../Models/User';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import { BasicUser } from '@streakoid/streakoid-models/lib';

const getFollowersParamsValidationSchema = {
    userId: Joi.string().required(),
};

export const getFollowersParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        getFollowersParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.params;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.GetFollowersUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetFollowersRetrieveUserMiddleware, err));
    }
};

export const retrieveUserMiddleware = getRetrieveUserMiddleware(userModel);

export const getRetrieveFollowersInfoMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const currentUser = response.locals.user;
        const followers = await Promise.all(
            currentUser.followers.map(async (user: string) => {
                const retrievedUser: UserModel = await userModel.findById(user).lean();
                if (!retrievedUser) {
                    return null;
                }
                const basicUser: BasicUser = {
                    userId: retrievedUser._id,
                    username: retrievedUser.username,
                    profileImage: retrievedUser.profileImages.originalImageUrl,
                };
                return basicUser;
            }),
        );
        response.locals.followers = followers.filter(user => user !== null);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetFollowersInfoMiddleware, err));
    }
};

export const retrieveFollowersInfoMiddleware = getRetrieveFollowersInfoMiddleware(userModel);

export const sendFollowersMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { followers } = response.locals.user;
        response.status(ResponseCodes.success).send(followers);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedFollowersMiddleware, err));
    }
};

export const getFollowersMiddlewares = [
    getFollowersParamsValidationMiddleware,
    retrieveUserMiddleware,
    retrieveFollowersInfoMiddleware,
    sendFollowersMiddleware,
];
