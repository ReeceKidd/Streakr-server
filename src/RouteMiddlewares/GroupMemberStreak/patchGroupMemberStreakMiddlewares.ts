import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { groupMemberStreakModel, GroupMemberStreakModel } from '../../Models/GroupMemberStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const groupMemberStreakParamsValidationSchema = {
    groupMemberStreakId: Joi.string().required(),
};

export const groupMemberStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        groupMemberStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const groupMemberStreakBodyValidationSchema = {
    timezone: Joi.string(),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
    currentStreak: Joi.object(),
    pastStreaks: Joi.array(),
};

export const groupMemberStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        groupMemberStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchGroupMemberStreakMiddleware = (
    groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { groupMemberStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedGroupMemberStreak = await groupMemberStreakModel.findByIdAndUpdate(
            groupMemberStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedGroupMemberStreak) {
            throw new CustomError(ErrorType.UpdatedGroupMemberStreakNotFound);
        }
        response.locals.updatedGroupMemberStreak = updatedGroupMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchGroupMemberStreakMiddleware, err));
    }
};

export const patchGroupMemberStreakMiddleware = getPatchGroupMemberStreakMiddleware(groupMemberStreakModel);

export const sendUpdatedGroupMemberStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { updatedGroupMemberStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedGroupMemberStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedGroupMemberStreakMiddleware, err));
    }
};

export const patchGroupMemberStreakMiddlewares = [
    groupMemberStreakParamsValidationMiddleware,
    groupMemberStreakRequestBodyValidationMiddleware,
    patchGroupMemberStreakMiddleware,
    sendUpdatedGroupMemberStreakMiddleware,
];
