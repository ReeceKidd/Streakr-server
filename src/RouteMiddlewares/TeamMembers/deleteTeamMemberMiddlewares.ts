import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const teamMemberParamsValidationSchema = {
    teamStreakId: Joi.string().required(),
    memberId: Joi.string().required(),
};

export const teamMemberParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        teamMemberParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const checkCurrentUserIsPartOfTeamStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const user: User = response.locals.user;
        const currentUserIsApartOfTeamStreak = Boolean(teamStreak.members.find(member => member.memberId === user._id));
        if (!currentUserIsApartOfTeamStreak) {
            throw new CustomError(ErrorType.CannotDeleteTeamMemberUserIsNotApartOfTeamStreak);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CheckCurrentUserIsPartOfTeamStreakMiddleware, err));
    }
};

export const getRetrieveTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const teamStreak = await teamStreakModel.findById(teamStreakId).lean();
        if (!teamStreak) {
            throw new CustomError(ErrorType.NoTeamStreakFound);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteTeamMemberRetrieveTeamStreakMiddleware, err));
    }
};

export const retrieveTeamStreakMiddleware = getRetrieveTeamStreakMiddleware(teamStreakModel);

export const retrieveTeamMemberMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { memberId } = request.params;
        const { teamStreak } = response.locals;
        const { members } = teamStreak;
        const member = members.find((member: { memberId: string }) => {
            return member.memberId === memberId;
        });
        if (!member) {
            throw new CustomError(ErrorType.NoTeamMemberFound);
        }
        response.locals.member = member;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveTeamMemberMiddleware, err));
    }
};
export const getDeleteTeamMemberMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { memberId, teamStreakId } = request.params;
        const { teamStreak } = response.locals;
        let { members } = teamStreak;
        members = members.filter((member: { memberId: string }) => {
            return member.memberId !== memberId;
        });
        await teamStreakModel.findByIdAndUpdate(teamStreakId, { members }, { new: true }).lean();
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteTeamMemberMiddleware, err));
    }
};

export const deleteTeamMemberMiddleware = getDeleteTeamMemberMiddleware(teamStreakModel);

export const sendTeamMemberDeletedResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        response.status(ResponseCodes.deleted).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamMemberDeletedResponseMiddleware, err));
    }
};

export const deleteTeamMemberMiddlewares = [
    teamMemberParamsValidationMiddleware,
    retrieveTeamStreakMiddleware,
    checkCurrentUserIsPartOfTeamStreakMiddleware,
    retrieveTeamMemberMiddleware,
    deleteTeamMemberMiddleware,
    sendTeamMemberDeletedResponseMiddleware,
];
