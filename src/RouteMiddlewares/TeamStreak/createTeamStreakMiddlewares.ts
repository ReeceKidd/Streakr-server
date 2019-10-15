import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { userModel, UserModel } from '../../Models/User';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';

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
        const { creatorId, teamStreakType, streakName, streakDescription, numberOfMinutes } = request.body;
        response.locals.newTeamStreak = await new teamStreak({
            creatorId,
            teamStreakType,
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
                const memberExists = await userModel.findOne({ _id: member.memberId });
                if (!memberExists) {
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

export const getRetreiveCreatedTeamStreakCreatorInformationMiddleware = (
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
        next(new CustomError(ErrorType.RetreiveCreatedTeamStreakCreatorInformationMiddleware, err));
    }
};

export const retreiveCreatedTeamStreakCreatorInformationMiddleware = getRetreiveCreatedTeamStreakCreatorInformationMiddleware(
    userModel,
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
    retreiveCreatedTeamStreakCreatorInformationMiddleware,
    sendTeamStreakMiddleware,
];
