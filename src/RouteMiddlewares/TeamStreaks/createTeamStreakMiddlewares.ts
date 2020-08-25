import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { userModel, UserModel } from '../../Models/User';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { PopulatedTeamStreak } from '@streakoid/streakoid-models/lib/Models/PopulatedTeamStreak';
import shortid from 'shortid';
import TeamVisibilityTypes from '@streakoid/streakoid-models/lib/Types/TeamVisibilityTypes';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { createTeamMemberStreak } from '../../helpers/createTeamMemberStreak';

export interface TeamStreakRegistrationRequestBody {
    creatorId: string;
    streakName: string;
    streakDescription: string;
    numberOfMinutes: number;
    members: { memberId: string; teamMemberStreakId: string }[];
    visibility: TeamVisibilityTypes;
}

const member = Joi.object().keys({
    memberId: Joi.string().required(),
    teamMemberStreakId: Joi.string(),
});

const createTeamStreakBodyValidationSchema = {
    creatorId: Joi.string().required(),
    streakName: Joi.string().required(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number().positive(),
    members: Joi.array()
        .min(1)
        .items(member),
    visibility: Joi.string().valid(Object.keys(TeamVisibilityTypes)),
};

export const createTeamStreakBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createTeamStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getCreateTeamStreakMiddleware = (teamStreak: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { timezone } = response.locals;
        const { creatorId, streakName, streakDescription, numberOfMinutes, visibility } = request.body;
        response.locals.teamStreak = await new teamStreak({
            creatorId,
            streakName,
            streakDescription,
            numberOfMinutes,
            timezone,
            visibility,
        }).save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamStreakMiddleware, err));
    }
};

export const createTeamStreakMiddleware = getCreateTeamStreakMiddleware(teamStreakModel);

export const getAddInviteKeyToTeamStreakMiddleware = ({
    generatedInviteKey,
    teamStreakModel,
}: {
    generatedInviteKey: string;
    teamStreakModel: mongoose.Model<TeamStreakModel>;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamStreak: PopulatedTeamStreak = response.locals.teamStreak;
        response.locals.teamStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreak._id,
            { $set: { inviteKey: generatedInviteKey } },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.AddInviteKeyToTeamStreakMiddleware, err));
    }
};

export const addInviteKeyToTeamStreakMiddleware = getAddInviteKeyToTeamStreakMiddleware({
    generatedInviteKey: shortid.generate(),
    teamStreakModel,
});

export const getCreateTeamMemberStreaksMiddleware = (
    userModel: mongoose.Model<UserModel>,
    createTeamMemberStreakFunction: typeof createTeamMemberStreak,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const { timezone } = response.locals;
        const { members } = request.body;

        const membersWithTeamMemberStreakIds = await Promise.all(
            members.map(async (member: { memberId: string }) => {
                const memberInfo = await userModel.findOne({ _id: member.memberId });
                if (!memberInfo) {
                    throw new CustomError(ErrorType.TeamMemberDoesNotExist);
                }

                const newTeamMemberStreak = await createTeamMemberStreakFunction({
                    userId: user._id,
                    userProfileImage: user.profileImages.originalImageUrl,
                    teamStreakId: teamStreak._id,
                    username: user.username,
                    streakName: teamStreak.streakName,
                    timezone,
                });

                return {
                    memberId: member.memberId,
                    teamMemberStreakId: newTeamMemberStreak._id,
                };
            }),
        );

        response.locals.membersWithTeamMemberStreakIds = membersWithTeamMemberStreakIds;

        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.CreateTeamStreakCreateMemberStreakMiddleware, err));
    }
};

export const createTeamMemberStreaksMiddleware = getCreateTeamMemberStreaksMiddleware(
    userModel,
    createTeamMemberStreak,
);

export const getUpdateTeamStreakMembersArray = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { membersWithTeamMemberStreakIds, teamStreak } = response.locals;

        response.locals.teamStreak = await teamStreakModel
            .findByIdAndUpdate(
                teamStreak._id,
                {
                    members: membersWithTeamMemberStreakIds,
                },
                { new: true },
            )
            .lean();

        next();
    } catch (err) {
        next(new CustomError(ErrorType.UpdateTeamStreakMembersArray, err));
    }
};

export const updateTeamStreakMembersArrayMiddleware = getUpdateTeamStreakMembersArray(teamStreakModel);

export const getPopulateTeamStreakMembersInformationMiddleware = (
    userModel: mongoose.Model<UserModel>,
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamStreak } = response.locals;
        const { members } = teamStreak;
        teamStreak.members = await Promise.all(
            members.map(async (member: { memberId: string; teamMemberStreakId: string }) => {
                const [memberInfo, teamMemberStreak] = await Promise.all([
                    userModel.findOne({ _id: member.memberId }).lean(),
                    teamMemberStreakModel.findOne({ _id: member.teamMemberStreakId }).lean(),
                ]);
                return {
                    _id: memberInfo._id,
                    username: memberInfo.username,
                    teamMemberStreak,
                };
            }),
        );
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.PopulateTeamStreakMembersInformation, err));
    }
};

export const populateTeamStreakMembersInformationMiddleware = getPopulateTeamStreakMembersInformationMiddleware(
    userModel,
    teamMemberStreakModel,
);

export const getRetrieveCreatedTeamStreakCreatorInformationMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamStreak } = response.locals;
        const { creatorId } = teamStreak;
        const creator = await userModel.findOne({ _id: creatorId }).lean();
        teamStreak.creator = {
            _id: creator._id,
            username: creator.username,
        };
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RetrieveCreatedTeamStreakCreatorInformationMiddleware, err));
    }
};

export const retrieveCreatedTeamStreakCreatorInformationMiddleware = getRetrieveCreatedTeamStreakCreatorInformationMiddleware(
    userModel,
);

export const getIncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware = (
    userModel: mongoose.Model<UserModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamStreak: PopulatedTeamStreak = response.locals.teamStreak;
        const { members } = teamStreak;
        await Promise.all(
            members.map(member => {
                return userModel.findByIdAndUpdate(member._id, { $inc: { totalLiveStreaks: 1 } });
            }),
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware, err));
    }
};

export const increaseTeamStreakMembersTotalLiveStreaksByOneMiddleware = getIncreaseTeamStreakMembersTotalLiveStreaksByOneMiddleware(
    userModel,
);

export const getCreateTeamStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: PopulatedTeamStreak = response.locals.teamStreak;
        const createdTeamStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.createdTeamStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
        };
        await createActivityFeedItemFunction(createdTeamStreakActivityFeedItem);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createdTeamStreakActivityFeedItemMiddleware = getCreateTeamStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const sendTeamStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { teamStreak } = response.locals;
        response.status(ResponseCodes.created).send(teamStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedTeamStreakMiddleware, err));
    }
};

export const createTeamStreakMiddlewares = [
    createTeamStreakBodyValidationMiddleware,
    createTeamStreakMiddleware,
    addInviteKeyToTeamStreakMiddleware,
    createTeamMemberStreaksMiddleware,
    updateTeamStreakMembersArrayMiddleware,
    populateTeamStreakMembersInformationMiddleware,
    retrieveCreatedTeamStreakCreatorInformationMiddleware,
    increaseTeamStreakMembersTotalLiveStreaksByOneMiddleware,
    createdTeamStreakActivityFeedItemMiddleware,
    sendTeamStreakMiddleware,
];
