import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User, PopulatedUser, Badge } from '@streakoid/streakoid-sdk/lib';
import { BadgeModel, badgeModel } from '../../Models/Badge';
import BasicUser from '@streakoid/streakoid-sdk/lib/models/BasicUser';

const userParamsValidationSchema = {
    userId: Joi.string()
        .required()
        .length(24),
};

export const userParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        userParamsValidationSchema,
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
            throw new CustomError(ErrorType.NoUserFound);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getPopulateUserBadgesMiddleware = (badgeModel: mongoose.Model<BadgeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const badges = await badgeModel.find({ _id: user.badges }).lean();
        response.locals.badges = badges;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetUserPopulateUserBadgesMiddleware, err));
    }
};

export const populateUserBadgesMiddleware = getPopulateUserBadgesMiddleware(badgeModel);

export const getPopulateUserFollowersMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const followers = await Promise.all(
            user.followers.map(async followerId => {
                const populatedFollower: UserModel = await userModel.findById(followerId).lean();
                const basicUser: BasicUser = {
                    userId: followerId,
                    username: populatedFollower.username,
                    profileImage: populatedFollower.profileImages.originalImageUrl,
                };
                return basicUser;
            }),
        );
        response.locals.followers = followers;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulateUserFollowersMiddleware, err));
    }
};

export const populateUserFollowersMiddleware = getPopulateUserFollowersMiddleware(userModel);

export const getPopulateUserFollowingMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const following = await Promise.all(
            user.following.map(async followingId => {
                const populatedFollowing: UserModel = await userModel.findById(followingId).lean();
                const basicUser: BasicUser = {
                    userId: followingId,
                    username: populatedFollowing && populatedFollowing.username,
                    profileImage: populatedFollowing && populatedFollowing.profileImages.originalImageUrl,
                };
                return basicUser;
            }),
        );
        response.locals.following = following;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulateUserFollowingMiddleware, err));
    }
};

export const populateUserFollowingMiddleware = getPopulateUserFollowingMiddleware(userModel);

export const formatUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.user;
        const followers: BasicUser[] = response.locals.followers;
        const following: BasicUser[] = response.locals.following;
        const badges: Badge[] = response.locals.badges;
        const formattedUser: PopulatedUser = {
            _id: user._id,
            username: user.username,
            isPayingMember: user.membershipInformation.isPayingMember,
            userType: user.userType,
            timezone: user.timezone,
            badges,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            profileImages: user.profileImages,
            pushNotificationToken: user.pushNotificationToken,
            friends: user.friends,
            followers,
            following,
        };
        response.locals.user = formattedUser;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormatUserMiddleware, err));
    }
};

export const sendUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { user } = response.locals;
        response.status(ResponseCodes.success).send(user);
    } catch (err) {
        next(new CustomError(ErrorType.SendUserMiddleware, err));
    }
};

export const getUserMiddlewares = [
    userParamsValidationMiddleware,
    retreiveUserMiddleware,
    populateUserBadgesMiddleware,
    populateUserFollowersMiddleware,
    populateUserFollowingMiddleware,
    formatUserMiddleware,
    sendUserMiddleware,
];
