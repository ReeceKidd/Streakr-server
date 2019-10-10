import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { groupMemberStreakModel, GroupMemberStreakModel } from '../../Models/GroupMemberStreak';
import {
    incompleteGroupMemberStreakTaskModel,
    IncompleteGroupMemberStreakTaskModel,
} from '../../Models/IncompleteGroupMemberStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { GroupMemberStreak, GroupStreakTypes } from '@streakoid/streakoid-sdk/lib';

export const incompleteGroupMemberStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    groupMemberStreakId: Joi.string().required(),
    groupStreakType: Joi.string()
        .valid(Object.keys(GroupStreakTypes))
        .required(),
    teamStreakId: Joi.string().required(),
};

export const incompleteGroupMemberStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        incompleteGroupMemberStreakTaskBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getGroupMemberStreakExistsMiddleware = (
    groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { groupMemberStreakId } = request.body;
        const groupMemberStreak = await groupMemberStreakModel.findOne({ _id: groupMemberStreakId });
        if (!groupMemberStreak) {
            throw new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskGroupMemberStreakDoesNotExist);
        }
        response.locals.groupMemberStreak = groupMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else
            next(
                new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskGroupMemberStreakExistsMiddleware, err),
            );
    }
};

export const groupMemberStreakExistsMiddleware = getGroupMemberStreakExistsMiddleware(groupMemberStreakModel);

export const ensureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const groupMemberStreak: GroupMemberStreak = response.locals.groupMemberStreak;
        if (!groupMemberStreak.completedToday) {
            throw new CustomError(ErrorType.GroupMemberStreakHasNotBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware, err));
    }
};

export const getResetStreakStartDateMiddleware = (
    groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const groupMemberStreak: GroupMemberStreak = response.locals.groupMemberStreak;
        if (groupMemberStreak.currentStreak.numberOfDaysInARow === 1) {
            response.locals.groupMemberStreak = await groupMemberStreakModel
                .findByIdAndUpdate(
                    groupMemberStreak._id,
                    {
                        currentStreak: {
                            startDate: null,
                            numberOfDaysInARow: 0,
                        },
                    },
                    { new: true },
                )
                .lean();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.ResetGroupMemberStreakStartDateMiddleware, err));
    }
};

export const resetStreakStartDateMiddleware = getResetStreakStartDateMiddleware(groupMemberStreakModel);

export const getRetreiveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSetTaskIncompleteTimeMiddleware = (moment: any) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const timezone = response.locals.timezone;
        const taskIncompleteTime = moment().tz(timezone);
        response.locals.taskIncompleteTime = taskIncompleteTime;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteGroupMemberStreakSetTaskIncompleteTimeMiddleware, err));
    }
};

export const setTaskIncompleteTimeMiddleware = getSetTaskIncompleteTimeMiddleware(moment);

export const getSetDayTaskWasIncompletedMiddleware = (dayFormat: string) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { taskIncompleteTime } = response.locals;
        const taskIncompleteDay = taskIncompleteTime.format(dayFormat);
        response.locals.taskIncompleteDay = taskIncompleteDay;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteGroupMemberStreakSetDayTaskWasIncompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasIncompletedMiddleware = getSetDayTaskWasIncompletedMiddleware(dayFormat);

export const createIncompleteGroupMemberStreakTaskDefinitionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { userId, groupMemberStreakId, groupStreakType, teamStreakId } = request.body;
        const { taskIncompleteTime, taskIncompleteDay } = response.locals;
        const incompleteGroupMemberStreakTaskDefinition = {
            userId,
            groupMemberStreakId,
            taskIncompleteTime: taskIncompleteTime.toDate(),
            taskIncompleteDay,
            groupStreakType,
            teamStreakId,
        };
        response.locals.incompleteGroupMemberStreakTaskDefinition = incompleteGroupMemberStreakTaskDefinition;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteGroupMemberStreakTaskDefinitionMiddleware, err));
    }
};

export const getSaveTaskIncompleteMiddleware = (
    incompleteGroupMemberStreakTaskModel: mongoose.Model<IncompleteGroupMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { incompleteGroupMemberStreakTaskDefinition } = response.locals;
        const incompleteGroupMemberStreakTask = await new incompleteGroupMemberStreakTaskModel(
            incompleteGroupMemberStreakTaskDefinition,
        ).save();
        response.locals.incompleteGroupMemberStreakTask = incompleteGroupMemberStreakTask;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveGroupMemberStreakTaskIncompleteMiddleware, err));
    }
};

export const saveTaskIncompleteMiddleware = getSaveTaskIncompleteMiddleware(incompleteGroupMemberStreakTaskModel);

export const getIncompleteGroupMemberStreakMiddleware = (
    groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const groupMemberStreak: GroupMemberStreak = response.locals.groupMemberStreak;
        if (groupMemberStreak.currentStreak.numberOfDaysInARow !== 0) {
            await groupMemberStreakModel.updateOne(
                { _id: groupMemberStreak._id },
                {
                    completedToday: false,
                    $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                    active: false,
                },
            );
        } else {
            await groupMemberStreakModel.updateOne(
                { _id: groupMemberStreak._id },
                {
                    completedToday: false,
                    'currentStreak.numberOfDaysInARow': 0,
                    active: false,
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncompleteGroupMemberStreakMiddleware, err));
    }
};

export const incompleteGroupMemberStreakMiddleware = getIncompleteGroupMemberStreakMiddleware(groupMemberStreakModel);

export const getSendTaskIncompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteGroupMemberStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(incompleteGroupMemberStreakTask);
    } catch (err) {
        next(new CustomError(ErrorType.SendGroupMemberStreakTaskIncompleteResponseMiddleware, err));
    }
};

export const sendTaskIncompleteResponseMiddleware = getSendTaskIncompleteResponseMiddleware(ResponseCodes.created);

export const createIncompleteGroupMemberStreakTaskMiddlewares = [
    incompleteGroupMemberStreakTaskBodyValidationMiddleware,
    groupMemberStreakExistsMiddleware,
    ensureGroupMemberStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    retreiveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    createIncompleteGroupMemberStreakTaskDefinitionMiddleware,
    saveTaskIncompleteMiddleware,
    incompleteGroupMemberStreakMiddleware,
    sendTaskIncompleteResponseMiddleware,
];
