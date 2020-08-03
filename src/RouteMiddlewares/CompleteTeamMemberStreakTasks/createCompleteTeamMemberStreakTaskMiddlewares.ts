import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';

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
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import {
    CompletedTeamStreakUpdatePushNotification,
    UnlockedAchievementPushNotification,
} from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import {
    sendPushNotification as sendPushNotificationImport,
    sendPushNotification,
} from '../../../src/helpers/sendPushNotification';
import { EndpointDisabledError } from '../../sns';
import { CoinTransactionHelpers } from '../../helpers/CoinTransactionHelpers';
import { OidXpTransactionHelpers } from '../../helpers/OidXpTransactionHelpers';
import { TeamMemberStreakCompleteOidXpSource } from '@streakoid/streakoid-models/lib/Models/OidXpSources';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { oidXpValues } from '../../helpers/oidXpValues';
import { coinCreditValues } from '../../helpers/coinCreditValues';
import { CoinCredits } from '@streakoid/streakoid-models/lib/Types/CoinCredits';
import { CompleteTeamMemberStreakCredit } from '@streakoid/streakoid-models/lib/Models/CoinCreditTypes';
import { LongestTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamMemberStreak';
import { achievementModel, AchievementModel } from '../../Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';
import { UserAchievement } from '@streakoid/streakoid-models/lib/Models/UserAchievement';
import { OneHundredDayTeamMemberStreakDatabaseAchievement } from '@streakoid/streakoid-models/lib/Models/DatabaseAchievement';

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

export const getRetrieveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskRetrieveUserMiddleware, err));
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

export const getTeamMemberStreakMaintainedMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
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

export const teamMemberStreakMaintainedMiddleware = getTeamMemberStreakMaintainedMiddleware(teamMemberStreakModel);

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
        next(new CustomError(ErrorType.CompleteTeamMemberStreakTaskIncreaseTotalStreakCompletesForUserMiddleware, err));
    }
};

export const increaseTotalStreakCompletesForUserMiddleware = getIncreaseTotalStreakCompletesForUserMiddleware(
    userModel,
);

export const getIncreaseTotalTimesTrackedForTeamMemberStreakMiddleware = (
    teamMemberStreak: typeof teamMemberStreakModel,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamMemberStreakId } = request.body;
        response.locals.teamMemberStreak = await teamMemberStreak.findByIdAndUpdate(
            teamMemberStreakId,
            {
                $inc: { totalTimesTracked: 1 },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncreaseTotalTimesTrackedForTeamMemberStreakMiddleware, err));
    }
};

export const increaseTotalTimesTrackedForTeamMemberStreakMiddleware = getIncreaseTotalTimesTrackedForTeamMemberStreakMiddleware(
    teamMemberStreakModel,
);

export const getIncreaseTotalTimesTrackedForTeamStreakMiddleware = (
    teamStreakModel: mongoose.Model<TeamStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        response.locals.teamStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            {
                $inc: { totalTimesTracked: 1 },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncreaseTotalTimesTrackedForTeamStreakMiddleware, err));
    }
};

export const increaseTotalTimesTrackedForTeamStreakMiddleware = getIncreaseTotalTimesTrackedForTeamStreakMiddleware(
    teamStreakModel,
);

export const getIncreaseLongestTeamMemberStreakForUserMiddleware = ({
    userModel,
}: {
    userModel: mongoose.Model<UserModel>;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        if (user.longestTeamMemberStreak.numberOfDays < teamMemberStreak.currentStreak.numberOfDaysInARow) {
            const longestTeamMemberStreak: LongestTeamMemberStreak = {
                teamMemberStreakId: teamMemberStreak._id,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(teamMemberStreak.createdAt),
            };
            response.locals.user = await userModel.findByIdAndUpdate(
                user._id,
                {
                    $set: { longestTeamMemberStreak },
                },
                { new: true },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncreaseLongestTeamMemberStreakForUserMiddleware, err));
    }
};

