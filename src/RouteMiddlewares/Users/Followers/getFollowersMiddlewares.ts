import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../../Models/User';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import BasicUser from '@streakoid/streakoid-sdk/lib/models/BasicUser';

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

export const getRetreiveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.GetFollowersRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getRetreiveFollowersInfoMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const currentUser = response.locals.user;
        const followers = await Promise.all(
            currentUser.followers.map(async (user: string) => {
                const retreivedUser: UserModel = await userModel.findById(user).lean();
                if (!retreivedUser) {
                    return null;
                }
                const basicUser: BasicUser = {
                    userId: retreivedUser._id,
                    username: retreivedUser.username,
                    profileImage: retreivedUser.profileImages.originalImageUrl,
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

export const retreiveFollowersInfoMiddleware = getRetreiveFollowersInfoMiddleware(userModel);

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
    retreiveUserMiddleware,
    retreiveFollowersInfoMiddleware,
    sendFollowersMiddleware,
];
