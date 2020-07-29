import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { userModel, UserModel } from '../../Models/User';
import { TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { teamMemberStreakModel } from '../../Models/TeamMemberStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { PopulatedTeamMember } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamMember';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { GetAllTeamStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamStreaks';

const getTeamStreaksQueryValidationSchema = {
    creatorId: Joi.string(),
    memberId: Joi.string(),
    timezone: Joi.string(),
    status: Joi.string().valid(Object.keys(StreakStatus)),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    sortField: Joi.string(),
};

export const getTeamStreaksQueryValidationMiddleware = (
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

export const getFindTeamStreaksMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { creatorId, memberId, timezone, status, completedToday, active, sortField } = request.query;
        const query: {
            creatorId?: string;
            ['members.memberId']?: string;
            timezone?: string;
            status?: string;
            completedToday?: boolean;
            active?: boolean;
            sortField?: string;
        } = {};

        if (creatorId) {
            query.creatorId = creatorId;
        }
        if (memberId) {
            query['members.memberId'] = memberId;
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
                .lean();
        } else if (sortField === GetAllTeamStreaksSortFields.longestTeamStreak) {
            response.locals.teamStreaks = await teamStreakModel
                .find(query)
                .sort({ 'longestTeamStreak.numberOfDays': -1 })
                .lean();
        } else {
            response.locals.teamStreaks = await teamStreakModel.find(query).lean();
        }

        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindTeamStreaksMiddleware, err));
    }
};

export const findTeamStreaksMiddleware = getFindTeamStreaksMiddleware(teamStreakModel);

export const getRetrieveTeamStreaksMembersInformationMiddleware = (
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
                            const memberInfo = await userModel.findOne({ _id: member.memberId }).lean();
                            const teamMemberStreak = await teamMemberStreakModel
                                .findOne({ _id: member.teamMemberStreakId })
                                .lean();
                            if (!memberInfo) {
                                return;
                            }
                            return {
                                _id: memberInfo && memberInfo._id,
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
        next(new CustomError(ErrorType.RetrieveTeamStreaksMembersInformation, err));
    }
};

export const retrieveTeamStreaksMembersInformationMiddleware = getRetrieveTeamStreaksMembersInformationMiddleware(
    userModel,
    teamMemberStreakModel,
);

export const formatTeamStreaksMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const teamStreaks: TeamStreak[] = response.locals.teamStreaks;
        response.locals.teamStreaks = teamStreaks.map(teamStreak => ({ ...teamStreak, inviteKey: undefined }));
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormatTeamStreaksMiddleware, err));
    }
};

export const sendTeamStreaksMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { teamStreaks } = response.locals;
        response.status(ResponseCodes.success).send(teamStreaks);
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamStreaksMiddleware, err));
    }
};

export const getAllTeamStreaksMiddlewares = [
    getTeamStreaksQueryValidationMiddleware,
    findTeamStreaksMiddleware,
    retrieveTeamStreaksMembersInformationMiddleware,
    formatTeamStreaksMiddleware,
    sendTeamStreaksMiddleware,
];
