import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const getTeamMemberStreakParamsValidationSchema = {
    teamMemberStreakId: Joi.string().required(),
};

export const getTeamMemberStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        getTeamMemberStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveTeamMemberStreakMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamMemberStreakId } = request.params;
        const teamMemberStreak = await teamMemberStreakModel.findOne({ _id: teamMemberStreakId }).lean();
        if (!teamMemberStreak) {
            throw new CustomError(ErrorType.GetTeamMemberStreakNoTeamMemberStreakFound);
        }
        response.locals.teamMemberStreak = teamMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveTeamMemberStreakMiddleware, err));
    }
};

export const retrieveTeamMemberStreakMiddleware = getRetrieveTeamMemberStreakMiddleware(teamMemberStreakModel);

export const getSendTeamMemberStreakMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamMemberStreak } = response.locals;
        response.status(resourceCreatedResponseCode).send(teamMemberStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamMemberStreakMiddleware, err));
    }
};

export const sendTeamMemberStreakMiddleware = getSendTeamMemberStreakMiddleware(ResponseCodes.success);

export const getOneTeamMemberStreakMiddlewares = [
    getTeamMemberStreakParamsValidationMiddleware,
    retrieveTeamMemberStreakMiddleware,
    sendTeamMemberStreakMiddleware,
];
