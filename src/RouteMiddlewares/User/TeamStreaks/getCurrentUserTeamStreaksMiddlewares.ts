import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { PopulatedTeamMember } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamMember';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { GetAllTeamStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamStreaks';
import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamStreakModel, teamStreakModel } from '../../../Models/TeamStreak';
import { CustomError, ErrorType } from '../../../customError';
import { UserModel, userModel } from '../../../Models/User';
import { TeamMemberStreakModel, teamMemberStreakModel } from '../../../Models/TeamMemberStreak';
import { ResponseCodes } from '../../../Server/responseCodes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const getTeamStreaksQueryValidationSchema = {
    creatorId: Joi.string(),
    timezone: Joi.string(),
    status: Joi.string().valid(Object.keys(StreakStatus)),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    sortField: Joi.string(),
    limit: Joi.number(),
};

export const getCurrentUserTeamStreaksQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getTeamStreaksQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCurrentUserFindTeamStreaksMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const { creatorId, timezone, status, completedToday, active, sortField } = request.query;

        const defaultLeaderboardLimit = 30;

        const limit = Number(request.query.limit) || defaultLeaderboardLimit;

        const query: {
            ['members.memberId']: string;
            creatorId?: string;
            timezone?: string;
            status?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
        } = {
            ['members.memberId']: String(user._id),
        };

        if (creatorId) {
            query.creatorId = creatorId;
        }
        if (timezone) {
            query.timezone = timezone;
        }
        if (status) {
            query.status = status;
        }
        if (completedToday) {
            query.completedToday = completedToday === 'true';
        }
        if (active) {
            query.active = active === 'true';
        }

        if (sortField === GetAllTeamStreaksSortFields.currentStreak) {
            response.locals.teamStreaks = await teamStreakModel
                .find(query)
                .sort({ 'currentStreak.numberOfDaysInARow': -1 })
                .limit(limit)
                .lean();
        } else if (sortField === GetAllTeamStreaksSortFields.longestTeamStreak) {
            response.locals.teamStreaks = await teamStreakModel
                .find(query)
                .sort({ 'longestTeamStreak.numberOfDays': -1 })
                .limit(limit)
                .lean();
        } else {
            response.locals.teamStreaks = await teamStreakModel
                .find(query)
                .limit(limit)
                .lean();
        }

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindCurrentUserTeamStreaksMiddleware, err));
    }
};

export const findCurrentUserTeamStreaksMiddleware = getCurrentUserFindTeamStreaksMiddleware(teamStreakModel);

export const getRetrieveCurrentUserTeamStreaksMembersInformationMiddleware = (
    userModel: mongoose.Model<UserModel>,
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamStreaks: TeamStreak[] = response.locals.teamStreaks;
        const teamStreaksWithPopulatedData = await Promise.all(
            teamStreaks.map(async teamStreak => {
                const { members } = teamStreak;
                const teamStreakMembers = await Promise.all(
                    members.map(
                        async (member: {
                            memberId: string;
                            teamMemberStreakId: string;
                        }): Promise<PopulatedTeamMember | undefined> => {
                            const memberInfo = await userModel.findOne({ _id: member.memberId });

                            const teamMemberStreak = await teamMemberStreakModel.findOne({
                                _id: member.teamMemberStreakId,
                            });

                            if (!memberInfo || !teamMemberStreak) {
                                return;
                            }
                            return {
                                _id: memberInfo._id,
                                username: memberInfo.username,
                                profileImage: memberInfo.profileImages.originalImageUrl,
                                teamMemberStreak,
                            };
                        },
                    ),
                );

                return {
                    ...teamStreak,
                    members: teamStreakMembers.filter(member => member !== undefined),
                };
            }),
        );
        response.locals.teamStreaks = teamStreaksWithPopulatedData;

        next();
    } catch (err) {
        next(new CustomError(ErrorType.RetrieveCurrentUserTeamStreaksMembersInformation, err));
    }
};

export const retrieveCurrentUserTeamStreaksMembersInformationMiddleware = getRetrieveCurrentUserTeamStreaksMembersInformationMiddleware(
    userModel,
    teamMemberStreakModel,
);

export const formatCurrentUserTeamStreaksMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const teamStreaks: TeamStreak[] = response.locals.teamStreaks;
        response.locals.teamStreaks = teamStreaks.map(teamStreak => ({ ...teamStreak, inviteKey: undefined }));
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormatCurrentUserTeamStreaksMiddleware, err));
    }
};

export const sendCurrentUserTeamStreaksMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamStreaks } = response.locals;
        response.status(ResponseCodes.success).send(teamStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendCurrentUserTeamStreaksMiddleware, err));
    }
};

export const getCurrentUserTeamStreaksMiddlewares = [
    getCurrentUserTeamStreaksQueryValidationMiddleware,
    findCurrentUserTeamStreaksMiddleware,
    retrieveCurrentUserTeamStreaksMembersInformationMiddleware,
    formatCurrentUserTeamStreaksMiddleware,
    sendCurrentUserTeamStreaksMiddleware,
];
