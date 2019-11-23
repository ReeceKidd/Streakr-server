import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { ChallengeStreak } from '@streakoid/streakoid-sdk/lib';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import {
    completeChallengeStreakTaskModel,
    CompleteChallengeStreakTaskModel,
} from '../../Models/CompleteChallengeStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';

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
        await challengeStreakModel.updateOne(
            { _id: challengeStreakId },
            {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
            },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskStreakMaintainedMiddleware, err));
    }
};

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(challengeStreakModel);

export const getSendTaskCompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeChallengeStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(completeChallengeStreakTask);
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteChallengeStreakTaskSendTaskCompleteResponseMiddleware, err));
    }
};

export const sendTaskCompleteResponseMiddleware = getSendTaskCompleteResponseMiddleware(ResponseCodes.created);

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
    sendTaskCompleteResponseMiddleware,
];
