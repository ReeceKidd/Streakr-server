import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../../../src/Server/responseCodes';
import { userModel } from '../../../../src/Models/User';
import { UserModel } from '../../../../src/Models/User';
import { CustomError, ErrorType } from '../../../../src/customError';
import { UserPushNotifications } from '@streakoid/streakoid-sdk/lib';
const validHours = [];
for (let hour = 0; hour < 24; hour++) {
    validHours.push(hour);
}
const validMinutes = [];
for (let minute = 0; minute < 60; minute++) {
    validMinutes.push(minute);
}

const completeAllStreaksPushNotificationValidationSchema = Joi.object({
    enabled: Joi.boolean().required(),
    expoId: Joi.string().required(),
    type: Joi.string().required(),
    reminderHour: Joi.number()
        .equal(...validHours)
        .required(),
    reminderMinute: Joi.number()
        .equal(...validMinutes)
        .required(),
});

const patchCurrentUserPushNotificationsValidationSchema = {
    completeAllStreaksReminder: completeAllStreaksPushNotificationValidationSchema,
    badgeUpdates: Joi.object({
        enabled: Joi.boolean().required(),
    }),
    newFollowerUpdates: Joi.object({
        enabled: Joi.boolean().required(),
    }),
    teamStreakUpdates: Joi.object({
        enabled: Joi.boolean().required(),
    }),
};

export const patchCurrentUserPushNotificationsRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        patchCurrentUserPushNotificationsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchCurrentUserPushNotificationsMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { user } = response.locals;
        const pushNotifications: UserPushNotifications = request.body;

        const updatedUser: UserModel | null = await userModel
            .findByIdAndUpdate(user._id, { pushNotifications }, { new: true })
            .lean();

        if (!updatedUser) {
            throw new CustomError(ErrorType.UpdateCurrentUsersPushNotificationsUserNotFound);
        }
        response.locals.pushNotifications = updatedUser.pushNotifications;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchCurrentUserPushNotificationsMiddleware, err));
    }
};

export const patchCurrentUserPushNotificationsMiddleware = getPatchCurrentUserPushNotificationsMiddleware(userModel);

export const sendUpdatedCurrentUserPushNotificationsMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { pushNotifications } = response.locals;
        response.status(ResponseCodes.success).send(pushNotifications);
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedCurrentUserPushNotificationsMiddleware, err));
    }
};

export const patchCurrentUserPushNotificationsMiddlewares = [
    patchCurrentUserPushNotificationsRequestBodyValidationMiddleware,
    patchCurrentUserPushNotificationsMiddleware,
    sendUpdatedCurrentUserPushNotificationsMiddleware,
];
