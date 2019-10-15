import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { TeamStreak } from '@streakoid/streakoid-sdk/lib';

import { ResponseCodes } from '../../Server/responseCodes';

import { teamStreakModel, TeamStreakModel } from '../../Models/TeamStreak';
import { completeTeamStreakTaskModel, CompleteTeamStreakTaskModel } from '../../Models/CompleteTeamStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';

export const completeTeamStreakTaskBodyValidationSchema = {
    teamStreakId: Joi.string().required(),
};

export const completeTeamStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        completeTeamStreakTaskBodyValidationSchema,
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
        const teamStreak = await teamStreakModel.findOne({ _id: teamStreakId });
        if (!teamStreak) {
            throw new CustomError(ErrorType.CreateCompleteTeamStreakTaskTeamStreakDoesNotExist);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateCompleteTeamStreakTaskTeamStreakExistsMiddleware, err));
    }
};

export const teamStreakExistsMiddleware = getTeamStreakExistsMiddleware(teamStreakModel);

export const ensureTeamStreakTaskHasNotBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        if (teamStreak.completedToday) {
            throw new CustomError(ErrorType.TeamStreakHasBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureTeamStreakTaskHasNotBeenCompletedTodayMiddleware, err));
    }
};

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
        next(new CustomError(ErrorType.CreateCompleteTeamStreakTaskSetTaskCompleteTimeMiddleware, err));
    }
};

export const setTaskCompleteTimeMiddleware = getSetTaskCompleteTimeMiddleware(moment);

export const getSetStreakStartDateMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const taskCompleteTime = response.locals.taskCompleteTime;
        if (!teamStreak.currentStreak.startDate) {
            await teamStreakModel.updateOne(
                { _id: teamStreak._id },
                {
                    currentStreak: {
                        startDate: taskCompleteTime,
                        numberOfDaysInARow: teamStreak.currentStreak.numberOfDaysInARow,
                    },
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakTaskSetStreakStartDateMiddleware, err));
    }
};

export const setStreakStartDateMiddleware = getSetStreakStartDateMiddleware(teamStreakModel);

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
        next(new CustomError(ErrorType.CreateCompleteTeamStreakTaskSetDayTaskWasCompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasCompletedMiddleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

export const createCompleteTeamStreakTaskDefinitionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamStreakId } = request.body;
        const { taskCompleteTime, taskCompleteDay } = response.locals;
        const completeTeamStreakTaskDefinition = {
            teamStreakId,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
        };
        response.locals.completeTeamStreakTaskDefinition = completeTeamStreakTaskDefinition;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakTaskDefinitionMiddleware, err));
    }
};

export const getSaveTaskCompleteMiddleware = (
    completeTeamStreakTaskModel: mongoose.Model<CompleteTeamStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { completeTeamStreakTaskDefinition } = response.locals;
        const completeTeamStreakTask = await new completeTeamStreakTaskModel(completeTeamStreakTaskDefinition).save();
        response.locals.completeTeamStreakTask = completeTeamStreakTask;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakTaskSaveTaskCompleteMiddleware, err));
    }
};

export const saveTaskCompleteMiddleware = getSaveTaskCompleteMiddleware(completeTeamStreakTaskModel);

export const getStreakMaintainedMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.body;
        await teamStreakModel.updateOne(
            { _id: teamStreakId },
            {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
            },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakTaskStreakMaintainedMiddleware, err));
    }
};

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(teamStreakModel);

export const getSendTaskCompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeTeamStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(completeTeamStreakTask);
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakTaskSendTaskCompleteResponseMiddleware, err));
    }
};

export const sendTaskCompleteResponseMiddleware = getSendTaskCompleteResponseMiddleware(ResponseCodes.created);

export const createCompleteTeamStreakTaskMiddlewares = [
    completeTeamStreakTaskBodyValidationMiddleware,
    teamStreakExistsMiddleware,
    ensureTeamStreakTaskHasNotBeenCompletedTodayMiddleware,
    setTaskCompleteTimeMiddleware,
    setStreakStartDateMiddleware,
    setDayTaskWasCompletedMiddleware,
    createCompleteTeamStreakTaskDefinitionMiddleware,
    saveTaskCompleteMiddleware,
    streakMaintainedMiddleware,
    sendTaskCompleteResponseMiddleware,
];
