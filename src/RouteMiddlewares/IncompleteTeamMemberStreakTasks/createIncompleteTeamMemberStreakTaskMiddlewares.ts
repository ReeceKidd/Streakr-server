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
import {
    TeamMemberStreak,
    TeamStreak,
    User,
    ActivityFeedItemTypes,
    ActivityFeedItemType,
} from '@streakoid/streakoid-sdk/lib';
import { incompleteTeamStreakModel } from '../../../src/Models/IncompleteTeamStreak';
import { IncompleteTeamStreakModel } from '../../../src/Models/IncompleteTeamStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { TeamStreakModel } from '../../../src/Models/TeamStreak';
import Expo, { ExpoPushMessage } from 'expo-server-sdk';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';

export const incompleteTeamMemberStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    teamMemberStreakId: Joi.string().required(),
    teamStreakId: Joi.string().required(),
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

export const getTeamStreakExistsMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.body;
        const teamStreak = await teamStreakModel.findOne({ _id: teamStreakId });
        if (!teamStreak) {
            throw new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamStreakDoesNotExist);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskTeamStreakExistsMiddleware, err));
    }
};

export const teamStreakExistsMiddleware = getTeamStreakExistsMiddleware(teamStreakModel);

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
        const { userId, teamMemberStreakId, teamStreakId } = request.body;
        const { taskIncompleteTime, taskIncompleteDay } = response.locals;
        const incompleteTeamMemberStreakTaskDefinition = {
            userId,
            teamMemberStreakId,
            taskIncompleteTime: taskIncompleteTime.toDate(),
            taskIncompleteDay,
            teamStreakId,
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
        if (teamMemberStreak.currentStreak.numberOfDaysInARow === 0) {
            await teamMemberStreakModel.updateOne(
                { _id: teamMemberStreak._id },
                {
                    completedToday: false,
                    'currentStreak.numberOfDaysInARow': 0,
                    active: false,
                },
            );
        } else {
            await teamMemberStreakModel.updateOne(
                { _id: teamMemberStreak._id },
                {
                    completedToday: false,
                    $inc: { 'currentStreak.numberOfDaysInARow': -1 },
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

export const getResetTeamStreakStartDateMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        if (teamStreak.currentStreak.numberOfDaysInARow === 1) {
            response.locals.teamStreak = await teamStreakModel
                .findByIdAndUpdate(
                    teamStreak._id,
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
        next(new CustomError(ErrorType.ResetTeamStreakStartDateMiddleware, err));
    }
};

export const resetTeamStreakStartDateMiddleware = getResetTeamStreakStartDateMiddleware(teamStreakModel);

export const getIncompleteTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        if (teamStreak.currentStreak.numberOfDaysInARow === 0 && teamStreak.completedToday) {
            response.locals.teamStreak = await teamStreakModel
                .findByIdAndUpdate(
                    teamStreak._id,
                    {
                        completedToday: false,
                        'currentStreak.numberOfDaysInARow': 0,
                    },
                    { new: true },
                )
                .lean();
        } else if (teamStreak.currentStreak.numberOfDaysInARow !== 0 && teamStreak.completedToday) {
            response.locals.teamStreak = await teamStreakModel
                .findByIdAndUpdate(
                    teamStreak._id,
                    {
                        completedToday: false,
                        $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                    },
                    { new: true },
                )
                .lean();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncompleteTeamStreakMiddleware, err));
    }
};

export const incompleteTeamStreakMiddleware = getIncompleteTeamStreakMiddleware(teamStreakModel);

export const getHasAtLeastOneTeamMemberCompletedTheirTaskMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        let atLeastOneTeamMemberHasCompletedTheirTaskToday;
        await Promise.all(
            teamStreak.members.map(async member => {
                const teamMemberStreak: TeamMemberStreak | null = await teamMemberStreakModel.findOne({
                    _id: member.teamMemberStreakId,
                });
                if (!teamMemberStreak) {
                    throw new CustomError(ErrorType.IncompleteTeamMemberStreakTaskTeamMemberStreakDoesNotExist);
                }
                if (teamMemberStreak.completedToday === true) {
                    atLeastOneTeamMemberHasCompletedTheirTaskToday = true;
                }
            }),
        );
        response.locals.atLeastOneTeamMemberHasCompletedTheirTaskToday = atLeastOneTeamMemberHasCompletedTheirTaskToday;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.HasOneTeamMemberCompletedTaskMiddleware, err));
    }
};

export const hasAtLeastOneTeamMemberCompletedTheirTaskMiddleware = getHasAtLeastOneTeamMemberCompletedTheirTaskMiddleware(
    teamMemberStreakModel,
);

export const getMakeTeamStreakInactiveMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { atLeastOneTeamMemberHasCompletedTheirTaskToday, teamStreak } = response.locals;
        if (!atLeastOneTeamMemberHasCompletedTheirTaskToday) {
            await teamStreakModel.updateOne(
                { _id: teamStreak._id },
                {
                    active: false,
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.MakeTeamStreakInactiveMiddleware, err));
    }
};

export const makeTeamStreakInactiveMiddleware = getMakeTeamStreakInactiveMiddleware(teamStreakModel);

export const getCreateTeamStreakIncompleteMiddleware = (
    incompleteTeamStreakModel: mongoose.Model<IncompleteTeamStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, teamStreakId } = request.body;
        const { taskIncompleteDay, taskIncompleteTime } = response.locals;
        const incompleteTeamStreak = new incompleteTeamStreakModel({
            userId,
            teamStreakId,
            taskIncompleteTime,
            taskIncompleteDay,
        });
        await incompleteTeamStreak.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamStreakIncomplete, err));
    }
};

export const createTeamStreakIncompleteMiddleware = getCreateTeamStreakIncompleteMiddleware(incompleteTeamStreakModel);

export const getRetreiveTeamMembersMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const teamMembers: User[] = await userModel
            .find({ _id: teamStreak.members.map(teamMember => teamMember.memberId) })
            .lean();
        const teamMembersWithoutCurrentUser = teamMembers.filter(teamMember => teamMember._id !== user._id);
        response.locals.teamMembers = teamMembersWithoutCurrentUser;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakTaskRetreiveTeamMembersMiddleware, err));
    }
};

export const retreiveTeamMembersMiddleware = getRetreiveTeamMembersMiddleware(userModel);

const expoClient = new Expo();

export const getNotifyTeamMembersThatUserHasIncompletedTaskMiddleware = (expo: typeof expoClient) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const teamMembers: UserModel[] = response.locals.teamMembers;
        const messages: ExpoPushMessage[] = [];
        await Promise.all(
            teamMembers.map(async teamMember => {
                if (
                    teamMember.pushNotificationToken &&
                    teamMember.notifications.teamStreakUpdates.pushNotification &&
                    String(teamMember._id) !== String(user._id)
                ) {
                    messages.push({
                        to: teamMember.pushNotificationToken,
                        sound: 'default',
                        title: `${teamStreak.streakName} update`,
                        body: `${user.username} made a mistake they have not completed ${teamStreak.streakName}`,
                    });
                }
            }),
        );
        const chunks = await expo.chunkPushNotifications(messages);
        for (const chunk of chunks) {
            await expo.sendPushNotificationsAsync(chunk);
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.NotifyTeamMembersThatUserHasIncompletedTaskMiddleware, err));
    }
};

export const notifiyTeamMembersThatUserHasIncompletedTaskMiddleware = getNotifyTeamMembersThatUserHasIncompletedTaskMiddleware(
    expoClient,
);

export const getSendTaskIncompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteTeamMemberStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(incompleteTeamMemberStreakTask);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamMemberStreakTaskIncompleteResponseMiddleware, err));
    }
};

export const sendTaskIncompleteResponseMiddleware = getSendTaskIncompleteResponseMiddleware(ResponseCodes.created);

export const getCreateIncompleteTeamMemberStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const incompletedTeamMemberStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.incompletedTeamMemberStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
        };
        await createActivityFeedItemFunction(incompletedTeamMemberStreakActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteTeamMemberStreakActivityFeedItemMiddleware, err));
    }
};

export const createIncompleteTeamMemberStreakActivityFeedItemMiddleware = getCreateIncompleteTeamMemberStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const createIncompleteTeamMemberStreakTaskMiddlewares = [
    incompleteTeamMemberStreakTaskBodyValidationMiddleware,
    teamMemberStreakExistsMiddleware,
    teamStreakExistsMiddleware,
    ensureTeamMemberStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    retreiveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    createIncompleteTeamMemberStreakTaskDefinitionMiddleware,
    saveTaskIncompleteMiddleware,
    incompleteTeamMemberStreakMiddleware,
    resetTeamStreakStartDateMiddleware,
    incompleteTeamStreakMiddleware,
    hasAtLeastOneTeamMemberCompletedTheirTaskMiddleware,
    makeTeamStreakInactiveMiddleware,
    createTeamStreakIncompleteMiddleware,
    retreiveTeamMembersMiddleware,
    notifiyTeamMembersThatUserHasIncompletedTaskMiddleware,
    sendTaskIncompleteResponseMiddleware,
    createIncompleteTeamMemberStreakActivityFeedItemMiddleware,
];
