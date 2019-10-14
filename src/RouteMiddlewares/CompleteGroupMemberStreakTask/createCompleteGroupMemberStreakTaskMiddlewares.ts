import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { GroupMemberStreak, StreakTypes } from '@streakoid/streakoid-sdk/lib';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { groupMemberStreakModel, GroupMemberStreakModel } from '../../Models/GroupMemberStreak';
import {
    completeGroupMemberStreakTaskModel,
    CompleteGroupMemberStreakTaskModel,
} from '../../Models/CompleteGroupMemberStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';

export const completeGroupMemberStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    groupMemberStreakId: Joi.string().required(),
    teamStreakId: Joi.string().required(),
    streakType: Joi.string()
        .valid([StreakTypes.teamMember])
        .required(),
};

export const completeGroupMemberStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        completeGroupMemberStreakTaskBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getTeamStreakExistsMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.body;
        const teamStreak = await teamStreakModel.findOne({
            _id: teamStreakId,
        });
        if (!teamStreak) {
            throw new CustomError(ErrorType.TeamStreakDoesNotExist);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.TeamStreakExistsMiddleware, err));
    }
};

export const teamStreakExistsMiddleware = getTeamStreakExistsMiddleware(teamStreakModel);

export const getGroupMemberStreakExistsMiddleware = (
    groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { groupMemberStreakId } = request.body;
        const groupMemberStreak = await groupMemberStreakModel.findOne({
            _id: groupMemberStreakId,
        });
        if (!groupMemberStreak) {
            throw new CustomError(ErrorType.GroupMemberStreakDoesNotExist);
        }
        response.locals.groupMemberStreak = groupMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GroupMemberStreakExistsMiddleware, err));
    }
};

export const groupMemberStreakExistsMiddleware = getGroupMemberStreakExistsMiddleware(groupMemberStreakModel);

export const ensureGroupMemberStreakTaskHasNotBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const groupMemberStreak: GroupMemberStreak = response.locals.groupMemberStreak;
        if (groupMemberStreak.completedToday) {
            throw new CustomError(ErrorType.GroupMemberStreakTaskHasBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureGroupMemberStreakTaskHasNotBeenCompletedTodayMiddleware, err));
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
        else next(new CustomError(ErrorType.CreateCompleteGroupMemberStreakTaskRetreiveUserMiddleware, err));
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
        next(new CustomError(ErrorType.SetGroupMemberStreakTaskCompleteTimeMiddleware, err));
    }
};

export const setTaskCompleteTimeMiddleware = getSetTaskCompleteTimeMiddleware(moment);

export const getSetStreakStartDateMiddleware = (
    groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const groupMemberStreak: GroupMemberStreak = response.locals.groupMemberStreak;
        const taskCompleteTime = response.locals.taskCompleteTime;
        if (!groupMemberStreak.currentStreak.startDate) {
            await groupMemberStreakModel.updateOne(
                { _id: groupMemberStreak._id },
                {
                    currentStreak: {
                        startDate: taskCompleteTime,
                        numberOfDaysInARow: groupMemberStreak.currentStreak.numberOfDaysInARow,
                    },
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetGroupMemberStreakStartDateMiddleware, err));
    }
};

export const setStreakStartDateMiddleware = getSetStreakStartDateMiddleware(groupMemberStreakModel);

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
        next(new CustomError(ErrorType.SetDayGroupMemberStreakTaskWasCompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasCompletedMiddleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

export const getCreateCompleteGroupMemberStreakTaskMiddleware = (
    completeGroupMemberStreakTaskModel: mongoose.Model<CompleteGroupMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, teamStreakId, groupMemberStreakId, streakType } = request.body;
        const { taskCompleteTime, taskCompleteDay } = response.locals;
        const completeGroupMemberStreakTaskDefinition = {
            userId,
            teamStreakId,
            groupMemberStreakId,
            taskCompleteTime: taskCompleteTime,
            taskCompleteDay,
            streakType,
        };
        response.locals.completeGroupMemberStreakTask = await new completeGroupMemberStreakTaskModel(
            completeGroupMemberStreakTaskDefinition,
        ).save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteGroupMemberStreakTaskMiddleware, err));
    }
};

export const createCompleteGroupMemberStreakTaskMiddleware = getCreateCompleteGroupMemberStreakTaskMiddleware(
    completeGroupMemberStreakTaskModel,
);

export const getStreakMaintainedMiddleware = (groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { groupMemberStreakId } = request.body;
        await groupMemberStreakModel.updateOne(
            { _id: groupMemberStreakId },
            {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
            },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.GroupMemberStreakMaintainedMiddleware, err));
    }
};

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(groupMemberStreakModel);

export const sendCompleteGroupMemberStreakTaskResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeGroupMemberStreakTask } = response.locals;
        response.status(ResponseCodes.created).send(completeGroupMemberStreakTask);
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteGroupMemberStreakTaskResponseMiddleware, err));
    }
};

export const createCompleteGroupMemberStreakTaskMiddlewares = [
    completeGroupMemberStreakTaskBodyValidationMiddleware,
    teamStreakExistsMiddleware,
    groupMemberStreakExistsMiddleware,
    ensureGroupMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
    retreiveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setStreakStartDateMiddleware,
    setDayTaskWasCompletedMiddleware,
    createCompleteGroupMemberStreakTaskMiddleware,
    streakMaintainedMiddleware,
    sendCompleteGroupMemberStreakTaskResponseMiddleware,
];
