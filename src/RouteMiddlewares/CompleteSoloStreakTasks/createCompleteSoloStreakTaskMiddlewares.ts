import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { SoloStreak, User, ActivityFeedItemTypes, ActivityFeedItemType } from '@streakoid/streakoid-sdk/lib';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { completeSoloStreakTaskModel, CompleteSoloStreakTaskModel } from '../../Models/CompleteSoloStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';

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

export const getRetreiveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.RetreiveUserMiddleware, err));
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
            await soloStreakModel.updateOne(
                { _id: soloStreak._id },
                {
                    currentStreak: {
                        startDate: taskCompleteTime,
                        numberOfDaysInARow: soloStreak.currentStreak.numberOfDaysInARow,
                    },
                },
            );
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
        await soloStreakModel.updateOne(
            { _id: soloStreakId },
            {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
            },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.StreakMaintainedMiddleware, err));
    }
};

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(soloStreakModel);

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
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createCompleteSoloStreakActivityFeedItemMiddleware = getCreateCompleteSoloStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const createCompleteSoloStreakTaskMiddlewares = [
    completeSoloStreakTaskBodyValidationMiddleware,
    soloStreakExistsMiddleware,
    ensureSoloStreakTaskHasNotBeenCompletedTodayMiddleware,
    retreiveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setStreakStartDateMiddleware,
    setDayTaskWasCompletedMiddleware,
    createCompleteSoloStreakTaskDefinitionMiddleware,
    saveTaskCompleteMiddleware,
    streakMaintainedMiddleware,
    sendTaskCompleteResponseMiddleware,
    createCompleteSoloStreakActivityFeedItemMiddleware,
];
