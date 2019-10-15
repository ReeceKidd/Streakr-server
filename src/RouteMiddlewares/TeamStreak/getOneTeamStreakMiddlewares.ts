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

export const getRetreiveTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
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
        else next(new CustomError(ErrorType.RetreiveTeamStreakMiddleware, err));
    }
};

export const retreiveTeamStreakMiddleware = getRetreiveTeamStreakMiddleware(teamStreakModel);

export const getRetreiveTeamStreakMembersInformationMiddleware = (
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
        next(new CustomError(ErrorType.RetreiveTeamStreakMembersInformation, err));
    }
};

export const retreiveTeamStreakMembersInformationMiddleware = getRetreiveTeamStreakMembersInformationMiddleware(
    userModel,
    teamMemberStreakModel,
);

export const getRetreiveTeamStreakCreatorInformationMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        next(new CustomError(ErrorType.RetreiveTeamStreakCreatorInformationMiddleware, err));
    }
};

export const retreiveTeamStreakCreatorInformationMiddleware = getRetreiveTeamStreakCreatorInformationMiddleware(
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
    retreiveTeamStreakMiddleware,
    retreiveTeamStreakMembersInformationMiddleware,
    retreiveTeamStreakCreatorInformationMiddleware,
    sendTeamStreakMiddleware,
];
