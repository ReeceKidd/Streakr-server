import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';

const teamStreakParamsValidationSchema = {
    teamStreakId: Joi.string().required(),
};

export const teamStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        teamStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const teamStreakBodyValidationSchema = {
    creatorId: Joi.string(),
    streakName: Joi.string(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number(),
    timezone: Joi.string(),
    currentStreak: Joi.object(),
    pastStreaks: Joi.array(),
    status: Joi.string().valid(Object.keys(StreakStatus)),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
};

export const teamStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        teamStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedTeamStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedTeamStreak) {
            throw new CustomError(ErrorType.UpdatedTeamStreakNotFound);
        }
        response.locals.updatedTeamStreak = updatedTeamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchTeamStreakMiddleware, err));
    }
};

export const patchTeamStreakMiddleware = getPatchTeamStreakMiddleware(teamStreakModel);

export const sendUpdatedTeamStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { updatedTeamStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedTeamStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedTeamStreakMiddleware, err));
    }
};

export const patchTeamStreakMiddlewares = [
    teamStreakParamsValidationMiddleware,
    teamStreakRequestBodyValidationMiddleware,
    patchTeamStreakMiddleware,
    sendUpdatedTeamStreakMiddleware,
];
