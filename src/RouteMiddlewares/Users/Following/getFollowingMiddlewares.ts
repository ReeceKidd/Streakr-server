import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../../Models/User';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import BasicUser from '@streakoid/streakoid-sdk/lib/models/BasicUser';

const getFollowingParamsValidationSchema = {
    userId: Joi.string().required(),
};

export const getFollowingParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        getFollowingParamsValidationSchema,
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
            throw new CustomError(ErrorType.GetFollowingUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetFollowingRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getRetreiveFollowingInfoMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const currentUser = response.locals.user;
        const following = await Promise.all(
            currentUser.following.map(async (user: string) => {
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
        response.locals.following = following.filter(user => user !== null);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetFollowingInfoMiddleware, err));
    }
};

export const retreiveFollowingInfoMiddleware = getRetreiveFollowingInfoMiddleware(userModel);

export const sendFollowingMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { following } = response.locals.user;
        response.status(ResponseCodes.success).send(following);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedFollowingMiddleware, err));
    }
};

export const getFollowingMiddlewares = [
    getFollowingParamsValidationMiddleware,
    retreiveUserMiddleware,
    retreiveFollowingInfoMiddleware,
    sendFollowingMiddleware,
];