export const increaseLongestTeamMemberStreakForUserMiddleware = getIncreaseLongestTeamMemberStreakForUserMiddleware({
    userModel,
});

export const getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware = ({
    teamMemberStreakModel,
}: {
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        if (teamMemberStreak.longestTeamMemberStreak.numberOfDays < teamMemberStreak.currentStreak.numberOfDaysInARow) {
            const longestTeamMemberStreak: LongestTeamMemberStreak = {
                teamMemberStreakId: teamMemberStreak._id,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(teamMemberStreak.createdAt),
            };
            response.locals.teamMemberStreak = await teamMemberStreakModel.findByIdAndUpdate(
                teamMemberStreak._id,
                {
                    $set: { longestTeamMemberStreak },
                },
                { new: true },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware, err));
    }
};

export const increaseLongestTeamMemberStreakForTeamMemberStreakMiddleware = getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware(
    {
        teamMemberStreakModel,
    },
);

export const getCreditCoinsToUserForCompletingTeamMemberStreakMiddleware = (
    creditUserCoins: typeof CoinTransactionHelpers.creditUsersCoins,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, teamMemberStreakId } = request.body;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const coinCreditType: CompleteTeamMemberStreakCredit = {
            coinCreditType: CoinCredits.completeTeamMemberStreak,
            teamMemberStreakId,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
        };
        const coins = coinCreditValues[CoinCredits.completeTeamMemberStreak];
        response.locals.user = await creditUserCoins({
            userId,
            coinCreditType,
            coins,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreditCoinsToUserForCompletingTeamMemberStreakMiddleware, err));
    }
};

export const creditCoinsToUserForCompletingTeamMemberStreakMiddleware = getCreditCoinsToUserForCompletingTeamMemberStreakMiddleware(
    CoinTransactionHelpers.creditUsersCoins,
);

export const getCreditOidXpToUserForCompletingTeamMemberStreakMiddleware = (
    creditUserOidXp: typeof OidXpTransactionHelpers.creditUserOidXp,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, teamMemberStreakId } = request.body;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const source: TeamMemberStreakCompleteOidXpSource = {
            oidXpSourceType: OidXpSourcesTypes.teamMemberStreakComplete,
            teamMemberStreakId,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
        };
        response.locals.user = await creditUserOidXp({
            userId,
            oidXp: oidXpValues[OidXpSourcesTypes.teamMemberStreakComplete],
            source,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreditOidXpToUserForCompletingTeamMemberStreakMiddleware, err));
    }
};

export const creditOidXpToUserForCompletingTeamMemberStreakMiddleware = getCreditOidXpToUserForCompletingTeamMemberStreakMiddleware(
    OidXpTransactionHelpers.creditUserOidXp,
);

export const getUnlockOneHundredDayTeamMemberStreakAchievementForUserMiddleware = (
    user: mongoose.Model<UserModel>,
    achievement: mongoose.Model<AchievementModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const currentUser: User = response.locals.user;
        const currentUserHas100DayTeamMemberStreakAchievement = currentUser.achievements.find(
            achievementObject => achievementObject.achievementType === AchievementTypes.oneHundredDayTeamMemberStreak,
        );
        const oneHundredDays = 100;
        if (
            teamMemberStreak.currentStreak.numberOfDaysInARow === oneHundredDays &&
            !currentUserHas100DayTeamMemberStreakAchievement
        ) {
            const oneHundredDayTeamMemberStreakAchievement = await achievement.findOne({
                achievementType: AchievementTypes.oneHundredDayTeamMemberStreak,
            });
            if (!oneHundredDayTeamMemberStreakAchievement) {
                throw new CustomError(ErrorType.OneHundredDayTeamMemberStreakAchievementDoesNotExist);
            }
            const oneHundredDayTeamMemberStreakUserAchievement: UserAchievement = {
                _id: oneHundredDayTeamMemberStreakAchievement._id,
                achievementType: AchievementTypes.oneHundredDayTeamMemberStreak,
            };
            await user.findByIdAndUpdate(currentUser._id, {
                $addToSet: { achievements: oneHundredDayTeamMemberStreakUserAchievement },
            });
            response.locals.oneHundredDayTeamMemberStreakAchievement = oneHundredDayTeamMemberStreakAchievement;
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.UnlockOneHundredDayTeamMemberStreakAchievementForUserMiddleware, err));
    }
};

