import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { CustomSoloStreakReminder, CustomStreakReminder } from '@streakoid/streakoid-models/lib/Models/StreakReminders';
import { userModel, UserModel } from '../../../src/Models/User';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import StreakReminderTypes from '@streakoid/streakoid-models/lib/Types/StreakReminderTypes';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

const soloStreakParamsValidationSchema = {
    soloStreakId: Joi.string().required(),
};

export const soloStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        soloStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const soloStreakBodyValidationSchema = {
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

export const soloStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        soloStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchSoloStreakMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { soloStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedSoloStreak = await soloStreakModel.findByIdAndUpdate(
            soloStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedSoloStreak) {
            throw new CustomError(ErrorType.UpdatedSoloStreakNotFound);
        }
        response.locals.updatedSoloStreak = updatedSoloStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchSoloStreakMiddleware, err));
    }
};

export const patchSoloStreakMiddleware = getPatchSoloStreakMiddleware(soloStreakModel);

export const sendUpdatedSoloStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { updatedSoloStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedSoloStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedSoloStreakMiddleware, err));
    }
};

export const getDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const user: User = response.locals.user;
            await userModel.findByIdAndUpdate(user._id, { $inc: { totalLiveStreaks: -1 } });
        }
        next();
    } catch (err) {
        next(
            new CustomError(
                ErrorType.PatchSoloStreakDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
                err,
            ),
        );
    }
};

export const decreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware = getDecreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware(
    userModel,
);

export const getIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.live) {
            const user: User = response.locals.user;
            await userModel.findByIdAndUpdate(user._id, { $inc: { totalLiveStreaks: 1 } });
        }
        next();
    } catch (err) {
        next(
            new CustomError(
                ErrorType.PatchSoloStreakIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
                err,
            ),
        );
    }
};

export const increaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware = getIncreaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware(
    userModel,
);

export const getDisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const updatedSoloStreak: SoloStreak = response.locals.updatedSoloStreak;
            const user: User = response.locals.user;
            const customSoloStreakReminder = user.pushNotifications.customStreakReminders.find(
                reminder =>
                    reminder.streakReminderType === StreakReminderTypes.customSoloStreakReminder &&
                    reminder.soloStreakId == updatedSoloStreak._id,
            );
            if (
                customSoloStreakReminder &&
                customSoloStreakReminder.streakReminderType == StreakReminderTypes.customSoloStreakReminder
            ) {
                const updatedCustomSoloStreakReminder: CustomSoloStreakReminder = {
                    ...customSoloStreakReminder,
                    enabled: false,
                };
                const customStreakRemindersWithoutOldReminder = user.pushNotifications.customStreakReminders.filter(
                    pushNotification =>
                        !(
                            pushNotification.streakReminderType === StreakReminderTypes.customSoloStreakReminder &&
                            pushNotification.soloStreakId == updatedSoloStreak._id
                        ),
                );

                const newCustomStreakReminders: CustomStreakReminder[] = [
                    ...customStreakRemindersWithoutOldReminder,
                    updatedCustomSoloStreakReminder,
                ];
                await userModel.findByIdAndUpdate(user._id, {
                    $set: { 'pushNotifications.customStreakReminders': newCustomStreakReminders },
                });
            }
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware, err));
    }
};

export const disableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware = getDisableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware(
    userModel,
);

export const getCreateArchivedSoloStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const user: User = response.locals.user;
            const updatedSoloStreak: SoloStreak = response.locals.updatedSoloStreak;
            const archivedSoloStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.archivedSoloStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                soloStreakId: updatedSoloStreak._id,
                soloStreakName: updatedSoloStreak.streakName,
            };
            await createActivityFeedItemFunction(archivedSoloStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateArchivedSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createArchivedSoloStreakActivityFeedItemMiddleware = getCreateArchivedSoloStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateRestoredSoloStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.live) {
            const user: User = response.locals.user;
            const updatedSoloStreak: SoloStreak = response.locals.updatedSoloStreak;
            const archivedSoloStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.restoredSoloStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                soloStreakId: updatedSoloStreak._id,
                soloStreakName: updatedSoloStreak.streakName,
            };
            await createActivityFeedItemFunction(archivedSoloStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRestoredSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createRestoredSoloStreakActivityFeedItemMiddleware = getCreateRestoredSoloStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateDeletedSoloStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.deleted) {
            const user: User = response.locals.user;
            const updatedSoloStreak: SoloStreak = response.locals.updatedSoloStreak;
            const archivedSoloStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.deletedSoloStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                soloStreakId: updatedSoloStreak._id,
                soloStreakName: updatedSoloStreak.streakName,
            };
            await createActivityFeedItemFunction(archivedSoloStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateDeletedSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createDeletedSoloStreakActivityFeedItemMiddleware = getCreateDeletedSoloStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateEditedSoloStreakNameActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakName } = request.body;
        if (streakName) {
            const user: User = response.locals.user;
            const updatedSoloStreak: SoloStreak = response.locals.updatedSoloStreak;
            const archivedSoloStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.editedSoloStreakName,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                soloStreakId: updatedSoloStreak._id,
                soloStreakName: updatedSoloStreak.streakName,
            };
            await createActivityFeedItemFunction(archivedSoloStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEditedSoloStreakNameActivityFeedItemMiddleware, err));
    }
};

export const createEditedSoloStreakNameActivityFeedItemMiddleware = getCreateEditedSoloStreakNameActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateEditedSoloStreakDescriptionActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakDescription } = request.body;
        if (streakDescription) {
            const user: User = response.locals.user;
            const updatedSoloStreak: SoloStreak = response.locals.updatedSoloStreak;
            const archivedSoloStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.editedSoloStreakDescription,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                soloStreakId: updatedSoloStreak._id,
                soloStreakName: updatedSoloStreak.streakName,
                soloStreakDescription: streakDescription,
            };
            await createActivityFeedItemFunction(archivedSoloStreakActivityFeedItem);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEditedSoloStreakDescriptionActivityFeedItemMiddleware, err));
    }
};

export const createEditedSoloStreakDescriptionActivityFeedItemMiddleware = getCreateEditedSoloStreakDescriptionActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const patchSoloStreakMiddlewares = [
    soloStreakParamsValidationMiddleware,
    soloStreakRequestBodyValidationMiddleware,
    patchSoloStreakMiddleware,
    sendUpdatedSoloStreakMiddleware,
    decreaseUsersTotalLiveStreaksByOneWhenStreakIsArchivedMiddleware,
    increaseUsersTotalLiveStreaksByOneWhenStreakIsRestoredMiddleware,
    disableSoloStreakReminderWhenSoloStreakIsArchivedMiddleware,
    createArchivedSoloStreakActivityFeedItemMiddleware,
    createRestoredSoloStreakActivityFeedItemMiddleware,
    createDeletedSoloStreakActivityFeedItemMiddleware,
    createEditedSoloStreakNameActivityFeedItemMiddleware,
    createEditedSoloStreakDescriptionActivityFeedItemMiddleware,
];
