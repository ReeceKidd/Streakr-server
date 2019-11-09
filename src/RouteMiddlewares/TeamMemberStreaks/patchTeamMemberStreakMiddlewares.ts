import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const teamMemberStreakParamsValidationSchema = {
    teamMemberStreakId: Joi.string().required(),
};

export const teamMemberStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        teamMemberStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const teamMemberStreakBodyValidationSchema = {
    timezone: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    currentStreak: Joi.object(),
    pastStreaks: Joi.array(),
};

export const teamMemberStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        teamMemberStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchTeamMemberStreakMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamMemberStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedTeamMemberStreak = await teamMemberStreakModel.findByIdAndUpdate(
            teamMemberStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedTeamMemberStreak) {
            throw new CustomError(ErrorType.UpdatedTeamMemberStreakNotFound);
        }
        response.locals.updatedTeamMemberStreak = updatedTeamMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchTeamMemberStreakMiddleware, err));
    }
};

export const patchTeamMemberStreakMiddleware = getPatchTeamMemberStreakMiddleware(teamMemberStreakModel);

export const sendUpdatedTeamMemberStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { updatedTeamMemberStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedTeamMemberStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedTeamMemberStreakMiddleware, err));
    }
};

export const patchTeamMemberStreakMiddlewares = [
    teamMemberStreakParamsValidationMiddleware,
    teamMemberStreakRequestBodyValidationMiddleware,
    patchTeamMemberStreakMiddleware,
    sendUpdatedTeamMemberStreakMiddleware,
];
