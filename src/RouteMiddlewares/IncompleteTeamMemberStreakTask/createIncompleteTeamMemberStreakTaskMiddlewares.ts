import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import {
    incompleteTeamMemberStreakTaskModel,
    IncompleteTeamMemberStreakTaskModel,
} from '../../Models/IncompleteTeamMemberStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { TeamMemberStreak, StreakTypes } from '@streakoid/streakoid-sdk/lib';

export const incompleteTeamMemberStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    teamMemberStreakId: Joi.string().required(),
    teamStreakId: Joi.string().required(),
    streakType: Joi.string()
        .valid([StreakTypes.teamMember])
        .required(),
};

export const incompleteTeamMemberStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        incompleteTeamMemberStreakTaskBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getTeamMemberStreakExistsMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamMemberStreakId } = request.body;
        const teamMemberStreak = await teamMemberStreakModel.findOne({ _id: teamMemberStreakId });
        if (!teamMemberStreak) {
            throw new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist);
        }
        response.locals.teamMemberStreak = teamMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamMemberStreakExistsMiddleware, err));
    }
};

export const teamMemberStreakExistsMiddleware = getTeamMemberStreakExistsMiddleware(teamMemberStreakModel);

export const ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        if (!teamMemberStreak.completedToday) {
            throw new CustomError(ErrorType.TeamMemberStreakHasNotBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware, err));
    }
};

export const getResetStreakStartDateMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        if (teamMemberStreak.currentStreak.numberOfDaysInARow === 1) {
            response.locals.teamMemberStreak = await teamMemberStreakModel
                .findByIdAndUpdate(
                    teamMemberStreak._id,
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
        next(new CustomError(ErrorType.ResetTeamMemberStreakStartDateMiddleware, err));
    }
};

export const resetStreakStartDateMiddleware = getResetStreakStartDateMiddleware(teamMemberStreakModel);

export const getRetreiveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskRetreiveUserMiddleware, err));
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
        next(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakSetTaskIncompleteTimeMiddleware, err));
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
        next(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakSetDayTaskWasIncompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasIncompletedMiddleware = getSetDayTaskWasIncompletedMiddleware(dayFormat);

export const createIncompleteTeamMemberStreakTaskDefinitionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { userId, teamMemberStreakId, teamStreakId, streakType } = request.body;
        const { taskIncompleteTime, taskIncompleteDay } = response.locals;
        const incompleteTeamMemberStreakTaskDefinition = {
            userId,
            teamMemberStreakId,
            taskIncompleteTime: taskIncompleteTime.toDate(),
            taskIncompleteDay,
            teamStreakId,
            streakType,
        };
        response.locals.incompleteTeamMemberStreakTaskDefinition = incompleteTeamMemberStreakTaskDefinition;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskDefinitionMiddleware, err));
    }
};

export const getSaveTaskIncompleteMiddleware = (
    incompleteTeamMemberStreakTaskModel: mongoose.Model<IncompleteTeamMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { incompleteTeamMemberStreakTaskDefinition } = response.locals;
        const incompleteTeamMemberStreakTask = await new incompleteTeamMemberStreakTaskModel(
            incompleteTeamMemberStreakTaskDefinition,
        ).save();
        response.locals.incompleteTeamMemberStreakTask = incompleteTeamMemberStreakTask;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveTeamMemberStreakTaskIncompleteMiddleware, err));
    }
};

export const saveTaskIncompleteMiddleware = getSaveTaskIncompleteMiddleware(incompleteTeamMemberStreakTaskModel);

export const getIncompleteTeamMemberStreakMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        if (teamMemberStreak.currentStreak.numberOfDaysInARow !== 0) {
            await teamMemberStreakModel.updateOne(
                { _id: teamMemberStreak._id },
                {
                    completedToday: false,
                    $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                    active: false,
                },
            );
        } else {
            await teamMemberStreakModel.updateOne(
                { _id: teamMemberStreak._id },
                {
                    completedToday: false,
                    'currentStreak.numberOfDaysInARow': 0,
                    active: false,
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncompleteTeamMemberStreakMiddleware, err));
    }
};

export const incompleteTeamMemberStreakMiddleware = getIncompleteTeamMemberStreakMiddleware(teamMemberStreakModel);

export const getSendTaskIncompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteTeamMemberStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(incompleteTeamMemberStreakTask);
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamMemberStreakTaskIncompleteResponseMiddleware, err));
    }
};

export const sendTaskIncompleteResponseMiddleware = getSendTaskIncompleteResponseMiddleware(ResponseCodes.created);

export const createIncompleteTeamMemberStreakTaskMiddlewares = [
    incompleteTeamMemberStreakTaskBodyValidationMiddleware,
    teamMemberStreakExistsMiddleware,
    ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    retreiveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    createIncompleteTeamMemberStreakTaskDefinitionMiddleware,
    saveTaskIncompleteMiddleware,
    incompleteTeamMemberStreakMiddleware,
    sendTaskIncompleteResponseMiddleware,
];
