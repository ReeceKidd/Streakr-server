import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import {
    completeChallengeStreakTaskModel,
    CompleteChallengeStreakTaskModel,
} from '../../Models/CompleteChallengeStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { ChallengeModel, challengeModel } from '../../../src/Models/Challenge';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { AchievementModel, achievementModel } from '../../Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { UserAchievement } from '@streakoid/streakoid-models/lib/Models/UserAchievement';

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

export const getRetrieveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskRetrieveUserMiddleware, err));
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

export const getIncreaseNumberOfDaysInARowForChallengeStreakMiddleware = (
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { challengeStreakId } = request.body;
        const updatedChallengeStreak = await challengeStreakModel
            .findByIdAndUpdate(
                challengeStreakId,
                {
                    completedToday: true,
                    $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                    active: true,
                },
                { new: true },
            )
            .lean();
        response.locals.challengeStreak = updatedChallengeStreak;
        next();
    } catch (err) {
        next(
            new CustomError(
                ErrorType.CreateCompleteChallengeStreakTaskIncreaseNumberOfDaysInARowForChallengeStreakMiddleware,
                err,
            ),
        );
    }
};

export const increaseNumberOfDaysInARowForChallengeStreakMiddleware = getIncreaseNumberOfDaysInARowForChallengeStreakMiddleware(
    challengeStreakModel,
);

export const getIncreaseTotalStreakCompletesForUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        response.locals.user = await userModel.findByIdAndUpdate(
            userId,
            {
                $inc: { totalStreakCompletes: 1 },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CompleteChallengeStreakTaskIncreaseTotalStreakCompletesForUserMiddleware, err));
    }
};

export const increaseTotalStreakCompletesForUserMiddleware = getIncreaseTotalStreakCompletesForUserMiddleware(
    userModel,
);

export const getUnlockOneHundredDayChallengeStreakAchievementForUserMiddleware = (
    user: mongoose.Model<UserModel>,
    achievement: mongoose.Model<AchievementModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const currentUser: User = response.locals.user;
        const currentUserHas100DayChallengeStreakAchievement = currentUser.achievements.find(
            achievementObject => achievementObject.achievementType === AchievementTypes.oneHundredDayChallengeStreak,
        );
        const oneHundredDays = 100;
        if (
            challengeStreak.currentStreak.numberOfDaysInARow === oneHundredDays &&
            !currentUserHas100DayChallengeStreakAchievement
        ) {
            const oneHundredDayChallengeStreakAchievement = await achievement.findOne({
                achievementType: AchievementTypes.oneHundredDayChallengeStreak,
            });
            if (!oneHundredDayChallengeStreakAchievement) {
                throw new CustomError(ErrorType.OneHundredDayChallengeStreakAchievementDoesNotExist);
            }
            const oneHundredDayChallengeStreakUserAchievement: UserAchievement = {
                _id: oneHundredDayChallengeStreakAchievement._id,
                achievementType: AchievementTypes.oneHundredDayChallengeStreak,
            };
            await user.findByIdAndUpdate(currentUser._id, {
                $addToSet: { achievements: oneHundredDayChallengeStreakUserAchievement },
            });
            response.locals.oneHundredDayChallengeStreakAchievement = oneHundredDayChallengeStreakAchievement;
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.UnlockOneHundredDayChallengeStreakAchievementForUserMiddleware, err));
    }
};

export const unlockOneHundredDayChallengeStreakAchievementForUserMiddleware = getUnlockOneHundredDayChallengeStreakAchievementForUserMiddleware(
    userModel,
    achievementModel,
);

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

export const getRetrieveChallengeMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const challenge = await challengeModel.findOne({ _id: challengeStreak.challengeId }).lean();
        if (!challenge) {
            throw new CustomError(ErrorType.CreateCompleteChallengeStreakTaskChallengeDoesNotExist);
        }
        response.locals.challenge = challenge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskRetrieveChallengeMiddleware, err));
    }
};

export const retrieveChallengeMiddleware = getRetrieveChallengeMiddleware(challengeModel);

export const getCreateCompleteChallengeStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const challenge: Challenge = response.locals.challenge;

        const completedChallengeStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.completedChallengeStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            challengeStreakId: challengeStreak._id,
            challengeId: challengeStreak.challengeId,
            challengeName: challenge && challenge.name,
        };
        createActivityFeedItemFunction(completedChallengeStreakActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createCompleteChallengeStreakActivityFeedItemMiddleware = getCreateCompleteChallengeStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const createCompleteChallengeStreakTaskMiddlewares = [
    completeChallengeStreakTaskBodyValidationMiddleware,
    challengeStreakExistsMiddleware,
    ensureChallengeStreakTaskHasNotBeenCompletedTodayMiddleware,
    retrieveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setStreakStartDateMiddleware,
    setDayTaskWasCompletedMiddleware,
    saveTaskCompleteMiddleware,
    increaseNumberOfDaysInARowForChallengeStreakMiddleware,
    increaseTotalStreakCompletesForUserMiddleware,
    unlockOneHundredDayChallengeStreakAchievementForUserMiddleware,
    sendTaskCompleteResponseMiddleware,
    retrieveChallengeMiddleware,
    createCompleteChallengeStreakActivityFeedItemMiddleware,
];
