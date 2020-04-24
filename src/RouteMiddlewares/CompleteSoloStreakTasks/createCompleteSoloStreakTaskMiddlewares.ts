import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import {
    SoloStreak,
    User,
    ActivityFeedItemTypes,
    ActivityFeedItemType,
    AchievementTypes,
    PushNotificationTypes,
} from '@streakoid/streakoid-models/lib';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { completeSoloStreakTaskModel, CompleteSoloStreakTaskModel } from '../../Models/CompleteSoloStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { AchievementModel, achievementModel } from '../../../src/Models/Achievement';
import { UnlockedAchievementPushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import { OneHundredDaySoloStreakDatabaseAchievement } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';
import { UserAchievement } from '@streakoid/streakoid-models/lib/Models/UserAchievement';

export const completeSoloStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    soloStreakId: Joi.string().required(),
};

export const completeSoloStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        completeSoloStreakTaskBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSoloStreakExistsMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { soloStreakId } = request.body;
        const soloStreak = await soloStreakModel.findOne({ _id: soloStreakId });
        if (!soloStreak) {
            throw new CustomError(ErrorType.SoloStreakDoesNotExist);
        }
        response.locals.soloStreak = soloStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.SoloStreakExistsMiddleware, err));
    }
};

export const soloStreakExistsMiddleware = getSoloStreakExistsMiddleware(soloStreakModel);

export const ensureSoloStreakTaskHasNotBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const soloStreak: SoloStreak = response.locals.soloStreak;
        if (soloStreak.completedToday) {
            throw new CustomError(ErrorType.SoloStreakHasBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureSoloStreakTaskHasNotBeenCompletedTodayMiddleware, err));
    }
};

export const getRetrieveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.UserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveUserMiddleware, err));
    }
};

export const retrieveUserMiddleware = getRetrieveUserMiddleware(userModel);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSetTaskCompleteTimeMiddleware = (moment: any) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const timezone = response.locals.timezone;
        const taskCompleteTime = moment().tz(timezone);
        response.locals.taskCompleteTime = taskCompleteTime;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetTaskCompleteTimeMiddleware, err));
    }
};

export const setTaskCompleteTimeMiddleware = getSetTaskCompleteTimeMiddleware(moment);

export const getSetStreakStartDateMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const soloStreak: SoloStreak = response.locals.soloStreak;
        const taskCompleteTime = response.locals.taskCompleteTime;
        if (!soloStreak.currentStreak.startDate) {
            response.locals.soloStreak = await soloStreakModel.findByIdAndUpdate(soloStreak._id, {
                $set: {
                    currentStreak: {
                        startDate: taskCompleteTime,
                        numberOfDaysInARow: soloStreak.currentStreak.numberOfDaysInARow,
                    },
                },
            });
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetStreakStartDateMiddleware, err));
    }
};

export const setStreakStartDateMiddleware = getSetStreakStartDateMiddleware(soloStreakModel);

export const getSetDayTaskWasCompletedMiddleware = (dayFormat: string) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { taskCompleteTime } = response.locals;
        const taskCompleteDay = taskCompleteTime.format(dayFormat);
        response.locals.taskCompleteDay = taskCompleteDay;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetDayTaskWasCompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasCompletedMiddleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

export const createCompleteSoloStreakTaskDefinitionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { userId, soloStreakId } = request.body;
        const { taskCompleteTime, taskCompleteDay } = response.locals;
        const completeSoloStreakTaskDefinition = {
            userId,
            streakId: soloStreakId,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
        };
        response.locals.completeSoloStreakTaskDefinition = completeSoloStreakTaskDefinition;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteSoloStreakTaskDefinitionMiddleware, err));
    }
};

export const getSaveTaskCompleteMiddleware = (
    completeSoloStreakTaskModel: mongoose.Model<CompleteSoloStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { completeSoloStreakTaskDefinition } = response.locals;
        const completeSoloStreakTask = await new completeSoloStreakTaskModel(completeSoloStreakTaskDefinition).save();
        response.locals.completeSoloStreakTask = completeSoloStreakTask;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveTaskCompleteMiddleware, err));
    }
};

export const saveTaskCompleteMiddleware = getSaveTaskCompleteMiddleware(completeSoloStreakTaskModel);

export const getStreakMaintainedMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { soloStreakId } = request.body;
        response.locals.soloStreak = await soloStreakModel.findByIdAndUpdate(
            soloStreakId,
            {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.StreakMaintainedMiddleware, err));
    }
};

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(soloStreakModel);

