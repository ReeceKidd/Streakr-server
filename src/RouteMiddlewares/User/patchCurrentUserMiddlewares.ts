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
import { getPopulatedCurrentUser } from '../../formatters/getPopulatedCurrentUser';
import UserTypes from '@streakoid/streakoid-models/lib/Types/UserTypes';
import { deleteSnsEndpoint, getSnsEndpoint } from '../../../tests/helpers/deleteSnsEndpoint';

const patchCurrentUserValidationSchema = {
    email: Joi.string().email(),
    username: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    hasUsernameBeenCustomized: Joi.boolean(),
    timezone: Joi.string(),
    pushNotification: {
        androidToken: Joi.string().allow(null),
        iosToken: Joi.string().allow(null),
        //Legacy
        token: Joi.string(),
        deviceType: Joi.string(),
    },
    hasProfileImageBeenCustomized: Joi.boolean(),
    hasCompletedTutorial: Joi.boolean(),
    onboarding: {
        whyDoYouWantToBuildNewHabitsChoice: Joi.string(),
    },
    hasCompletedOnboarding: Joi.boolean(),
    userType: Joi.string().valid([UserTypes.basic]),
    hasVerifiedEmail: Joi.boolean(),
    hasCustomPassword: Joi.boolean(),
    teamStreaksOrder: Joi.array().items(Joi.string()),
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

export const getRemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware = ({
    userModel,
    getEndpoint,
    deleteEndpoint,
}: {
    userModel: mongoose.Model<UserModel>;
    getEndpoint: typeof getSnsEndpoint;
    deleteEndpoint: typeof deleteSnsEndpoint;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { pushNotification } = request.body;
        const androidToken = pushNotification && pushNotification.androidToken;
        const androidEndpointArn = user.pushNotification.androidEndpointArn;
        if (androidToken && androidEndpointArn) {
            const endpoint = await getEndpoint({ endpointArn: androidEndpointArn });
            if (endpoint) {
                await deleteEndpoint({ endpointArn: androidEndpointArn });
            }
            response.locals.user = await userModel.findByIdAndUpdate(
                user._id,
                {
                    $set: { pushNotification: { androidEndpointArn: null } },
                },
                { new: true },
            );
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware, err));
    }
};

export const removeOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware = getRemoveOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware(
    { userModel, getEndpoint: getSnsEndpoint, deleteEndpoint: deleteSnsEndpoint },
);

export const getRemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware = ({
    userModel,
    getEndpoint,
    deleteEndpoint,
}: {
    userModel: mongoose.Model<UserModel>;
    getEndpoint: typeof getSnsEndpoint;
    deleteEndpoint: typeof deleteSnsEndpoint;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { pushNotification } = request.body;
        const iosToken = pushNotification && pushNotification.iosToken;
        const iosEndpointArn = user.pushNotification.iosEndpointArn;
        if (iosToken && iosEndpointArn) {
            const endpoint = await getEndpoint({ endpointArn: iosEndpointArn });
            if (endpoint) {
                await deleteEndpoint({ endpointArn: iosEndpointArn });
            }
            response.locals.user = await userModel.findByIdAndUpdate(
                user._id,
                {
                    $set: { pushNotification: { iosEndpointArn: null } },
                },
                { new: true },
            );
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware, err));
    }
};

export const removeOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware = getRemoveOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware(
    { userModel, getEndpoint: getSnsEndpoint, deleteEndpoint: deleteSnsEndpoint },
);

export const getCreateAndroidPlatformEndpointMiddleware = ({
    userModel,
    sns,
}: {
    userModel: mongoose.Model<UserModel>;
    sns: typeof SNS;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { pushNotification } = request.body;
        if (pushNotification) {
            const { androidToken } = request.body.pushNotification;
            if (androidToken) {
                try {
                    const { EndpointArn } = await sns
                        .createPlatformEndpoint({
                            PlatformApplicationArn: getServiceConfig().ANDROID_SNS_PLATFORM_APPLICATION_ARN,
                            Token: androidToken,
                            CustomUserData: String(user._id),
                        })
                        .promise();
                    response.locals.user = await userModel
                        .findByIdAndUpdate(
                            user._id,
                            {
                                $set: {
                                    pushNotification: {
                                        ...pushNotification,
                                        androidEndpointArn: EndpointArn,
                                        androidToken,
                                    },
                                },
                            },
                            { new: true },
                        )
                        .lean();
                } catch (err) {
                    throw new CustomError(ErrorType.CreateAndroidPlatformEndpointFailure);
                }
            }
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateAndroidPlatformEndpointMiddleware, err));
    }
};

export const createAndroidPlatformEndpointMiddleware = getCreateAndroidPlatformEndpointMiddleware({
    sns: SNS,
    userModel,
});

export const getCreateIosPlatformEndpointMiddleware = ({
    userModel,
    sns,
}: {
    userModel: mongoose.Model<UserModel>;
    sns: typeof SNS;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { pushNotification } = request.body;
        if (pushNotification) {
            const { iosToken } = pushNotification;
            if (iosToken) {
                try {
                    const { EndpointArn } = await sns
                        .createPlatformEndpoint({
                            PlatformApplicationArn: getServiceConfig().IOS_SNS_PLATFORM_APPLICATION_ARN,
                            Token: iosToken,
                            CustomUserData: String(user._id),
                        })
                        .promise();
                    response.locals.user = await userModel
                        .findByIdAndUpdate(
                            user._id,
                            {
                                $set: {
                                    pushNotification: { ...pushNotification, iosEndpointArn: EndpointArn, iosToken },
                                },
                            },
                            { new: true },
                        )
                        .lean();
                } catch (err) {
                    throw new CustomError(ErrorType.CreateIosPlatformEndpointFailure);
                }
            }
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIosPlatformEndpointMiddleware, err));
    }
};

export const createIosPlatformEndpointMiddleware = getCreateIosPlatformEndpointMiddleware({ sns: SNS, userModel });

export const getPatchCurrentUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const keysToUpdate = {
            ...request.body,
            pushNotification: user.pushNotification,
            username: request.body.username ? request.body.username.toLowerCase() : user && user.username,
        };
        const updatedUser = await userModel.findByIdAndUpdate(user._id, { ...keysToUpdate }, { new: true }).lean();
        if (!updatedUser) {
            throw new CustomError(ErrorType.UpdateCurrentUserNotFound);
        }
        response.locals.user = updatedUser;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchCurrentUserMiddleware, err));
    }
};

export const patchCurrentUserMiddleware = getPatchCurrentUserMiddleware(userModel);

export const getPopulateCurrentUserFollowingMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const updatedUser: User = response.locals.user;
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
        const updatedUser: User = response.locals.user;
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
                return achievementModel.findById(achievement._id).lean();
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
        const user: User = response.locals.user;
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
    removeOldAndroidEndpointArnWhenPushNotificationIsUpdatedMiddleware,
    removeOldIosEndpointArnWhenPushNotificationIsUpdatedMiddleware,
    createAndroidPlatformEndpointMiddleware,
    createIosPlatformEndpointMiddleware,
    patchCurrentUserMiddleware,
    populateCurrentUserFollowingMiddleware,
    populateCurrentUserFollowersMiddleware,
    populateCurrentUserAchievementsMiddleware,
    formatUserMiddleware,
    sendUpdatedCurrentUserMiddleware,
];
