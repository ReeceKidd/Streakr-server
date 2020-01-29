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
    friendId: Joi.string().required(),
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

export const getFriendExistsMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { friendId } = request.body;
        const friend = await userModel
            .findOne({
                _id: friendId,
            })
            .lean();
        if (!friend) {
            throw new CustomError(ErrorType.CreateTeamMemberFriendDoesNotExist);
        }
        response.locals.friend = friend;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateTeamMemberFriendExistsMiddleware, err));
    }
};

export const friendExistsMiddleware = getFriendExistsMiddleware(userModel);

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
        const { friendId } = request.body;
        response.locals.teamMemberStreak = await new teamMemberStreak({
            userId: friendId,
            teamStreakId,
            timezone,
        }).save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamMemberCreateTeamMemberStreakMiddleware, err));
    }
};

export const createTeamMemberStreakMiddleware = getCreateTeamMemberStreakMiddleware(teamMemberStreakModel);

export const getAddFriendToTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const { friendId } = request.body;
        const { teamMemberStreak } = response.locals;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const members: TeamMember[] = [
            ...teamStreak.members,
            {
                memberId: friendId,
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
        next(new CustomError(ErrorType.AddFriendToTeamStreakMiddleware, err));
    }
};

export const addFriendToTeamStreakMiddleware = getAddFriendToTeamStreakMiddleware(teamStreakModel);

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
            streakId: teamStreak._id,
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
    friendExistsMiddleware,
    teamStreakExistsMiddleware,
    createTeamMemberStreakMiddleware,
    addFriendToTeamStreakMiddleware,
    sendCreateTeamMemberResponseMiddleware,
    createJoinedTeamStreakActivityFeedItemMiddleware,
];
