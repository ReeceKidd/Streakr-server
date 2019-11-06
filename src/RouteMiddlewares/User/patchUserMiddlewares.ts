import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User } from '@streakoid/streakoid-sdk/lib';

const userParamsValidationSchema = {
    userId: Joi.string().required(),
};

export const userParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        userParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const userBodyValidationSchema = {
    timezone: Joi.string(),
};

export const userRequestBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        userBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.params;
        const keysToUpdate = request.body;
        const updatedUser = await userModel.findByIdAndUpdate(userId, { ...keysToUpdate }, { new: true }).lean();
        if (!updatedUser) {
            throw new CustomError(ErrorType.UpdatedUserNotFound);
        }
        response.locals.updatedUser = updatedUser;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchUserMiddleware, err));
    }
};

export const patchUserMiddleware = getPatchUserMiddleware(userModel);

export const formatUpdatedUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.updatedUser;
        response.locals.updatedUser = {
            _id: user._id,
            username: user.username,
            isPayingMember: user.membershipInformation.isPayingMember,
            userType: user.userType,
            timezone: user.timezone,
            friends: user.friends,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            profileImages: user.profileImages,
            endpointArn: user.endpointArn,
        };
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FormatUpdatedUserMiddleware, err));
    }
};

export const sendUpdatedUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { updatedUser } = response.locals;
        response.status(ResponseCodes.success).send(updatedUser);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedUserMiddleware, err));
    }
};

export const patchUserMiddlewares = [
    userParamsValidationMiddleware,
    userRequestBodyValidationMiddleware,
    patchUserMiddleware,
    formatUpdatedUserMiddleware,
    sendUpdatedUserMiddleware,
];
