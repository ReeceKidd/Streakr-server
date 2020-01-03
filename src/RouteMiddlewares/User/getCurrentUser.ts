import { Request, Response, NextFunction } from 'express';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User, PopulatedCurrentUser } from '@streakoid/streakoid-sdk/lib';
import { Model } from 'mongoose';
import { BadgeModel, badgeModel } from '../../Models/Badge';

export const getPopulateUserBadgesMiddleware = (badgeModel: Model<BadgeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const badges = await badgeModel.find({ _id: user.badges }).lean();
        response.locals.user.badges = badges;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PopulateUserBadgesMiddleware, err));
    }
};

export const populateUserBadgesMiddleware = getPopulateUserBadgesMiddleware(badgeModel);

export const formatUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user = response.locals.user;
        const formattedUser: PopulatedCurrentUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            membershipInformation: user.membershipInformation,
            userType: user.userType,
            badges: user.badges,
            timezone: user.timezone,
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
        next(new CustomError(ErrorType.GetCurrentUserFormatUserMiddleware, err));
    }
};

export const sendCurrentUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { formattedUser } = response.locals;
        response.status(ResponseCodes.success).send(formattedUser);
    } catch (err) {
        next(new CustomError(ErrorType.SendCurrentUserMiddleware, err));
    }
};

export const getCurrentUserMiddlewares = [
    populateUserBadgesMiddleware,
    formatUserMiddleware,
    sendCurrentUserMiddleware,
];
