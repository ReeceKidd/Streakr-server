import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel, UserModel } from '../../Models/User';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { User, CurrentUser } from '@streakoid/streakoid-sdk/lib';

const userBodyValidationSchema = {
    email: Joi.string().email(),
    notifications: Joi.object({
        completeStreaksReminder: Joi.object({
            emailNotification: Joi.boolean(),
            pushNotification: Joi.boolean(),
            reminderTime: Joi.number().valid([18, 19, 20, 21, 22, 23]),
        }),
        friendRequest: Joi.object({
            emailNotification: Joi.boolean(),
            pushNotification: Joi.boolean(),
        }),
        teamStreakUpdates: Joi.object({
            emailNotification: Joi.boolean(),
            pushNotification: Joi.boolean(),
        }),
    }),
    timezone: Joi.string(),
    pushNotificationToken: Joi.string(),
};

export const userRequestBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.body,
        userBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchCurrentUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        const keysToUpdate = request.body;
        const updatedUser = await userModel.findByIdAndUpdate(user._id, { ...keysToUpdate }, { new: true }).lean();
        if (!updatedUser) {
            throw new CustomError(ErrorType.UpdateCurrentUserNotFound);
        }
        response.locals.updatedUser = updatedUser;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchCurrentUserMiddleware, err));
    }
};

export const patchCurrentUserMiddleware = getPatchCurrentUserMiddleware(userModel);

export const formatUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const user: User = response.locals.updatedUser;
        const formattedUser: CurrentUser = {
            _id: user._id,
            email: user.email,
            username: user.username,
            membershipInformation: user.membershipInformation,
            userType: user.userType,
            timezone: user.timezone,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            pushNotificationToken: user.pushNotificationToken,
            notifications: user.notifications,
            profileImages: user.profileImages,
        };
        response.locals.formattedUser = formattedUser;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.PatchCurrentUserFormatUserMiddleware, err));
    }
};

export const sendUpdatedCurrentUserMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { formattedUser } = response.locals;
        response.status(ResponseCodes.success).send(formattedUser);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedCurrentUserMiddleware, err));
    }
};

export const patchCurrentUserMiddlewares = [
    userRequestBodyValidationMiddleware,
    patchCurrentUserMiddleware,
    formatUserMiddleware,
    sendUpdatedCurrentUserMiddleware,
];