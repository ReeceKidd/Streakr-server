import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../../Models/User';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import { User } from '@streakoid/streakoid-models/lib';

const unfollowUserParamsValidationSchema = {
    userId: Joi.string()
        .required()
        .length(24),
    userToUnfollowId: Joi.string()
        .required()
        .length(24),
};

export const unfollowUserParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        unfollowUserParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveSelectedUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.params;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.UnfollowUserNoSelectedUserFound);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.UnfollowUserRetrieveSelectedUserMiddleware, err));
    }
};

export const retrieveSelectedUserMiddleware = getRetrieveSelectedUserMiddleware(userModel);

export const doesUserToUnfollowExistInSelectedUsersFollowingMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const userToUnfollowId: string = request.params.userToUnfollowId;
        const user: User = response.locals.user;
        const userToUnfollow = user.following.find(userId => userId == userToUnfollowId);
        if (!userToUnfollow) {
            throw new CustomError(ErrorType.UserToUnfollowDoesNotExistInSelectedUsersFollowing);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DoesUserToUnfollowExistInSelectedUsersFollowingMiddleware, err));
    }
};

export const getUnfollowUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, userToUnfollowId } = request.params;
        const user = await userModel
            .findByIdAndUpdate(
                userId,
                {
                    $pull: {
                        following: userToUnfollowId,
                    },
                },
                { new: true },
            )
            .lean();
        response.locals.updatedFollowing = user.following;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.UnfollowUserMiddleware, err));
    }
};

export const unfollowUserMiddleware = getUnfollowUserMiddleware(userModel);

export const getDeleteSelectedUserFromUserToUnfollowFollowersMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, userToUnfollowId } = request.params;
        await userModel.findByIdAndUpdate(userToUnfollowId, {
            $pull: {
                followers: userId,
            },
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.DeleteSelectedUserFromUserToUnfollowFollowersMiddleware, err));
    }
};

export const deleteSelectedUserFromUserToUnfollowFollowersMiddleware = getDeleteSelectedUserFromUserToUnfollowFollowersMiddleware(
    userModel,
);

export const sendUserUnfollowedResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { updatedFollowing } = response.locals;
        response.status(ResponseCodes.success).send(updatedFollowing);
    } catch (err) {
        next(new CustomError(ErrorType.SendUserUnfollowedResponseMiddleware, err));
    }
};

export const unfollowUserMiddlewares = [
    unfollowUserParamsValidationMiddleware,
    retrieveSelectedUserMiddleware,
    doesUserToUnfollowExistInSelectedUsersFollowingMiddleware,
    unfollowUserMiddleware,
    deleteSelectedUserFromUserToUnfollowFollowersMiddleware,
    sendUserUnfollowedResponseMiddleware,
];
