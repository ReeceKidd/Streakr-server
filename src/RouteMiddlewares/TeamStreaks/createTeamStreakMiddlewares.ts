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

export interface TeamStreakRegistrationRequestBody {
    creatorId: string;
    streakName: string;
    streakDescription: string;
    numberOfMinutes: number;
    members: { memberId: string; teamMemberStreakId: string }[];
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
        const { creatorId, streakName, streakDescription, numberOfMinutes } = request.body;
        response.locals.newTeamStreak = await new teamStreak({
            creatorId,
            streakName,
            streakDescription,
            numberOfMinutes,
            timezone,
        }).save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamStreakMiddleware, err));
    }
};

export const createTeamStreakMiddleware = getCreateTeamStreakMiddleware(teamStreakModel);

export const getCreateTeamMemberStreaksMiddleware = (
    userModel: mongoose.Model<UserModel>,
    teamMemberStreak: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { timezone, newTeamStreak } = response.locals;
        const { members } = request.body;

        const membersWithTeamMemberStreakIds = await Promise.all(
            members.map(async (member: { memberId: string }) => {
                const memberInfo = await userModel.findOne({ _id: member.memberId });
                if (!memberInfo) {
                    throw new CustomError(ErrorType.TeamMemberDoesNotExist);
                }

                const newTeamMemberStreak = await new teamMemberStreak({
                    userId: member.memberId,
                    teamStreakId: newTeamStreak._id,
                    timezone,
                }).save();

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

export const createTeamMemberStreaksMiddleware = getCreateTeamMemberStreaksMiddleware(userModel, teamMemberStreakModel);

export const getUpdateTeamStreakMembersArray = (teamStreak: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { membersWithTeamMemberStreakIds, newTeamStreak } = response.locals;

        response.locals.newTeamStreak = await teamStreak
            .findByIdAndUpdate(
                newTeamStreak._id,
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
        const { newTeamStreak } = response.locals;
        const { members } = newTeamStreak;
        newTeamStreak.members = await Promise.all(
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
        response.locals.newTeamStreak = newTeamStreak;
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
        const { newTeamStreak } = response.locals;
        const { creatorId } = newTeamStreak;
        const creator = await userModel.findOne({ _id: creatorId }).lean();
        newTeamStreak.creator = {
            _id: creator._id,
            username: creator.username,
        };
        response.locals.newTeamStreak = newTeamStreak;
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
        const newTeamStreak: PopulatedTeamStreak = response.locals.newTeamStreak;
        const { members } = newTeamStreak;
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

export const getAddInviteKeyToTeamStreakMiddleware = ({
    generatedInviteKey,
    teamStreakModel,
}: {
    generatedInviteKey: string;
    teamStreakModel: mongoose.Model<TeamStreakModel>;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const newTeamStreak: PopulatedTeamStreak = response.locals.newTeamStreak;
        response.locals.newTeamStreak = await teamStreakModel.findByIdAndUpdate(
            newTeamStreak._id,
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

export const getCreateTeamStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: PopulatedTeamStreak = response.locals.newTeamStreak;
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
        const { newTeamStreak } = response.locals;
        response.status(ResponseCodes.created).send(newTeamStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedTeamStreakMiddleware, err));
    }
};

export const createTeamStreakMiddlewares = [
    createTeamStreakBodyValidationMiddleware,
    createTeamStreakMiddleware,
    createTeamMemberStreaksMiddleware,
    updateTeamStreakMembersArrayMiddleware,
    populateTeamStreakMembersInformationMiddleware,
    retrieveCreatedTeamStreakCreatorInformationMiddleware,
    increaseTeamStreakMembersTotalLiveStreaksByOneMiddleware,
    addInviteKeyToTeamStreakMiddleware,
    createdTeamStreakActivityFeedItemMiddleware,
    sendTeamStreakMiddleware,
];
