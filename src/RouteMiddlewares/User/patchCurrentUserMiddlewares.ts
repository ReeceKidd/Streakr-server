import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { AchievementModel, achievementModel } from '../../../src/Models/Achievement';
import { populateCurrentUserAchievementsMiddleware } from './getCurrentUser';
import { DatabaseAchievementType } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { SNS } from '../../../src/sns';
import { getServiceConfig } from '../../../src/getServiceConfig';
import PushNotificationSupportedDeviceTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationSupportedDeviceTypes';
import { getPopulatedCurrentUser } from '../../formatters/getPopulatedCurrentUser';

const patchCurrentUserValidationSchema = {
    email: Joi.string().email(),
    username: Joi.string(),
    name: Joi.string(),
    timezone: Joi.string(),
    pushNotification: {
        token: Joi.string(),
        deviceType: Joi.string(),
    },
    hasCompletedTutorial: Joi.boolean(),
    onboarding: {
        whyDoYouWantToBuildNewHabitsChoice: Joi.string(),
    },
    hasCompletedOnboarding: Joi.boolean(),
    pushNotificationToken: Joi.string(), // Legacy support,
    hasCompletedIntroduction: Joi.boolean(), // Legacy support
};

export const patchCurrentUserRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        patchCurrentUserValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDoesUserEmailExistMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { email } = request.body;
        if (email) {
            const user = await userModel.findOne({ email });
            if (user) {
                throw new CustomError(ErrorType.PatchCurrentUserEmailAlreadyExists);
            }
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchCurrentUserDoesUserEmailExistMiddleware, err));
    }
};

export const doesUserEmailExistMiddleware = getDoesUserEmailExistMiddleware(userModel);

export const getDoesUsernameExistMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { username } = request.body;
        if (username) {
            const lowercaseUsername = username.toLowerCase();
            const user = await userModel.findOne({
                $or: [{ username: lowercaseUsername }, { cognitoUsername: lowercaseUsername }],
            });
            if (user) {
                throw new CustomError(ErrorType.PatchCurrentUserUsernameAlreadyExists);
            }
        }

        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchCurrentUserDoesUsernameAlreadyExistMiddleware));
    }
};

export const doesUsernameExistMiddleware = getDoesUsernameExistMiddleware(userModel);

export const getPatchCurrentUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        const keysToUpdate = request.body.username
            ? {
                  ...request.body,
                  username: request.body.username.toLowerCase(),
              }
            : { ...request.body };
        if (!user) {
            throw new CustomError(ErrorType.AuthenticatedUserNotFound);
        }
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

export const getCreatePlatformEndpointMiddleware = (sns: typeof SNS) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.updatedUser;
        const { pushNotification } = request.body;
        if (pushNotification) {
            const { token, deviceType } = request.body.pushNotification;
            if (deviceType === PushNotificationSupportedDeviceTypes.android) {
                const { EndpointArn } = await sns
                    .createPlatformEndpoint({
                        PlatformApplicationArn: getServiceConfig().ANDROID_SNS_PLATFORM_APPLICATION_ARN,
                        Token: token,
                        CustomUserData: String(user._id),
                    })
                    .promise();
                response.locals.endpointArn = EndpointArn;
            } else if (deviceType === PushNotificationSupportedDeviceTypes.ios) {
                const { EndpointArn } = await sns
                    .createPlatformEndpoint({
                        PlatformApplicationArn: getServiceConfig().IOS_SNS_PLATFORM_APPLICATION_ARN,
                        Token: token,
                        CustomUserData: String(user._id),
                    })
                    .promise();
                response.locals.endpointArn = EndpointArn;
            } else {
                throw new CustomError(ErrorType.UnsupportedDeviceType);
            }
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreatePlatformEndpointMiddleware, err));
    }
};

export const createPlatformEndpointMiddleware = getCreatePlatformEndpointMiddleware(SNS);

export const getUpdateUserPushNotificationInformationMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { endpointArn } = response.locals;
        if (endpointArn) {
            const { pushNotification } = request.body;
            const { token, deviceType } = pushNotification;
            const user: User = response.locals.updatedUser;
            response.locals.updatedUser = await userModel
                .findByIdAndUpdate(
                    user._id,
                    { $set: { pushNotification: { endpointArn, token, deviceType } } },
                    { new: true },
                )
                .lean();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.UpdateUserPushNotificationInformationMiddleware, err));
    }
};

export const updateUserPushNotificationInformationMiddleware = getUpdateUserPushNotificationInformationMiddleware(
    userModel,
);

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
        response.locals.following = following;
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
        response.locals.followers = followers;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulatePatchCurrentUserFollowersMiddleware, err));
    }
};

export const populateCurrentUserFollowersMiddleware = getPopulateCurrentUserFollowersMiddleware(userModel);

export const getPopulatePatchCurrentUserAchievementsMiddleware = (
    achievementModel: mongoose.Model<AchievementModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
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
        else next(new CustomError(ErrorType.PopulatePatchCurrentUserAchievementsMiddleware, err));
    }
};

export const populatePatchCurrentUserAchievementsMiddleware = getPopulatePatchCurrentUserAchievementsMiddleware(
    achievementModel,
);

export const getFormatUserMiddleware = (getPopulatedCurrentUserFunction: typeof getPopulatedCurrentUser) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const user: User = response.locals.updatedUser;
        const following: BasicUser[] = response.locals.following;
        const followers: BasicUser[] = response.locals.followers;
        const achievements: DatabaseAchievementType[] = response.locals.achievements;
        response.locals.formattedUser = getPopulatedCurrentUserFunction({ user, following, followers, achievements });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.PatchCurrentUserFormatUserMiddleware, err));
    }
};

export const formatUserMiddleware = getFormatUserMiddleware(getPopulatedCurrentUser);

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
    doesUserEmailExistMiddleware,
    doesUsernameExistMiddleware,
    patchCurrentUserMiddleware,
    createPlatformEndpointMiddleware,
    updateUserPushNotificationInformationMiddleware,
    populateCurrentUserFollowingMiddleware,
    populateCurrentUserFollowersMiddleware,
    populateCurrentUserAchievementsMiddleware,
    formatUserMiddleware,
    sendUpdatedCurrentUserMiddleware,
];
