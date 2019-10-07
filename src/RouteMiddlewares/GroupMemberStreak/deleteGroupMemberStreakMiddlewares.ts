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

export const getDeleteGroupMemberStreakMiddleware = (
    groupMemberStreakModel: mongoose.Model<GroupMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { groupMemberStreakId } = request.params;
        const deletedGroupMemberStreak = await groupMemberStreakModel.findByIdAndDelete(groupMemberStreakId);
        if (!deletedGroupMemberStreak) {
            throw new CustomError(ErrorType.NoGroupMemberStreakToDeleteFound);
        }
        response.locals.deletedGroupMemberStreak = deletedGroupMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DeleteGroupMemberStreakMiddleware, err));
    }
};

export const deleteGroupMemberStreakMiddleware = getDeleteGroupMemberStreakMiddleware(groupMemberStreakModel);

export const getSendGroupMemberStreakDeletedResponseMiddleware = (successfulDeletetionResponseCode: ResponseCodes) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        response.status(successfulDeletetionResponseCode).send();
    } catch (err) {
        next(new CustomError(ErrorType.SendGroupMemberStreakDeletedResponseMiddleware, err));
    }
};

export const sendGroupMemberStreakDeletedResponseMiddleware = getSendGroupMemberStreakDeletedResponseMiddleware(
    ResponseCodes.deleted,
);

export const deleteGroupMemberStreakMiddlewares = [
    groupMemberStreakParamsValidationMiddleware,
    deleteGroupMemberStreakMiddleware,
    sendGroupMemberStreakDeletedResponseMiddleware,
];
