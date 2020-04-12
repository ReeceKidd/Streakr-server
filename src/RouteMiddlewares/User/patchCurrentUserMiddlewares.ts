import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User, PopulatedCurrentUser } from '@streakoid/streakoid-sdk/lib';
import { BadgeModel } from '../../Models/Badge';
import { badgeModel } from '../../Models/Badge';
import BasicUser from '@streakoid/streakoid-sdk/lib/models/BasicUser';

const validHours = [];
for (let hour = 0; hour < 24; hour++) {
    validHours.push(hour);
}
const validMinutes = [];
for (let minute = 0; minute < 60; minute++) {
    validMinutes.push(minute);
}

const userBodyValidationSchema = {
    email: Joi.string().email(),
    notifications: Joi.object({
        completeStreaksReminder: Joi.object({
            emailNotification: Joi.boolean(),
            pushNotification: Joi.boolean(),
            reminderHour: Joi.number().valid(validHours),
            reminderMinute: Joi.number().valid(validMinutes),
        }),
        newFollowerUpdates: Joi.object({
            emailNotification: Joi.boolean(),
            pushNotification: Joi.boolean(),
        }),
        teamStreakUpdates: Joi.object({
            emailNotification: Joi.boolean(),
            pushNotification: Joi.boolean(),
        }),
        badgeUpdates: Joi.object({
            emailNotification: Joi.boolean(),
            pushNotification: Joi.boolean(),
        }),
    }),
    badges: Joi.array(),
    timezone: Joi.string(),
    pushNotificationToken: Joi.string(),
    hasCompletedIntroduction: Joi.boolean(),
};

export const patchCurrentUserRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        userBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchCurrentUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        const keysToUpdate = request.body;
        const updatedUser = await userModel.findByIdAndUpdate(user._id, { ...keysToUpdate }, { new: true }).lean();
        if (!updatedUser) {
            throw new CustomError(ErrorType.UpdateCurrentUserNotFound);
        }
        response.locals.updatedUser = updatedUser;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchCurrentUserMiddleware, err));
    }
};

export const patchCurrentUserMiddleware = getPatchCurrentUserMiddleware(userModel);

export const getPopulateCurrentUserBadgesMiddleware = (badgeModel: mongoose.Model<BadgeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedUser: User = response.locals.updatedUser;
        const badges = await badgeModel.find({ _id: updatedUser.badges }).lean();
        response.locals.updatedUser.badges = badges;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchCurrentUserPopulateUserBadgesMiddleware, err));
    }
};

export const populateCurrentUserBadgesMiddleware = getPopulateCurrentUserBadgesMiddleware(badgeModel);

export const getPopulateCurrentUserFollowingMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedUser: User = response.locals.updatedUser;
        const following = await Promise.all(
            updatedUser.following.map(async followingId => {
                const populatedFollowing: UserModel = await userModel.findById(followingId).lean();
                const basicUser: BasicUser = {
                    userId: followingId,
                    username: populatedFollowing.username,
                    profileImage: populatedFollowing.profileImages.originalImageUrl,
                };
                return basicUser;
            }),
        );
        response.locals.updatedUser.following = following;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulatePatchCurrentUserFollowingMiddleware, err));
    }
};

export const populateCurrentUserFollowingMiddleware = getPopulateCurrentUserFollowingMiddleware(userModel);

export const getPopulateCurrentUserFollowersMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedUser: User = response.locals.updatedUser;
        const followers = await Promise.all(
            updatedUser.followers.map(async followerId => {
                const populatedFollower: UserModel = await userModel.findById(followerId).lean();
                const basicUser: BasicUser = {
                    userId: followerId,
                    username: populatedFollower.username,
                    profileImage: populatedFollower.profileImages.originalImageUrl,
                };
                return basicUser;
            }),
        );
        response.locals.updatedUser.followers = followers;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulatePatchCurrentUserFollowersMiddleware, err));
    }
};

export const populateCurrentUserFollowersMiddleware = getPopulateCurrentUserFollowersMiddleware(userModel);

export const formatUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user = response.locals.updatedUser;
        const formattedUser: PopulatedCurrentUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            membershipInformation: user.membershipInformation,
            userType: user.userType,
            timezone: user.timezone,
            badges: user.badges,
            followers: user.followers,
            following: user.following,
            friends: user.friends,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            pushNotificationToken: user.pushNotificationToken,
            notifications: user.notifications,
            profileImages: user.profileImages,
            hasCompletedIntroduction: user.hasCompletedIntroduction,
        };
        response.locals.formattedUser = formattedUser;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.PatchCurrentUserFormatUserMiddleware, err));
    }
};

export const sendUpdatedCurrentUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { formattedUser } = response.locals;
        response.status(ResponseCodes.success).send(formattedUser);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedCurrentUserMiddleware, err));
    }
};

export const patchCurrentUserMiddlewares = [
    patchCurrentUserRequestBodyValidationMiddleware,
    patchCurrentUserMiddleware,
    populateCurrentUserBadgesMiddleware,
    populateCurrentUserFollowingMiddleware,
    populateCurrentUserFollowersMiddleware,
    formatUserMiddleware,
    sendUpdatedCurrentUserMiddleware,
];
