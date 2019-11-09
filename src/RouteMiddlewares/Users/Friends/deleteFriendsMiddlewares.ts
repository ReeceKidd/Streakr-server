import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../../Models/User';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import { User } from '@streakoid/streakoid-sdk/lib';

const deleteFriendParamsValidationSchema = {
    userId: Joi.string()
        .required()
        .length(24),
    friendId: Joi.string()
        .required()
        .length(24),
};

export const deleteFriendParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        deleteFriendParamsValidationSchema,
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
            throw new CustomError(ErrorType.DeleteUserNoUserFound);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteUserRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const doesFriendExistMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const friendId: string = request.params.friendId;
        const user: User = response.locals.user;
        const friend = user.friends.find(friend => friend.friendId == friendId);
        if (!friend) {
            throw new CustomError(ErrorType.DeleteUserFriendDoesNotExist);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteFriendDoesFriendExistMiddleware, err));
    }
};

export const getRetreiveFriendMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { friendId } = request.params;
        const friend = await userModel.findOne({ _id: friendId }).lean();
        if (!friend) {
            throw new CustomError(ErrorType.DeleteFriendNoFriendFound);
        }
        response.locals.friend = friend;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteFriendRetreiveFriendMiddleware, err));
    }
};

export const retreiveFriendMiddleware = getRetreiveFriendMiddleware(userModel);

export const getDeleteFriendMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { friends } = user;
        const { userId, friendId } = request.params;
        const updatedFriends = friends.filter(friend => friend.friendId != friendId);
        await userModel
            .findByIdAndUpdate(userId, {
                $set: {
                    friends: updatedFriends,
                },
            })
            .lean();
        response.locals.updatedFriends = updatedFriends;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.DeleteFriendMiddleware, err));
    }
};

export const deleteFriendMiddleware = getDeleteFriendMiddleware(userModel);

export const getDeleteUserFromFriendsFriendListMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const friend: User = response.locals.friend;
        const { userId } = request.params;
        const updatedFriends = friend.friends.filter(friend => friend.friendId != userId);
        await userModel
            .findByIdAndUpdate(friend._id, {
                $set: {
                    friends: updatedFriends,
                },
            })
            .lean();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.DeleteUserFromFriendsFriendListMiddleware, err));
    }
};

export const deleteUserFromFriendsFriendListMiddleware = getDeleteUserFromFriendsFriendListMiddleware(userModel);

export const sendFriendDeletedResponseMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { updatedFriends } = response.locals;
        response.status(ResponseCodes.success).send(updatedFriends);
    } catch (err) {
        next(new CustomError(ErrorType.SendUserDeletedResponseMiddleware, err));
    }
};

export const deleteFriendMiddlewares = [
    deleteFriendParamsValidationMiddleware,
    retreiveUserMiddleware,
    doesFriendExistMiddleware,
    retreiveFriendMiddleware,
    deleteFriendMiddleware,
    deleteUserFromFriendsFriendListMiddleware,
    sendFriendDeletedResponseMiddleware,
];
