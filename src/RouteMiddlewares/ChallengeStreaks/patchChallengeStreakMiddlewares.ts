import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import {
    ActivityFeedItemTypes,
    User,
    StreakStatus,
    ChallengeStreak,
    Challenge,
    ActivityFeedItemType,
    StreakReminderTypes,
} from '@streakoid/streakoid-sdk/lib';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { challengeModel, ChallengeModel } from '../../../src/Models/Challenge';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import {
    CustomChallengeStreakReminder,
    CustomStreakReminder,
} from '@streakoid/streakoid-sdk/lib/models/StreakReminders';
import { userModel, UserModel } from '../../../src/Models/User';

const challengeStreakParamsValidationSchema = {
    challengeStreakId: Joi.string().required(),
};

export const challengeStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        challengeStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const challengeStreakBodyValidationSchema = {
    streakName: Joi.string(),
    status: Joi.string(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number(),
    completedToday: Joi.boolean(),
    timezone: Joi.string(),
    active: Joi.boolean(),
    currentStreak: Joi.object(),
    pastStreaks: Joi.array(),
};

export const challengeStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        challengeStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchChallengeStreakMiddleware = (challengeStreakModel: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { challengeStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedChallengeStreak = await challengeStreakModel.findByIdAndUpdate(
            challengeStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedChallengeStreak) {
            throw new CustomError(ErrorType.UpdatedChallengeStreakNotFound);
        }
        response.locals.updatedChallengeStreak = updatedChallengeStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchChallengeStreakMiddleware, err));
    }
};

export const patchChallengeStreakMiddleware = getPatchChallengeStreakMiddleware(challengeStreakModel);

export const getRetreiveChallengeMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.updatedChallengeStreak;
        const challenge = await challengeModel.findOne({ _id: challengeStreak.challengeId }).lean();
        if (!challenge) {
            throw new CustomError(ErrorType.PatchChallengeStreakNoChallengeFound);
        }
        response.locals.challenge = challenge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchChallengeStreakRetreiveChallengeMiddleware, err));
    }
};

export const retreiveChallengeMiddleware = getRetreiveChallengeMiddleware(challengeModel);

export const getRemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware = (
    challengeModel: mongoose.Model<ChallengeModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedChallengeStreak: ChallengeStreak = response.locals.updatedChallengeStreak;
        const challenge: Challenge = response.locals.challenge;
        const { status } = request.body;
        if (status && status === StreakStatus.deleted) {
            const membersWithoutCurrentUser =
                challenge && challenge.members.filter(member => member !== updatedChallengeStreak.userId);
            response.locals.challenge = await challengeModel.findByIdAndUpdate(
                updatedChallengeStreak.challengeId,
                { members: membersWithoutCurrentUser },
                { new: true },
            );
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.RemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware, err));
    }
};

export const removeUserFromChallengeIfChallengeStreakIsDeletedMiddleware = getRemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware(
    challengeModel,
);

export const getDecreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware = (
    challengeModel: mongoose.Model<ChallengeModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedChallengeStreak: ChallengeStreak = response.locals.updatedChallengeStreak;
        const { status } = request.body;
        const { challenge } = response.locals;
        if (status && status === StreakStatus.deleted) {
            await challengeModel.findByIdAndUpdate(
                updatedChallengeStreak.challengeId,
                { $set: { numberOfMembers: challenge.members.length } },
                { new: true },
            );
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.DescreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware, err));
    }
};

export const decreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware = getDecreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware(
    challengeModel,
);

export const sendUpdatedChallengeStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { updatedChallengeStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedChallengeStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedChallengeStreakMiddleware, err));
    }
};

