import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { UserModel, userModel } from '../../../src/Models/User';

const registerDeviceForPushNotificationsValidationSchema = {
    pushNotificationToken: Joi.string().required(),
    userId: Joi.string().required(),
    platform: Joi.string()
        .valid(['ios', 'android'])
        .required(),
};

export const registerDeviceForPushNotificationsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        registerDeviceForPushNotificationsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveUserMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.RegisterDeviceForPushNotificationUserNotFound);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RegisterDeviceForPushNotificationRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

export const getUpdateUserPushNotificationInformationMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, pushNotificationToken } = request.body;
        await userModel.findByIdAndUpdate(userId, { pushNotificationToken });
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.UpdateUserPushNotificationInformationMiddleware, err));
    }
};

export const updateUserPushNotificationInformationMiddleware = getUpdateUserPushNotificationInformationMiddleware(
    userModel,
);

export const sendSuccessfullyRegisteredDevice = (request: Request, response: Response, next: NextFunction): void => {
    try {
        response.status(ResponseCodes.success).send('Successfully registered device');
    } catch (err) {
        next(new CustomError(ErrorType.SendSuccessfullyRegisteredDevice, err));
    }
};

export const registerDeviceForPushNotificationsMiddlewares = [
    registerDeviceForPushNotificationsValidationMiddleware,
    retreiveUserMiddleware,
    updateUserPushNotificationInformationMiddleware,
    sendSuccessfullyRegisteredDevice,
];
