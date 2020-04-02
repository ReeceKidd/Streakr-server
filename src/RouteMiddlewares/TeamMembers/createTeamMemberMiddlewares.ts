import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';

import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { TeamMember, TeamStreak, User, ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';
import { ActivityFeedItemModel, activityFeedItemModel } from '../../../src/Models/ActivityFeedItem';
export const createTeamMemberParamsValidationSchema = {
    teamStreakId: Joi.string().required(),
};

export const createTeamMemberParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        createTeamMemberParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const createTeamMemberBodyValidationSchema = {
    followerId: Joi.string().required(),
};

export const createTeamMemberBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createTeamMemberBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFollowerExistsMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { followerId } = request.body;
        const follower = await userModel
            .findOne({
                _id: followerId,
            })
            .lean();
        if (!follower) {
            throw new CustomError(ErrorType.CreateTeamMemberFollowerDoesNotExist);
        }
        response.locals.follower = follower;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateTeamMemberFollowerExistsMiddleware, err));
    }
};

export const followerExistsMiddleware = getFollowerExistsMiddleware(userModel);

export const getTeamStreakExistsMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const teamStreak = await teamStreakModel
            .findOne({
                _id: teamStreakId,
            })
            .lean();
        if (!teamStreak) {
            throw new CustomError(ErrorType.CreateTeamMemberTeamStreakDoesNotExist);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateTeamMemberTeamStreakExistsMiddleware, err));
    }
};

export const teamStreakExistsMiddleware = getTeamStreakExistsMiddleware(teamStreakModel);

export const getCreateTeamMemberStreakMiddleware = (teamMemberStreak: mongoose.Model<TeamMemberStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { timezone } = response.locals;
        const { teamStreakId } = request.params;
        const { followerId } = request.body;
        response.locals.teamMemberStreak = await new teamMemberStreak({
            userId: followerId,
            teamStreakId,
            timezone,
        }).save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamMemberCreateTeamMemberStreakMiddleware, err));
    }
};

export const createTeamMemberStreakMiddleware = getCreateTeamMemberStreakMiddleware(teamMemberStreakModel);

export const getAddFollowerToTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const { followerId } = request.body;
        const { teamMemberStreak } = response.locals;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const members: TeamMember[] = [
            ...teamStreak.members,
            {
                memberId: followerId,
                teamMemberStreakId: teamMemberStreak._id,
            },
        ];
        const updatedTeamStreak = await teamStreakModel
            .findByIdAndUpdate(
                teamStreakId,
                {
                    members,
                },
                { new: true },
            )
            .lean();
        response.locals.teamStreak = updatedTeamStreak;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.AddFollowerToTeamStreakMiddleware, err));
    }
};

export const addFollowerToTeamStreakMiddleware = getAddFollowerToTeamStreakMiddleware(teamStreakModel);

export const sendCreateTeamMemberResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamStreak } = response.locals;
        response.status(ResponseCodes.created).send(teamStreak.members);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendCreateTeamMemberResponseMiddleware, err));
    }
};

export const getCreateJoinedTeamStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const newActivity = new activityFeedItemModel({
            activityFeedItemType: ActivityFeedItemTypes.joinedTeamStreak,
            userId: user._id,
            subjectId: teamStreak._id,
        });
        await newActivity.save();
    } catch (err) {
        next(new CustomError(ErrorType.CreateJoinedTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createJoinedTeamStreakActivityFeedItemMiddleware = getCreateJoinedTeamStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const createTeamMemberMiddlewares = [
    createTeamMemberParamsValidationMiddleware,
    createTeamMemberBodyValidationMiddleware,
    followerExistsMiddleware,
    teamStreakExistsMiddleware,
    createTeamMemberStreakMiddleware,
    addFollowerToTeamStreakMiddleware,
    sendCreateTeamMemberResponseMiddleware,
    createJoinedTeamStreakActivityFeedItemMiddleware,
];
