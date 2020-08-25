import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { userModel, UserModel } from '../../Models/User';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { createTeamMemberStreak } from '../../helpers/createTeamMemberStreak';

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

export const getCreateTeamMemberStreakMiddleware = (createTeamMemberStreakFunction: typeof createTeamMemberStreak) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const { timezone } = response.locals;
        response.locals.teamMemberStreak = createTeamMemberStreakFunction({
            userId: user._id,
            userProfileImage: user.profileImages.originalImageUrl,
            username: user.username,
            timezone,
            streakName: teamStreak.streakName,
            teamStreakId: teamStreak._id,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTeamMemberStreakMiddleware, err));
    }
};

export const createTeamMemberStreakMiddleware = getCreateTeamMemberStreakMiddleware(createTeamMemberStreak);

export const sendFormattedTeamMemberStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamMemberStreak } = response.locals;
        response.status(ResponseCodes.created).send(teamMemberStreak);
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
    createTeamMemberStreakMiddleware,
    sendFormattedTeamMemberStreakMiddleware,
    increaseUsersTotalLiveStreaksByOneMiddleware,
];
