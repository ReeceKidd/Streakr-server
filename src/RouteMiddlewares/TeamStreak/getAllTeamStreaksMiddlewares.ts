import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { userModel, UserModel } from '../../Models/User';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { TeamStreak, TeamMemberStreak } from '@streakoid/streakoid-sdk/lib';
import { teamMemberStreakModel } from '../../Models/TeamMemberStreak';

const getTeamStreaksQueryValidationSchema = {
    creatorId: Joi.string(),
    memberId: Joi.string(),
    timezone: Joi.string(),
    status: Joi.string().valid(Object.keys(StreakStatus)),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
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
        const { creatorId, memberId, timezone, status, completedToday, active } = request.query;
        const query: {
            creatorId?: string;
            ['members.memberId']?: string;
            timezone?: string;
            status?: string;
            completedToday?: boolean;
            active?: boolean;
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

        response.locals.teamStreaks = await teamStreakModel.find(query).lean();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindTeamStreaksMiddleware, err));
    }
};

export const findTeamStreaksMiddleware = getFindTeamStreaksMiddleware(teamStreakModel);

export const getRetreiveTeamStreaksMembersInformationMiddleware = (
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
                        }): Promise<
                            { _id: string; username: string; teamMemberStreak: TeamMemberStreak } | undefined
                        > => {
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
        next(new CustomError(ErrorType.RetreiveTeamStreaksMembersInformation, err));
    }
};

export const retreiveTeamStreaksMembersInformationMiddleware = getRetreiveTeamStreaksMembersInformationMiddleware(
    userModel,
    teamMemberStreakModel,
);

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
    retreiveTeamStreaksMembersInformationMiddleware,
    sendTeamStreaksMiddleware,
];
