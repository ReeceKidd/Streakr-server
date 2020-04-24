import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../../../src/Server/responseCodes';
import { userModel } from '../../../../src/Models/User';
import { UserModel } from '../../../../src/Models/User';
import { CustomError, ErrorType } from '../../../../src/customError';
import { User } from '@streakoid/streakoid-models/lib';
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
    reminderHour: Joi.number()
        .equal(...validHours)
        .required(),
    reminderMinute: Joi.number()
        .equal(...validMinutes)
        .required(),
    streakReminderType: Joi.string(),
});

const customStreakRemindersPushNotificationValidationSchema = Joi.object({
    enabled: Joi.boolean().required(),
    expoId: Joi.string().required(),
    streakReminderType: Joi.string(),
    reminderHour: Joi.number()
        .equal(...validHours)
        .required(),
    reminderMinute: Joi.number()
        .equal(...validMinutes)
        .required(),
    soloStreakId: Joi.string(),
    soloStreakName: Joi.string(),
    challengeStreakId: Joi.string(),
    challengeId: Joi.string(),
    challengeName: Joi.string(),
    teamStreakId: Joi.string(),
    teamStreakName: Joi.string(),
});

const patchCurrentUserPushNotificationsValidationSchema = {
    completeAllStreaksReminder: completeAllStreaksPushNotificationValidationSchema,
    newFollowerUpdates: Joi.object({
        enabled: Joi.boolean().required(),
    }),
    teamStreakUpdates: Joi.object({
        enabled: Joi.boolean().required(),
    }),
    achievementUpdates: Joi.object({
        enabled: Joi.boolean().required(),
    }),
    customStreakReminders: Joi.array().items(customStreakRemindersPushNotificationValidationSchema),
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
        const user: User = response.locals.user;
        const updatedUser: UserModel | null = await userModel
            .findByIdAndUpdate(
                user._id,
                { pushNotifications: { ...user.pushNotifications, ...request.body } },
                { new: true },
            )
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
