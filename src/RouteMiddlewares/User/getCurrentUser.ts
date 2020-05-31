import { Request, Response, NextFunction } from 'express';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { Model } from 'mongoose';
import { userModel, UserModel } from '../../../src/Models/User';
import { AchievementModel, achievementModel } from '../../../src/Models/Achievement';
import { DatabaseAchievementType } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { BasicUser } from '@streakoid/streakoid-models/lib/Models/BasicUser';
import { getPopulatedCurrentUser } from '../../formatters/getPopulatedCurrentUser';

export const getPopulateCurrentUserFollowingMiddleware = (userModel: Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.PopulateCurrentUserFollowingMiddleware, err));
    }
};

export const populateCurrentUserFollowingMiddleware = getPopulateCurrentUserFollowingMiddleware(userModel);

export const getPopulateCurrentUserFollowersMiddleware = (userModel: Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.PopulateCurrentUserFollowersMiddleware, err));
    }
};

export const populateCurrentUserFollowersMiddleware = getPopulateCurrentUserFollowersMiddleware(userModel);

export const getPopulateCurrentUserAchievementsMiddleware = (achievementModel: Model<AchievementModel>) => async (
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
        else next(new CustomError(ErrorType.PopulateCurrentUserAchievementsMiddleware, err));
    }
};

export const populateCurrentUserAchievementsMiddleware = getPopulateCurrentUserAchievementsMiddleware(achievementModel);

export const getFormatUserMiddleware = (getPopulatedCurrentUserFunction: typeof getPopulatedCurrentUser) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const user: User = response.locals.user;
        const followers: BasicUser[] = response.locals.followers;
        const following: BasicUser[] = response.locals.following;
        const achievements: DatabaseAchievementType[] = response.locals.achievements;
        response.locals.formattedUser = getPopulatedCurrentUserFunction({ user, following, followers, achievements });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware, err));
    }
};

export const formatUserMiddleware = getFormatUserMiddleware(getPopulatedCurrentUser);

export const sendCurrentUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { formattedUser } = response.locals;
        response.status(ResponseCodes.success).send(formattedUser);
    } catch (err) {
        next(new CustomError(ErrorType.SendCurrentUserMiddleware, err));
    }
};

export const getCurrentUserMiddlewares = [
    populateCurrentUserFollowingMiddleware,
    populateCurrentUserFollowersMiddleware,
    populateCurrentUserAchievementsMiddleware,
    formatUserMiddleware,
    sendCurrentUserMiddleware,
];
