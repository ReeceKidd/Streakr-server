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

export const getDeleteTeamMemberStreakMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamMemberStreakId } = request.params;
        const deletedTeamMemberStreak = await teamMemberStreakModel.findByIdAndDelete(teamMemberStreakId);
        if (!deletedTeamMemberStreak) {
            throw new CustomError(ErrorType.NoTeamMemberStreakToDeleteFound);
        }
        response.locals.deletedTeamMemberStreak = deletedTeamMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteTeamMemberStreakMiddleware, err));
    }
};

export const deleteTeamMemberStreakMiddleware = getDeleteTeamMemberStreakMiddleware(teamMemberStreakModel);

export const getSendTeamMemberStreakDeletedResponseMiddleware = (successfulDeletetionResponseCode: ResponseCodes) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        response.status(successfulDeletetionResponseCode).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendTeamMemberStreakDeletedResponseMiddleware, err));
    }
};

export const sendTeamMemberStreakDeletedResponseMiddleware = getSendTeamMemberStreakDeletedResponseMiddleware(
    ResponseCodes.deleted,
);

export const deleteTeamMemberStreakMiddlewares = [
    teamMemberStreakParamsValidationMiddleware,
    deleteTeamMemberStreakMiddleware,
    sendTeamMemberStreakDeletedResponseMiddleware,
];
