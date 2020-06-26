import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';
import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../../Models/User';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import { createActivityFeedItem } from '../../../../src/helpers/createActivityFeedItem';
import { NewFollowerPushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import { sendPushNotification } from '../../../helpers/sendPushNotification';
import { EndpointDisabledError } from '../../../sns';

const followUserParamsValidationSchema = {
    userId: Joi.string()
        .required()
        .length(24),
};

export const followUserParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        followUserParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const followUserBodyValidationSchema = {
    userToFollowId: Joi.string()
        .required()
        .length(24),
};

export const followUserBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        followUserBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveSelectedUserMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.params;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.SelectedUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveSelectedUserMiddleware, err));
    }
};

export const retrieveSelectedUserMiddleware = getRetrieveSelectedUserMiddleware(userModel);

export const isSelectedUserAlreadyFollowingUserMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const user: UserModel = response.locals.user;
        const userToFollowId: string = request.body.userToFollowId;

        const selectedUserIsAlreadyFollowing = user.following.find(userId => userId == userToFollowId);
        if (selectedUserIsAlreadyFollowing) {
            throw new CustomError(ErrorType.SelectedUserIsAlreadyFollowingUser);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.IsSelectedUserIsAlreadFollowingUserMiddleware, err));
    }
};

export const getRetrieveUserToFollowMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userToFollowId } = request.body;
        const userToFollow: User = await userModel.findOne({ _id: userToFollowId }).lean();
        if (!userToFollow) {
            throw new CustomError(ErrorType.UserToFollowDoesNotExist);
        }
        response.locals.userToFollow = userToFollow;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveUserToFollowMiddleware, err));
    }
};

export const retrieveUserToFollowMiddleware = getRetrieveUserToFollowMiddleware(userModel);

export const getAddUserToFollowToSelectedUsersFollowingMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.params;
        const { userToFollowId } = request.body;
        const userWithUserToFollowInFollowing = await userModel.findByIdAndUpdate(
            userId,
            {
                $addToSet: { following: userToFollowId },
            },
            { new: true },
        );
        if (!userWithUserToFollowInFollowing) {
            throw new CustomError(ErrorType.NoUserToFollowFound);
        }
        response.locals.following = userWithUserToFollowInFollowing.following;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.AddUserToFollowToSelectedUsersFollowing, err));
    }
};

export const addUserToFollowToSelectedUsersFollowingMiddleware = getAddUserToFollowToSelectedUsersFollowingMiddleware(
    userModel,
);

export const getAddSelectedUserToUserToFollowFollowersMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.params;
        const { userToFollowId } = request.body;
        await userModel.findByIdAndUpdate(
            userToFollowId,
            {
                $addToSet: { followers: userId },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.AddSelectedUserToUserToFollowFollowersMiddleware, err));
    }
};

export const addSelectedUserToUserToFollowsFollowersMiddleware = getAddSelectedUserToUserToFollowFollowersMiddleware(
    userModel,
);

export const sendUserWithNewFollowingMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { following } = response.locals;
        response.status(ResponseCodes.created).send(following);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendUserWithNewFollowingMiddleware, err));
    }
};

export const getCreateFollowUserActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const userToFollow: User = response.locals.userToFollow;
        const followedUserActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.followedUser,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            userFollowedId: userToFollow && userToFollow._id,
            userFollowedUsername: userToFollow && userToFollow.username,
        };
        await createActivityFeedItemFunction(followedUserActivityFeedItem);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateFollowUserActivityFeedItemMiddleware, err));
    }
};

export const createFollowUserActivityFeedItemMiddleware = getCreateFollowUserActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getSendNewFollowerRequestNotificationMiddleware = (sendPush: typeof sendPushNotification) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const userToFollow: User = response.locals.userToFollow;
        const title = 'New follower';
        const body = `${user && user.username} is following you.`;
        const data: NewFollowerPushNotification = {
            pushNotificationType: PushNotificationTypes.newFollower,
            followerId: user._id,
            followerUsername: user.username,
            title,
            body,
        };
        const { pushNotification, pushNotifications } = userToFollow;
        const androidEndpointArn = pushNotification.androidEndpointArn;
        const iosEndpointArn = pushNotification.iosEndpointArn;
        const newFollowerUpdatesEnabled =
            pushNotifications && pushNotifications.newFollowerUpdates && pushNotifications.newFollowerUpdates;
        if ((androidEndpointArn || iosEndpointArn) && newFollowerUpdatesEnabled.enabled) {
            try {
                await sendPush({
                    title,
                    body,
                    data,
                    androidEndpointArn,
                    iosEndpointArn,
                    userId: user._id,
                });
            } catch (err) {
                if (err.code !== EndpointDisabledError) {
                    throw err;
                }
            }
        }
    } catch (err) {
        next(new CustomError(ErrorType.SendNewFollowerRequestNotificationMiddleware, err));
    }
};

export const sendNewFollowerRequestNotificationMiddleware = getSendNewFollowerRequestNotificationMiddleware(
    sendPushNotification,
);

export const followUserMiddlewares = [
    followUserParamsValidationMiddleware,
    followUserBodyValidationMiddleware,
    retrieveSelectedUserMiddleware,
    isSelectedUserAlreadyFollowingUserMiddleware,
    retrieveUserToFollowMiddleware,
    addUserToFollowToSelectedUsersFollowingMiddleware,
    addSelectedUserToUserToFollowsFollowersMiddleware,
    sendUserWithNewFollowingMiddleware,
    createFollowUserActivityFeedItemMiddleware,
    sendNewFollowerRequestNotificationMiddleware,
];
