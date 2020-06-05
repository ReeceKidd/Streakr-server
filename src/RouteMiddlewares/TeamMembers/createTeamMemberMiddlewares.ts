import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';

import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { TeamMember } from '@streakoid/streakoid-models/lib/Models/TeamMember';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';

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

export const preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const { followerId } = request.body;
        const teamMemberIsAlreadyInTeamStreak = teamStreak.members.find(
            member => String(member.memberId) === String(followerId),
        );
        if (teamMemberIsAlreadyInTeamStreak) {
            throw new CustomError(ErrorType.TeamMemberIsAlreadyInTeamStreak);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PreventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware, err));
    }
};

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
        const teamMember: TeamMember = {
            memberId: followerId,
            teamMemberStreakId: teamMemberStreak._id,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, {
            $addToSet: { members: teamMember },
        });
        response.locals.teamMember = teamMember;
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
        const { teamMember } = response.locals;
        response.status(ResponseCodes.created).send(teamMember);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendCreateTeamMemberResponseMiddleware, err));
    }
};

export const getCreateJoinedTeamStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const joinedTeamStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.joinedTeamStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
        };
        await createActivityFeedItemFunction(joinedTeamStreakActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreateJoinedTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createJoinedTeamStreakActivityFeedItemMiddleware = getCreateJoinedTeamStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const createTeamMemberMiddlewares = [
    createTeamMemberParamsValidationMiddleware,
    createTeamMemberBodyValidationMiddleware,
    followerExistsMiddleware,
    teamStreakExistsMiddleware,
    preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware,
    createTeamMemberStreakMiddleware,
    addFollowerToTeamStreakMiddleware,
    sendCreateTeamMemberResponseMiddleware,
    createJoinedTeamStreakActivityFeedItemMiddleware,
];
