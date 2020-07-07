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
import { sendPushNotification } from '../../helpers/sendPushNotification';
import { JoinedTeamStreakPushNotification } from '@streakoid/streakoid-models/lib/Models/PushNotifications';
import PushNotificationTypes from '@streakoid/streakoid-models/lib/Types/PushNotificationTypes';
import { EndpointDisabledError } from '../../sns';

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
    userId: Joi.string(),
    //Legacy
    teamMemberId: Joi.string(),
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

export const getUserExistsMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const newTeamMember = await userModel
            .findOne({
                _id: userId,
            })
            .lean();
        if (!newTeamMember) {
            throw new CustomError(ErrorType.CreateTeamMemberUserDoesNotExist);
        }
        response.locals.newTeamMember = newTeamMember;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateTeamMemberUserExistsMiddleware, err));
    }
};

export const userExistsMiddleware = getUserExistsMiddleware(userModel);

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

export const preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const newTeamMember: User = response.locals.newTeamMember;
        const teamMemberIsAlreadyInTeamStreak = teamStreak.members.find(
            member => String(member.memberId) === String(newTeamMember._id),
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
        const { userId } = request.body;
        response.locals.teamMemberStreak = await new teamMemberStreak({
            userId: userId,
            teamStreakId,
            timezone,
        }).save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamMemberCreateTeamMemberStreakMiddleware, err));
    }
};

export const createTeamMemberStreakMiddleware = getCreateTeamMemberStreakMiddleware(teamMemberStreakModel);

export const getAddUserToTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const { userId } = request.body;
        const { teamMemberStreak } = response.locals;
        const teamMember: TeamMember = {
            memberId: userId,
            teamMemberStreakId: teamMemberStreak._id,
        };

        await teamStreakModel.findByIdAndUpdate(teamStreakId, {
            $addToSet: { members: teamMember },
        });
        response.locals.teamMember = teamMember;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.AddUserToTeamStreakMiddleware, err));
    }
};

export const addUserToTeamStreakMiddleware = getAddUserToTeamStreakMiddleware(teamStreakModel);

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

export const getNotifyOtherTeamMembersAboutNewTeamMemberMiddleware = (
    sendPush: typeof sendPushNotification,
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const newTeamMember: User = response.locals.newTeamMember;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const title = 'New team member';
        const body = `${newTeamMember.username} joined team streak: ${teamStreak.streakName}`;
        const data: JoinedTeamStreakPushNotification = {
            pushNotificationType: PushNotificationTypes.joinedTeamStreak,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            userId: newTeamMember._id,
            username: newTeamMember.username,
            title,
        };
        await Promise.all(
            teamStreak.members.map(async teamMember => {
                const populatedMember: User | null = await userModel.findById(teamMember.memberId);
                if (!populatedMember) {
                    return;
                }
                const { pushNotification, pushNotifications } = populatedMember;
                const androidEndpointArn = pushNotification.androidEndpointArn;
                const iosEndpointArn = pushNotification.iosEndpointArn;
                const teamStreakUpdatesEnabled =
                    pushNotifications &&
                    pushNotifications.teamStreakUpdates &&
                    pushNotifications.teamStreakUpdates.enabled;
                if (
                    (androidEndpointArn || iosEndpointArn) &&
                    teamStreakUpdatesEnabled &&
                    String(populatedMember._id) !== String(newTeamMember._id)
                ) {
                    try {
                        return sendPush({
                            title,
                            data,
                            body,
                            androidEndpointArn,
                            iosEndpointArn,
                            userId: teamMember.memberId,
                            pushNotificationType: PushNotificationTypes.joinedTeamStreak,
                        });
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
        next(new CustomError(ErrorType.NotifyOtherTeamMembersAboutNewTeamMemberMiddleware, err));
    }
};

export const notifiyOtherTeamMembersAboutNewTeamMemberMiddleware = getNotifyOtherTeamMembersAboutNewTeamMemberMiddleware(
    sendPushNotification,
    userModel,
);

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
    userExistsMiddleware,
    teamStreakExistsMiddleware,
    preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware,
    createTeamMemberStreakMiddleware,
    addUserToTeamStreakMiddleware,
    sendCreateTeamMemberResponseMiddleware,
    notifiyOtherTeamMembersAboutNewTeamMemberMiddleware,
    createJoinedTeamStreakActivityFeedItemMiddleware,
];