export const getUnlockOneHundredDaySoloStreakAchievementForUserMiddleware = (
    user: mongoose.Model<UserModel>,
    achievement: mongoose.Model<AchievementModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const soloStreak: SoloStreak = response.locals.soloStreak;
        const currentUser: User = response.locals.user;
        const currentUserHas100DaySoloStreakAchievement = currentUser.achievements.find(
            achievementObject => achievementObject.achievementType === AchievementTypes.oneHundredDaySoloStreak,
        );
        const oneHundredDays = 100;
        if (
            soloStreak.currentStreak.numberOfDaysInARow === oneHundredDays &&
            !currentUserHas100DaySoloStreakAchievement
        ) {
            const oneHundredDaySoloStreakAchievement = await achievement.findOne({
                achievementType: AchievementTypes.oneHundredDaySoloStreak,
            });
            if (!oneHundredDaySoloStreakAchievement) {
                throw new CustomError(ErrorType.OneHundredDaySoloStreakAchievementDoesNotExist);
            }
            const oneHundredDaySoloStreakUserAchievement: UserAchievement = {
                _id: oneHundredDaySoloStreakAchievement._id,
                achievementType: AchievementTypes.oneHundredDaySoloStreak,
            };
            await user.findByIdAndUpdate(currentUser._id, {
                $addToSet: { achievements: oneHundredDaySoloStreakUserAchievement },
            });
            response.locals.oneHundredDaySoloStreakAchievement = oneHundredDaySoloStreakAchievement;
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.UnlockOneHundredDaySoloStreakAchievementForUserMiddleware, err));
    }
};

export const unlockOneHundredDaySoloStreakAchievementForUserMiddleware = getUnlockOneHundredDaySoloStreakAchievementForUserMiddleware(
    userModel,
    achievementModel,
);

export const getSendTaskCompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeSoloStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(completeSoloStreakTask);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendTaskCompleteResponseMiddleware, err));
    }
};

export const sendTaskCompleteResponseMiddleware = getSendTaskCompleteResponseMiddleware(ResponseCodes.created);

export const getCreateCompleteSoloStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const soloStreak: SoloStreak = response.locals.soloStreak;
        const completedSoloStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.completedSoloStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            soloStreakId: soloStreak._id,
            soloStreakName: soloStreak.streakName,
        };
        await createActivityFeedItemFunction(completedSoloStreakActivityFeedItem);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createCompleteSoloStreakActivityFeedItemMiddleware = getCreateCompleteSoloStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

const expoClient = new Expo();

export const getSendOneHundredDaySoloStreakAchievementUnlockedPushNotificationMiddleware = (
    expo: typeof expoClient,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const oneHundredDaySoloStreakAchievement: OneHundredDaySoloStreakDatabaseAchievement =
            response.locals.oneHundredDaySoloStreakAchievement;
        if (
            oneHundredDaySoloStreakAchievement &&
            user.pushNotificationToken &&
            user.pushNotifications.achievementUpdates.enabled
        ) {
            const messages: ExpoPushMessage[] = [];
            const title = `Unlocked ${oneHundredDaySoloStreakAchievement.name}`;
            const body = `You unlocked an achievement for: ${oneHundredDaySoloStreakAchievement.description}`;
            const data: UnlockedAchievementPushNotification = {
                pushNotificationType: PushNotificationTypes.unlockedAchievement,
                achievementId: oneHundredDaySoloStreakAchievement._id,
                title,
                body,
            };
            messages.push({
                to: user.pushNotificationToken,
                sound: 'default',
                title,
                body,
                data,
            });
            const chunks = await expo.chunkPushNotifications(messages);
            for (const chunk of chunks) {
                await expo.sendPushNotificationsAsync(chunk);
            }
        }
    } catch (err) {
        next(new CustomError(ErrorType.SendOneHundredDaySoloStreakAchievementUnlockedPushNotificationMiddleware, err));
    }
};

export const sendOneHundredDaySoloStreakAchievementUnlockedPushNotificationMiddleware = getSendOneHundredDaySoloStreakAchievementUnlockedPushNotificationMiddleware(
    expoClient,
);

export const createCompleteSoloStreakTaskMiddlewares = [
    completeSoloStreakTaskBodyValidationMiddleware,
    soloStreakExistsMiddleware,
    ensureSoloStreakTaskHasNotBeenCompletedTodayMiddleware,
    retrieveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setStreakStartDateMiddleware,
    setDayTaskWasCompletedMiddleware,
    createCompleteSoloStreakTaskDefinitionMiddleware,
    saveTaskCompleteMiddleware,
    streakMaintainedMiddleware,
    unlockOneHundredDaySoloStreakAchievementForUserMiddleware,
    sendTaskCompleteResponseMiddleware,
    createCompleteSoloStreakActivityFeedItemMiddleware,
    sendOneHundredDaySoloStreakAchievementUnlockedPushNotificationMiddleware,
];
