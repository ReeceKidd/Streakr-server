import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { AchievementModel, achievementModel } from '../../../src/Models/Achievement';
import { DatabaseAchievementType } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { PopulatedUser } from '@streakoid/streakoid-models/lib/Models/PopulatedUser';

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

export const getRetrieveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.GetRetrieveUserMiddleware, err));
    }
};

export const retrieveUserMiddleware = getRetrieveUserMiddleware(userModel);

export const getPopulateUserFollowersMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const followers = await Promise.all(
            user.followers.map(async followerId => {
                const populatedFollower: UserModel | null = await userModel.findById(followerId).lean();
                if (populatedFollower) {
                    const basicUser: BasicUser = {
                        userId: followerId,
                        username: populatedFollower.username,
                        profileImage: populatedFollower.profileImages.originalImageUrl,
                    };
                    return basicUser;
                }
                return null;
            }),
        );
        response.locals.followers = followers.map(user => user !== null);
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
                const populatedFollowing: UserModel | null = await userModel.findById(followingId).lean();
                if (populatedFollowing) {
                    const basicUser: BasicUser = {
                        userId: followingId,
                        username: populatedFollowing && populatedFollowing.username,
                        profileImage: populatedFollowing && populatedFollowing.profileImages.originalImageUrl,
                    };
                    return basicUser;
                }
                return null;
            }),
        );
        response.locals.following = following.map(user => user !== null);
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulateUserFollowingMiddleware, err));
    }
};

export const populateUserFollowingMiddleware = getPopulateUserFollowingMiddleware(userModel);

export const getPopulateUserAchievementsMiddleware = (achievementModel: mongoose.Model<AchievementModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const achievements: DatabaseAchievementType[] = await Promise.all(
            user.achievements.map(async achievement => {
                const populatedAchievement: DatabaseAchievementType = await achievementModel
                    .findById(achievement._id)
                    .lean();
                return populatedAchievement;
            }),
        );
        response.locals.achievements = achievements;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulateUserAchievementMiddleware, err));
    }
};

export const populateUserAchievementsMiddleware = getPopulateUserAchievementsMiddleware(achievementModel);

export const formatUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.user;
        const followers: BasicUser[] = response.locals.followers;
        const following: BasicUser[] = response.locals.following;
        const achievements: DatabaseAchievementType[] = response.locals.achievements;
        const formattedUser: PopulatedUser = {
            _id: user._id,
            username: user.username,
            isPayingMember: user.membershipInformation.isPayingMember,
            userType: user.userType,
            timezone: user.timezone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            profileImages: user.profileImages,
            pushNotificationToken: user.pushNotification.token,
            totalStreakCompletes: Number(user.totalStreakCompletes),
            totalLiveStreaks: Number(user.totalLiveStreaks),
            achievements,
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
    retrieveUserMiddleware,
    populateUserFollowersMiddleware,
    populateUserFollowingMiddleware,
    populateUserAchievementsMiddleware,
    formatUserMiddleware,
    sendUserMiddleware,
];
