import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';

const getTeamStreakParamsValidationSchema = {
    teamStreakId: Joi.string().required(),
};

export const getTeamStreakInviteParamsValidationMiddleware = (
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
            throw new CustomError(ErrorType.GetTeamStreakInviteNoTeamStreakFound);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetTeamStreakInviteRetrieveTeamStreakMiddleware, err));
    }
};

export const retrieveTeamStreakMiddleware = getRetrieveTeamStreakMiddleware(teamStreakModel);

export const keepInviteLinkIfUserIsApartOfTeamStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const user: User = response.locals.user;
        const userIsApartOfTeamStreak = Boolean(
            teamStreak.members.find(member => String(member.memberId) === String(user._id)),
        );
        response.locals.inviteKey = userIsApartOfTeamStreak ? teamStreak.inviteKey : null;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.KeepInviteLinkIfUserIsApartOfTeamStreak, err));
    }
};

export const sendTeamStreakInviteKeyMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { inviteKey } = response.locals;
        response.status(ResponseCodes.success).send({ inviteKey });
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamStreakInviteKeyMiddleware, err));
    }
};

export const getTeamStreakInviteKeyMiddlewares = [
    getTeamStreakInviteParamsValidationMiddleware,
    retrieveTeamStreakMiddleware,
    keepInviteLinkIfUserIsApartOfTeamStreakMiddleware,
    sendTeamStreakInviteKeyMiddleware,
];
