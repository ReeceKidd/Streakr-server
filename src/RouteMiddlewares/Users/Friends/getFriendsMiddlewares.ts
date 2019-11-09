import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../../Models/User';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import { Friend } from '@streakoid/streakoid-sdk/lib';

export const minimumSeachQueryLength = 1;
export const maximumSearchQueryLength = 64;

const getFriendsParamsValidationSchema = {
    userId: Joi.string().required(),
};

export const getFriendsParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        getFriendsParamsValidationSchema,
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
            throw new CustomError(ErrorType.GetFriendsUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetFriendsRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getRetreiveFriendsInfoMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        const friends = await Promise.all(
            (user.friends as Friend[]).map(async friend => {
                const retreivedFriend = await userModel.findById(friend.friendId).lean();
                if (!retreivedFriend) {
                    return null;
                }
                return {
                    friendId: friend.friendId,
                    username: friend.username,
                    profileImage: retreivedFriend.profileImages.originalImageUrl,
                };
            }),
        );
        response.locals.friends = friends.filter((friend: Friend | null) => friend !== null);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetFriendsInfoMiddleware, err));
    }
};

export const retreiveFriendsInfoMiddleware = getRetreiveFriendsInfoMiddleware(userModel);

export const sendFriendsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { friends } = response.locals.user;
        response.status(ResponseCodes.success).send(friends);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedFriendsMiddleware, err));
    }
};

export const getFriendsMiddlewares = [
    getFriendsParamsValidationMiddleware,
    retreiveUserMiddleware,
    retreiveFriendsInfoMiddleware,
    sendFriendsMiddleware,
];