export const getDisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const updatedChallengeStreak: ChallengeStreak = response.locals.updatedChallengeStreak;
            const user: User = response.locals.user;
            const customChallengeStreakReminder = user.pushNotifications.customStreakReminders.find(
                reminder =>
                    reminder.streakReminderType === StreakReminderTypes.customChallengeStreakReminder &&
                    reminder.challengeStreakId == updatedChallengeStreak._id,
            );
            if (
                customChallengeStreakReminder &&
                customChallengeStreakReminder.streakReminderType === StreakReminderTypes.customChallengeStreakReminder
            ) {
                const updatedCustomChallengeStreakReminder: CustomChallengeStreakReminder = {
                    ...customChallengeStreakReminder,
                    enabled: false,
                };
                const customStreakRemindersWithoutOldReminder = user.pushNotifications.customStreakReminders.filter(
                    pushNotificaion =>
                        !(
                            pushNotificaion.streakReminderType === StreakReminderTypes.customChallengeStreakReminder &&
                            pushNotificaion.challengeStreakId == updatedChallengeStreak._id
                        ),
                );

                const newCustomStreakReminders: CustomStreakReminder[] = [
                    ...customStreakRemindersWithoutOldReminder,
                    updatedCustomChallengeStreakReminder,
                ];
                await userModel.findByIdAndUpdate(user._id, {
                    $set: { 'pushNotifications.customStreakReminders': newCustomStreakReminders },
                });
            }
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else
            next(new CustomError(ErrorType.DisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware, err));
    }
};

export const disableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware = getDisableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware(
    userModel,
);

export const getCreateArchivedChallengeStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status && status === StreakStatus.archived) {
            const user: User = response.locals.user;
            const challenge: Challenge = response.locals.challenge;
            const updatedChallengeStreak: ChallengeStreak = response.locals.updatedChallengeStreak;
            const archivedChallengeStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.archivedChallengeStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                challengeStreakId: updatedChallengeStreak._id,
                challengeId: challenge._id,
                challengeName: challenge.name,
            };
            await createActivityFeedItemFunction(archivedChallengeStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateArchivedChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createArchivedChallengeStreakActivityFeedItemMiddleware = getCreateArchivedChallengeStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateRestoredChallengeStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status && status === StreakStatus.live) {
            const user: User = response.locals.user;
            const challenge: Challenge = response.locals.challenge;
            const updatedChallengeStreak: ChallengeStreak = response.locals.updatedChallengeStreak;
            const archivedChallengeStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.restoredChallengeStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                challengeStreakId: updatedChallengeStreak._id,
                challengeId: challenge._id,
                challengeName: challenge.name,
            };
            await createActivityFeedItemFunction(archivedChallengeStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRestoredChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createRestoredChallengeStreakActivityFeedItemMiddleware = getCreateRestoredChallengeStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateDeletedChallengeStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status && status === StreakStatus.deleted) {
            const user: User = response.locals.user;
            const challenge: Challenge = response.locals.challenge;
            const updatedChallengeStreak: ChallengeStreak = response.locals.updatedChallengeStreak;
            const archivedChallengeStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.deletedChallengeStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                challengeStreakId: updatedChallengeStreak._id,
                challengeId: challenge._id,
                challengeName: challenge.name,
            };
            await createActivityFeedItemFunction(archivedChallengeStreakActivityFeedItem);
        }
    } catch (err) {
        next(new CustomError(ErrorType.CreateDeletedChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createDeletedChallengeStreakActivityFeedItemMiddleware = getCreateDeletedChallengeStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const patchChallengeStreakMiddlewares = [
    challengeStreakParamsValidationMiddleware,
    challengeStreakRequestBodyValidationMiddleware,
    patchChallengeStreakMiddleware,
    retreiveChallengeMiddleware,
    removeUserFromChallengeIfChallengeStreakIsDeletedMiddleware,
    decreaseNumberOfChallengeMembersWhenChallengeStreakIsDeletedMiddleware,
    sendUpdatedChallengeStreakMiddleware,
    disableChallengeStreakReminderWhenChallengeStreakIsArchivedMiddleware,
    createArchivedChallengeStreakActivityFeedItemMiddleware,
    createRestoredChallengeStreakActivityFeedItemMiddleware,
    createDeletedChallengeStreakActivityFeedItemMiddleware,
];
