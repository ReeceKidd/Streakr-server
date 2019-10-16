import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { TeamMemberStreak, TeamStreak } from '@streakoid/streakoid-sdk/lib';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import {
    completeTeamMemberStreakTaskModel,
    CompleteTeamMemberStreakTaskModel,
} from '../../Models/CompleteTeamMemberStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { completeTeamStreakModel, CompleteTeamStreakModel } from '../../Models/CompleteTeamStreak';

export const completeTeamMemberStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    teamMemberStreakId: Joi.string().required(),
    teamStreakId: Joi.string().required(),
};

export const completeTeamMemberStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        completeTeamMemberStreakTaskBodyValidationSchema,
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

export const getTeamMemberStreakExistsMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamMemberStreakId } = request.body;
        const teamMemberStreak = await teamMemberStreakModel.findOne({
            _id: teamMemberStreakId,
        });
        if (!teamMemberStreak) {
            throw new CustomError(ErrorType.TeamMemberStreakDoesNotExist);
        }
        response.locals.teamMemberStreak = teamMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.TeamMemberStreakExistsMiddleware, err));
    }
};

export const teamMemberStreakExistsMiddleware = getTeamMemberStreakExistsMiddleware(teamMemberStreakModel);

export const ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        if (teamMemberStreak.completedToday) {
            throw new CustomError(ErrorType.TeamMemberStreakTaskHasBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware, err));
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
        else next(new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskRetreiveUserMiddleware, err));
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
        next(new CustomError(ErrorType.SetTeamMemberStreakTaskCompleteTimeMiddleware, err));
    }
};

export const setTaskCompleteTimeMiddleware = getSetTaskCompleteTimeMiddleware(moment);

export const getSetStreakStartDateMiddleware = (teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const taskCompleteTime = response.locals.taskCompleteTime;
        if (!teamMemberStreak.currentStreak.startDate) {
            await teamMemberStreakModel.updateOne(
                { _id: teamMemberStreak._id },
                {
                    currentStreak: {
                        startDate: taskCompleteTime,
                        numberOfDaysInARow: teamMemberStreak.currentStreak.numberOfDaysInARow,
                    },
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetTeamMemberStreakStartDateMiddleware, err));
    }
};

export const setStreakStartDateMiddleware = getSetStreakStartDateMiddleware(teamMemberStreakModel);

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
        next(new CustomError(ErrorType.SetDayTeamMemberStreakTaskWasCompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasCompletedMiddleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

export const getCreateCompleteTeamMemberStreakTaskMiddleware = (
    completeTeamMemberStreakTaskModel: mongoose.Model<CompleteTeamMemberStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, teamStreakId, teamMemberStreakId } = request.body;
        const { taskCompleteTime, taskCompleteDay } = response.locals;
        const completeTeamMemberStreakTaskDefinition = {
            userId,
            teamStreakId,
            teamMemberStreakId,
            taskCompleteTime: taskCompleteTime,
            taskCompleteDay,
        };
        response.locals.completeTeamMemberStreakTask = await new completeTeamMemberStreakTaskModel(
            completeTeamMemberStreakTaskDefinition,
        ).save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskMiddleware, err));
    }
};

export const createCompleteTeamMemberStreakTaskMiddleware = getCreateCompleteTeamMemberStreakTaskMiddleware(
    completeTeamMemberStreakTaskModel,
);

export const getStreakMaintainedMiddleware = (teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamMemberStreakId } = request.body;
        await teamMemberStreakModel.findByIdAndUpdate(
            teamMemberStreakId,
            {
                completedToday: true,
                $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                active: true,
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.TeamMemberStreakMaintainedMiddleware, err));
    }
};

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(teamMemberStreakModel);

export const getSetTeamStreakToActiveMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.body;
        const teamStreak = await teamStreakModel
            .findByIdAndUpdate(
                teamStreakId,
                {
                    active: true,
                },
                { new: true },
            )
            .lean();
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetTeamStreakToActive, err));
    }
};

export const setTeamStreakToActiveMiddleware = getSetTeamStreakToActiveMiddleware(teamStreakModel);

