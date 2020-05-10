import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { UserModel, userModel } from '../../../src/Models/User';
import { CustomTeamStreakReminder, CustomStreakReminder } from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

const teamStreakParamsValidationSchema = {
    teamStreakId: Joi.string().required(),
};

export const teamStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        teamStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const teamStreakBodyValidationSchema = {
    creatorId: Joi.string(),
    streakName: Joi.string(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number(),
    timezone: Joi.string(),
    currentStreak: Joi.object(),
    pastStreaks: Joi.array(),
    status: Joi.string().valid(Object.keys(StreakStatus)),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
};

export const teamStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        teamStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedTeamStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedTeamStreak) {
            throw new CustomError(ErrorType.UpdatedTeamStreakNotFound);
        }
        response.locals.updatedTeamStreak = updatedTeamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchTeamStreakMiddleware, err));
    }
};

export const patchTeamStreakMiddleware = getPatchTeamStreakMiddleware(teamStreakModel);

export const sendUpdatedTeamStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { updatedTeamStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedTeamStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedTeamStreakMiddleware, err));
    }
};

export const getDecreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const updatedTeamStreak: TeamStreak = response.locals.updatedTeamStreak;
            await Promise.all(
                updatedTeamStreak.members.map(member => {
                    return userModel.findByIdAndUpdate(member.memberId, { $inc: { totalLiveStreaks: -1 } });
                }),
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.DecreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware, err));
    }
};

export const decreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware = getDecreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware(
    userModel,
);

export const getIncreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.live) {
            const updatedTeamStreak: TeamStreak = response.locals.updatedTeamStreak;
            await Promise.all(
                updatedTeamStreak.members.map(member => {
                    return userModel.findByIdAndUpdate(member.memberId, { $inc: { totalLiveStreaks: 1 } });
                }),
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware, err));
    }
};

export const increaseTeamMembersLiveStreaksByOneWhenStreakIsRestoredMiddleware = getIncreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware(
    userModel,
);

export const getDisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedTeamStreak: TeamStreak = response.locals.updatedTeamStreak;
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            await Promise.all(
                updatedTeamStreak.members.map(async member => {
                    const user: User | null = await userModel.findById(member.memberId);
                    if (user) {
                        const customTeamStreakReminder = user.pushNotifications.customStreakReminders.find(
                            reminder =>
                                reminder.streakReminderType === StreakReminderTypes.customTeamStreakReminder &&
                                reminder.teamStreakId == updatedTeamStreak._id,
                        );
                        if (
                            customTeamStreakReminder &&
                            customTeamStreakReminder.streakReminderType == StreakReminderTypes.customTeamStreakReminder
                        ) {
                            const updatedCustomTeamStreakReminder: CustomTeamStreakReminder = {
                                ...customTeamStreakReminder,
                                enabled: false,
                            };
                            const customStreakRemindersWithoutOldReminder = user.pushNotifications.customStreakReminders.filter(
                                pushNotification =>
                                    !(
                                        pushNotification.streakReminderType ===
                                            StreakReminderTypes.customTeamStreakReminder &&
                                        pushNotification.teamStreakId == updatedTeamStreak._id
                                    ),
                            );

                            const newCustomStreakReminders: CustomStreakReminder[] = [
                                ...customStreakRemindersWithoutOldReminder,
                                updatedCustomTeamStreakReminder,
                            ];
                            await userModel.findByIdAndUpdate(user._id, {
                                $set: { 'pushNotifications.customStreakReminders': newCustomStreakReminders },
                            });
                        }
                    }
                    return member;
                }),
            );
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware, err));
    }
};

export const disableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware = getDisableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware(
    userModel,
);

export const getCreateArchivedTeamStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const user: User = response.locals.user;
            const teamStreak: TeamStreakModel = response.locals.updatedTeamStreak;
            const archivedTeamStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.archivedTeamStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
            };
            await createActivityFeedItemFunction(archivedTeamStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateArchivedTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createArchivedTeamStreakActivityFeedItemMiddleware = getCreateArchivedTeamStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateRestoredTeamStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.live) {
            const user: User = response.locals.user;
            const teamStreak: TeamStreakModel = response.locals.updatedTeamStreak;
            const restoredTeamStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.restoredTeamStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
            };
            await createActivityFeedItemFunction(restoredTeamStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRestoredTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createRestoredTeamStreakActivityFeedItemMiddleware = getCreateRestoredTeamStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateDeletedTeamStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.deleted) {
            const user: User = response.locals.user;
            const teamStreak: TeamStreakModel = response.locals.updatedTeamStreak;
            const restoredTeamStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.deletedTeamStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
            };
            await createActivityFeedItemFunction(restoredTeamStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateDeletedTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createDeletedTeamStreakActivityFeedItemMiddleware = getCreateDeletedTeamStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateEditedTeamStreakNameActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakName } = request.body;
        if (streakName) {
            const user: User = response.locals.user;
            const teamStreak: TeamStreakModel = response.locals.updatedTeamStreak;
            const restoredTeamStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.editedTeamStreakName,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
            };
            await createActivityFeedItemFunction(restoredTeamStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEditedTeamStreakNameActivityFeedItemMiddleware, err));
    }
};

export const createEditedTeamStreakNameActivityFeedItemMiddleware = getCreateEditedTeamStreakNameActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateEditedTeamStreakDescriptionActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakDescription } = request.body;
        if (streakDescription) {
            const user: User = response.locals.user;
            const teamStreak: TeamStreakModel = response.locals.updatedTeamStreak;
            const restoredTeamStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.editedTeamStreakDescription,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                teamStreakDescription: streakDescription,
            };
            await createActivityFeedItemFunction(restoredTeamStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEditedTeamStreakDescriptionActivityFeedItemMiddleware, err));
    }
};

export const createEditedTeamStreakDescriptionActivityFeedItemMiddleware = getCreateEditedTeamStreakDescriptionActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const patchTeamStreakMiddlewares = [
    teamStreakParamsValidationMiddleware,
    teamStreakRequestBodyValidationMiddleware,
    patchTeamStreakMiddleware,
    sendUpdatedTeamStreakMiddleware,
    decreaseTeamMembersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
    increaseTeamMembersLiveStreaksByOneWhenStreakIsRestoredMiddleware,
    disableTeamMembersRemindersWhenTeamStreakIsArchivedMiddleware,
    createArchivedTeamStreakActivityFeedItemMiddleware,
    createRestoredTeamStreakActivityFeedItemMiddleware,
    createDeletedTeamStreakActivityFeedItemMiddleware,
    createEditedTeamStreakNameActivityFeedItemMiddleware,
    createEditedTeamStreakDescriptionActivityFeedItemMiddleware,
];
