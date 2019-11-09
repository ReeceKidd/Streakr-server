import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { userModel, UserModel } from '../../Models/User';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';

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

export const getRetreiveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.CreateTeamMemberStreakRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getRetreiveTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
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
        else next(new CustomError(ErrorType.CreateTeamMemberStreakRetreiveTeamStreakMiddleware, err));
    }
};

export const retreiveTeamStreakMiddleware = getRetreiveTeamStreakMiddleware(teamStreakModel);

export const getCreateTeamMemberStreakFromRequestMiddleware = (
    teamMemberStreak: mongoose.Model<TeamMemberStreakModel>,
) => (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { timezone } = response.locals;
        const { userId, teamStreakId } = request.body;
        response.locals.newTeamMemberStreak = new teamMemberStreak({
            userId,
            teamStreakId,
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
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedTeamMemberStreakMiddleware, err));
    }
};

export const createTeamMemberStreakMiddlewares = [
    createTeamMemberStreakBodyValidationMiddleware,
    retreiveUserMiddleware,
    retreiveTeamStreakMiddleware,
    createTeamMemberStreakFromRequestMiddleware,
    saveTeamMemberStreakToDatabaseMiddleware,
    sendFormattedTeamMemberStreakMiddleware,
];