export const unlockOneHundredDayTeamMemberStreakAchievementForUserMiddleware = getUnlockOneHundredDayTeamMemberStreakAchievementForUserMiddleware(
    userModel,
    achievementModel,
);

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
                    _id: member.teamMemberStreakId,
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

export const getRetrieveTeamMembersMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        next(new CustomError(ErrorType.CreateCompleteTeamMemberStreakTaskRetrieveTeamMembersMiddleware, err));
    }
};

export const retrieveTeamMembersMiddleware = getRetrieveTeamMembersMiddleware(userModel);

export const getNotifyTeamMembersThatUserHasCompletedTaskMiddleware = ({
    sendPushNotification,
}: {
    sendPushNotification: typeof sendPushNotificationImport;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const teamMembers: UserModel[] = response.locals.teamMembers;

        const title = `${teamStreak.streakName} update`;
        const body = `${user.username} has completed ${teamStreak.streakName}`;
        const data: CompletedTeamStreakUpdatePushNotification = {
            pushNotificationType: PushNotificationTypes.completedTeamStreakUpdate,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            title,
            body,
        };
        await Promise.all(
            teamMembers.map(async teamMember => {
                const { pushNotification, pushNotifications } = teamMember;
                const androidEndpointArn = pushNotification.androidEndpointArn;
                const iosEndpointArn = pushNotification.iosEndpointArn;
                const teamMemberTeamStreakUpdatesEnabled =
                    pushNotifications &&
                    pushNotifications.teamStreakUpdates &&
                    pushNotifications.teamStreakUpdates.enabled;
                if (
                    (androidEndpointArn || iosEndpointArn) &&
                    teamMemberTeamStreakUpdatesEnabled &&
                    String(teamMember._id) !== String(user._id)
                ) {
                    try {
                        await sendPushNotification({
                            title,
                            body,
                            data,
                            androidEndpointArn,
                            iosEndpointArn,
                            userId: teamMember._id,
                            pushNotificationType: PushNotificationTypes.completedTeamStreakUpdate,
                        });
                        return teamMember;
                    } catch (err) {
                        if (err.code !== EndpointDisabledError) {
                            throw err;
                        }
                    }
                }
            }),
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.NotifyTeamMembersThatUserHasCompletedTaskMiddleware, err));
    }
};

export const notifiyTeamMembersThatUserHasCompletedTaskMiddleware = getNotifyTeamMembersThatUserHasCompletedTaskMiddleware(
    {
        sendPushNotification: sendPushNotificationImport,
    },
);

export const sendCompleteTeamMemberStreakTaskResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { completeTeamMemberStreakTask } = response.locals;
        response.status(ResponseCodes.created).send(completeTeamMemberStreakTask);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendCompleteTeamMemberStreakTaskResponseMiddleware, err));
    }
};

export const getCreateCompleteTeamMemberStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const completedTeamMemberStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.completedTeamMemberStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
        };
        await createActivityFeedItemFunction(completedTeamMemberStreakActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreateCompleteTeamMemberStreakActivityFeedItemMiddleware, err));
    }
};

