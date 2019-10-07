import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';

const groupMemberParamsValidationSchema = {
    teamStreakId: Joi.string().required(),
    memberId: Joi.string().required(),
};

export const groupMemberParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        groupMemberParamsValidationSchema,
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
        const teamStreak = await teamStreakModel.findById(teamStreakId).lean();
        if (!teamStreak) {
            throw new CustomError(ErrorType.NoTeamStreakFound);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteGroupMemberRetreiveTeamStreakMiddleware, err));
    }
};

export const retreiveTeamStreakMiddleware = getRetreiveTeamStreakMiddleware(teamStreakModel);

export const retreiveGroupMemberMiddleware = async (
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
            throw new CustomError(ErrorType.NoGroupMemberFound);
        }
        response.locals.member = member;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveGroupMemberMiddleware, err));
    }
};
export const getDeleteGroupMemberMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
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
        else next(new CustomError(ErrorType.DeleteGroupMemberMiddleware, err));
    }
};

export const deleteGroupMemberMiddleware = getDeleteGroupMemberMiddleware(teamStreakModel);

export const sendGroupMemberDeletedResponseMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        response.status(ResponseCodes.deleted).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendGroupMemberDeletedResponseMiddleware, err));
    }
};

export const deleteGroupMemberMiddlewares = [
    groupMemberParamsValidationMiddleware,
    retreiveTeamStreakMiddleware,
    retreiveGroupMemberMiddleware,
    deleteGroupMemberMiddleware,
    sendGroupMemberDeletedResponseMiddleware,
];
