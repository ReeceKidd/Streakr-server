import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { ChallengeStreak, User, ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import {
    completeChallengeStreakTaskModel,
    CompleteChallengeStreakTaskModel,
} from '../../Models/CompleteChallengeStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { ActivityFeedItemModel, activityFeedItemModel } from '../../../src/Models/ActivityFeedItem';

export const completeChallengeStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    challengeStreakId: Joi.string().required(),
};

export const completeChallengeStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        completeChallengeStreakTaskBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getChallengeStreakExistsMiddleware = (
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { challengeStreakId } = request.body;
        const challengeStreak = await challengeStreakModel.findOne({ _id: challengeStreakId });
        if (!challengeStreak) {
            throw new CustomError(ErrorType.ChallengeStreakDoesNotExist);
        }
        response.locals.challengeStreak = challengeStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ChallengeStreakExistsMiddleware, err));
    }
};

export const challengeStreakExistsMiddleware = getChallengeStreakExistsMiddleware(challengeStreakModel);

export const ensureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        if (challengeStreak.completedToday) {
            throw new CustomError(ErrorType.ChallengeStreakHasBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware, err));
    }
};

export const getRetreiveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.CreateCompleteChallengeStreakTaskUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

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
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSetTaskCompleteTimeMiddleware, err));
    }
};

export const setTaskCompleteTimeMiddleware = getSetTaskCompleteTimeMiddleware(moment);

export const getSetStreakStartDateMiddleware = (challengeStreakModel: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const taskCompleteTime = response.locals.taskCompleteTime;
        if (!challengeStreak.currentStreak.startDate) {
            await challengeStreakModel.updateOne(
                { _id: challengeStreak._id },
                {
                    currentStreak: {
                        startDate: taskCompleteTime,
                        numberOfDaysInARow: challengeStreak.currentStreak.numberOfDaysInARow,
                    },
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSetStreakStartDateMiddleware, err));
    }
};

export const setStreakStartDateMiddleware = getSetStreakStartDateMiddleware(challengeStreakModel);

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
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSetDayTaskWasCompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasCompletedMiddleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

export const getSaveTaskCompleteMiddleware = (
    completeChallengeStreakTaskModel: mongoose.Model<CompleteChallengeStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, challengeStreakId } = request.body;
        const { taskCompleteTime, taskCompleteDay } = response.locals;
        const completeChallengeStreakTask = new completeChallengeStreakTaskModel({
            userId,
            challengeStreakId,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
        });
        response.locals.completeChallengeStreakTask = await completeChallengeStreakTask.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSaveTaskCompleteMiddleware, err));
    }
};

export const saveTaskCompleteMiddleware = getSaveTaskCompleteMiddleware(completeChallengeStreakTaskModel);

export const getStreakMaintainedMiddleware = (challengeStreakModel: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { challengeStreakId } = request.body;
        const updatedChallengeStreak = await challengeStreakModel
            .findByIdAndUpdate(challengeStreakId, {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
            })
            .lean();
        response.locals.challengeStreak = updatedChallengeStreak;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskStreakMaintainedMiddleware, err));
    }
};

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(challengeStreakModel);

const expoClient = new Expo();

export const getSendNewChallengeBadgeNotificationMiddleware = (expo: typeof expoClient) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const user: User = response.locals.user;
        const { currentStreak } = challengeStreak;
        const { numberOfDaysInARow } = currentStreak;
        if (
            numberOfDaysInARow === 6 ||
            numberOfDaysInARow === 13 ||
            numberOfDaysInARow === 29 ||
            numberOfDaysInARow === 89 ||
            numberOfDaysInARow === 179 ||
            numberOfDaysInARow === 364
        ) {
            const { pushNotificationToken } = user;
            if (pushNotificationToken && user.notifications.badgeUpdates.pushNotification) {
                const messages: ExpoPushMessage[] = [];
                messages.push({
                    to: pushNotificationToken,
                    sound: 'default',
                    title: 'New badge',
                    body: `You have a new challenge badge on your profile`,
                });

                await expo.sendPushNotificationsAsync(messages);
            }
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendNewChallengeBadgeNotificationMiddleware, err));
    }
};

export const sendNewChallengeBadgeNotificationMiddleware = getSendNewChallengeBadgeNotificationMiddleware(expoClient);

export const getSendTaskCompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeChallengeStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(completeChallengeStreakTask);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSendTaskCompleteResponseMiddleware, err));
    }
};

export const sendTaskCompleteResponseMiddleware = getSendTaskCompleteResponseMiddleware(ResponseCodes.created);

export const getCreateCompleteChallengeStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const newActivity = new activityFeedItemModel({
            activityFeedItemType: ActivityFeedItemTypes.completedChallengeStreak,
            userId: user._id,
            subjectId: challengeStreak._id,
        });
        await newActivity.save();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createCompleteChallengeStreakActivityFeedItemMiddleware = getCreateCompleteChallengeStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const createCompleteChallengeStreakTaskMiddlewares = [
    completeChallengeStreakTaskBodyValidationMiddleware,
    challengeStreakExistsMiddleware,
    ensureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware,
    retreiveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setStreakStartDateMiddleware,
    setDayTaskWasCompletedMiddleware,
    saveTaskCompleteMiddleware,
    streakMaintainedMiddleware,
    sendNewChallengeBadgeNotificationMiddleware,
    sendTaskCompleteResponseMiddleware,
    createCompleteChallengeStreakActivityFeedItemMiddleware,
];
