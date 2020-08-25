import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { userModel, UserModel } from '../../Models/User';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';

export interface TeamMemberStreakRegistrationRequestBody {
    userId: string;
    teamStreakId: string;
}

const createTeamMemberStreakBodyValidationSchema = {
    userId: Joi.string().required(),
    teamStreakId: Joi.string().required(),
};

export const createTeamMemberStreakBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createTeamMemberStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.CreateTeamMemberStreakUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateTeamMemberStreakRetrieveUserMiddleware, err));
    }
};

export const retrieveUserMiddleware = getRetrieveUserMiddleware(userModel);

export const getRetrieveTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.body;
        const teamStreak = await teamStreakModel.findOne({ _id: teamStreakId });
        if (!teamStreak) {
            throw new CustomError(ErrorType.CreateTeamMemberStreakTeamStreakDoesNotExist);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateTeamMemberStreakRetrieveTeamStreakMiddleware, err));
    }
};

export const retrieveTeamStreakMiddleware = getRetrieveTeamStreakMiddleware(teamStreakModel);

export const getCreateTeamMemberStreakFromRequestMiddleware = (
    teamMemberStreak: mongoose.Model<TeamMemberStreakModel>,
) => (request: Request, response: Response, next: NextFunction): void => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const { timezone } = response.locals;
        const { userId } = request.body;
        response.locals.newTeamMemberStreak = new teamMemberStreak({
            userId,
            teamStreakId: teamStreak._id,
            streakName: teamStreak.streakName,
            timezone,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamMemberStreakFromRequestMiddleware, err));
    }
};

export const createTeamMemberStreakFromRequestMiddleware = getCreateTeamMemberStreakFromRequestMiddleware(
    teamMemberStreakModel,
);

export const saveTeamMemberStreakToDatabaseMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const newTeamMemberStreak: TeamMemberStreakModel = response.locals.newTeamMemberStreak;
        response.locals.savedTeamMemberStreak = await newTeamMemberStreak.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveTeamMemberStreakToDatabaseMiddleware, err));
    }
};

export const sendFormattedTeamMemberStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { savedTeamMemberStreak } = response.locals;
        response.status(ResponseCodes.created).send(savedTeamMemberStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedTeamMemberStreakMiddleware, err));
    }
};

export const getIncreaseUsersTotalLiveStreaksByOneMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        await userModel.findByIdAndUpdate(userId, { $inc: { totalLiveStreaks: 1 } });
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamMemberStreakIncreaseUsersTotalLiveStreaksByOneMiddleware, err));
    }
};

export const increaseUsersTotalLiveStreaksByOneMiddleware = getIncreaseUsersTotalLiveStreaksByOneMiddleware(userModel);

export const createTeamMemberStreakMiddlewares = [
    createTeamMemberStreakBodyValidationMiddleware,
    retrieveUserMiddleware,
    retrieveTeamStreakMiddleware,
    createTeamMemberStreakFromRequestMiddleware,
    saveTeamMemberStreakToDatabaseMiddleware,
    sendFormattedTeamMemberStreakMiddleware,
    increaseUsersTotalLiveStreaksByOneMiddleware,
];
