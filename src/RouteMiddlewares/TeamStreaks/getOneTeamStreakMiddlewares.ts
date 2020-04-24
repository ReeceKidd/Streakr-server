import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { userModel, UserModel } from '../../Models/User';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';

const getTeamStreakParamsValidationSchema = {
    teamStreakId: Joi.string().required(),
};

export const getTeamStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        getTeamStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const teamStreak = await teamStreakModel.findOne({ _id: teamStreakId }).lean();
        if (!teamStreak) {
            throw new CustomError(ErrorType.GetTeamStreakNoTeamStreakFound);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveTeamStreakMiddleware, err));
    }
};

export const retrieveTeamStreakMiddleware = getRetrieveTeamStreakMiddleware(teamStreakModel);

export const getRetrieveTeamStreakMembersInformationMiddleware = (
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
                    profileImage: memberInfo.profileImages.originalImageUrl,
                    teamMemberStreak,
                };
            }),
        );

        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RetrieveTeamStreakMembersInformation, err));
    }
};

export const retrieveTeamStreakMembersInformationMiddleware = getRetrieveTeamStreakMembersInformationMiddleware(
    userModel,
    teamMemberStreakModel,
);

export const getRetrieveTeamStreakCreatorInformationMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
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
        next(new CustomError(ErrorType.RetrieveTeamStreakCreatorInformationMiddleware, err));
    }
};

export const retrieveTeamStreakCreatorInformationMiddleware = getRetrieveTeamStreakCreatorInformationMiddleware(
    userModel,
);

export const getSendTeamStreakMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamStreak } = response.locals;
        response.status(resourceCreatedResponseCode).send(teamStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamStreakMiddleware, err));
    }
};

export const sendTeamStreakMiddleware = getSendTeamStreakMiddleware(ResponseCodes.success);

export const getOneTeamStreakMiddlewares = [
    getTeamStreakParamsValidationMiddleware,
    retrieveTeamStreakMiddleware,
    retrieveTeamStreakMembersInformationMiddleware,
    retrieveTeamStreakCreatorInformationMiddleware,
    sendTeamStreakMiddleware,
];