export const createCompleteTeamMemberStreakActivityFeedItemMiddleware = getCreateCompleteTeamMemberStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getSendOneHundredDayTeamMemberStreakAchievementUnlockedPushNotificationMiddleware = (
    sendPush: typeof sendPushNotification,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const oneHundredDayTeamMemberStreakAchievement: OneHundredDayTeamMemberStreakDatabaseAchievement =
            response.locals.oneHundredDayTeamMemberStreakAchievement;
        const { pushNotification, pushNotifications } = user;
        const androidEndpointArn = pushNotification.androidEndpointArn;
        const iosEndpointArn = pushNotification.iosEndpointArn;
        const achievementUpdatesEnabled =
            pushNotifications && pushNotifications.achievementUpdates && pushNotifications.achievementUpdates.enabled;
        if (
            oneHundredDayTeamMemberStreakAchievement &&
            (androidEndpointArn || iosEndpointArn) &&
            achievementUpdatesEnabled
        ) {
            const title = `Unlocked ${oneHundredDayTeamMemberStreakAchievement.name}`;
            const body = `You unlocked an achievement for: ${oneHundredDayTeamMemberStreakAchievement.description}`;
            const data: UnlockedAchievementPushNotification = {
                pushNotificationType: PushNotificationTypes.unlockedAchievement,
                achievementId: oneHundredDayTeamMemberStreakAchievement._id,
                title,
                body,
            };
            try {
                await sendPush({
                    title,
                    body,
                    data,
                    androidEndpointArn,
                    iosEndpointArn,
                    userId: user._id,
                    pushNotificationType: PushNotificationTypes.unlockedAchievement,
                });
            } catch (err) {
                if (err.code !== EndpointDisabledError) {
                    throw err;
                }
            }
        }
    } catch (err) {
        next(
            new CustomError(
                ErrorType.SendOneHundredDayTeamMemberStreakAchievementUnlockedPushNotificationMiddleware,
                err,
            ),
        );
    }
};

export const sendOneHundredDayTeamMemberStreakAchievementUnlockedPushNotificationMiddleware = getSendOneHundredDayTeamMemberStreakAchievementUnlockedPushNotificationMiddleware(
    sendPushNotification,
);

export const createCompleteTeamMemberStreakTaskMiddlewares = [
    completeTeamMemberStreakTaskBodyValidationMiddleware,
    teamStreakExistsMiddleware,
    teamMemberStreakExistsMiddleware,
    ensureTeamMemberStreakTaskHasNotBeenCompletedTodayMiddleware,
    retrieveUserMiddleware,
    setTaskCompleteTimeMiddleware,
    setStreakStartDateMiddleware,
    setDayTaskWasCompletedMiddleware,
    createCompleteTeamMemberStreakTaskMiddleware,
    teamMemberStreakMaintainedMiddleware,
    increaseTotalStreakCompletesForUserMiddleware,
    increaseTotalTimesTrackedForTeamMemberStreakMiddleware,
    increaseTotalTimesTrackedForTeamStreakMiddleware,
    increaseLongestTeamMemberStreakForUserMiddleware,
    increaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
    creditCoinsToUserForCompletingTeamMemberStreakMiddleware,
    creditOidXpToUserForCompletingTeamMemberStreakMiddleware,
    unlockOneHundredDayTeamMemberStreakAchievementForUserMiddleware,
    setTeamStreakToActiveMiddleware,
    haveAllTeamMembersCompletedTasksMiddleware,
    setTeamStreakStartDateMiddleware,
    setDayTeamStreakWasCompletedMiddleware,
    createCompleteTeamStreakDefinitionMiddleware,
    saveCompleteTeamStreakMiddleware,
    teamStreakMaintainedMiddleware,
    retrieveTeamMembersMiddleware,
    notifiyTeamMembersThatUserHasCompletedTaskMiddleware,
    sendCompleteTeamMemberStreakTaskResponseMiddleware,
    createCompleteTeamMemberStreakActivityFeedItemMiddleware,
    sendOneHundredDayTeamMemberStreakAchievementUnlockedPushNotificationMiddleware,
];