export const getHaveAllTeamMembersCompletedTasksMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        let teamStreakCompletedToday = true;
        await Promise.all(
            teamStreak.members.map(async member => {
                const teamMemberStreak: TeamMemberStreak | null = await teamMemberStreakModel.findOne({
                    userId: member.memberId,
                });
                if (!teamMemberStreak) {
                    throw new CustomError(ErrorType.CompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist);
                }
                if (teamMemberStreak.completedToday === false) {
                    teamStreakCompletedToday = false;
                }
            }),
        );
        response.locals.teamStreakCompletedToday = teamStreakCompletedToday;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.HaveAllTeamMembersCompletedTasksMiddlewares, err));
    }
};

export const haveAllTeamMembersCompletedTasksMiddleware = getHaveAllTeamMembersCompletedTasksMiddleware(
    teamMemberStreakModel,
);

export const getSetTeamStreakStartDateMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const { teamStreakCompletedToday, taskCompleteTime } = response.locals;
        if (teamStreakCompletedToday && !teamStreak.currentStreak.startDate) {
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
        next(new CustomError(ErrorType.CreateCompleteTeamStreakSetStreakStartDateMiddleware, err));
    }
};

export const setTeamStreakStartDateMiddleware = getSetTeamStreakStartDateMiddleware(teamStreakModel);

export const getSetDayTeamStreakWasCompletedMiddleware = (dayFormat: string) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamStreakCompletedToday, taskCompleteTime } = response.locals;
        if (teamStreakCompletedToday) {
            const taskCompleteDay = taskCompleteTime.format(dayFormat);
            response.locals.taskCompleteDay = taskCompleteDay;
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakSetDayTaskWasCompletedMiddleware, err));
    }
};

export const setDayTeamStreakWasCompletedMiddleware = getSetDayTeamStreakWasCompletedMiddleware(dayFormat);

export const createCompleteTeamStreakDefinitionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamStreakId } = request.body;
        const { teamStreakCompletedToday, taskCompleteTime, taskCompleteDay } = response.locals;
        if (teamStreakCompletedToday) {
            const completeTeamStreakDefinition = {
                teamStreakId,
                taskCompleteTime: taskCompleteTime.toDate(),
                taskCompleteDay,
            };
            response.locals.completeTeamStreakDefinition = completeTeamStreakDefinition;
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakDefinitionMiddleware, err));
    }
};

export const getSaveCompleteTeamStreakMiddleware = (
    completeTeamStreakModel: mongoose.Model<CompleteTeamStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamStreakCompletedToday, completeTeamStreakDefinition } = response.locals;
        if (teamStreakCompletedToday) {
            const completeTeamStreak = await new completeTeamStreakModel(completeTeamStreakDefinition).save();
            response.locals.completeTeamStreak = completeTeamStreak;
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakSaveTaskCompleteMiddleware, err));
    }
};

export const saveCompleteTeamStreakMiddleware = getSaveCompleteTeamStreakMiddleware(completeTeamStreakModel);

export const getTeamStreakMaintainedMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakCompletedToday } = response.locals;
        const { teamStreakId } = request.body;
        if (teamStreakCompletedToday) {
            await teamStreakModel.updateOne(
                { _id: teamStreakId },
                {
                    completedToday: true,
                    $inc: { 'currentStreak.numberOfDaysInARow': 1 },
                    active: true,
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamStreakStreakMaintainedMiddleware, err));
    }
};

export const teamStreakMaintainedMiddleware = getTeamStreakMaintainedMiddleware(teamStreakModel);

export const sendCompleteTeamMemberStreakTaskResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeTeamMemberStreakTask } = response.locals;
        response.status(ResponseCodes.created).send(completeTeamMemberStreakTask);
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteTeamMemberStreakTaskResponseMiddleware, err));
    }
};

export const createCompleteTeamMemberStreakTaskMiddlewares = [
    completeTeamMemberStreakTaskBodyValidationMiddleware,
    teamStreakExistsMiddleware,
    teamMemberStreakExistsMiddleware,
    ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
    retreiveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setStreakStartDateMiddleware,
    setDayTaskWasCompletedMiddleware,
    createCompleteTeamMemberStreakTaskMiddleware,
    streakMaintainedMiddleware,
    setTeamStreakToActiveMiddleware,
    haveAllTeamMembersCompletedTasksMiddleware,
    setTeamStreakStartDateMiddleware,
    setDayTeamStreakWasCompletedMiddleware,
    createCompleteTeamStreakDefinitionMiddleware,
    saveCompleteTeamStreakMiddleware,
    teamStreakMaintainedMiddleware,
    sendCompleteTeamMemberStreakTaskResponseMiddleware,
];
