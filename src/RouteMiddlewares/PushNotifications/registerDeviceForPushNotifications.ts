import aws from 'aws-sdk';
import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import { Model } from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { UserModel, userModel } from '../../../src/Models/User';
import { getServiceConfig } from '../../../src/getServiceConfig';

const { AWS_SECRET_ACCESS_KEY, AWS_ACCESS_KEY_ID, SNS_PLATFORM_APPLICATION_ARN, SNS_TOPIC_ARN } = getServiceConfig();

aws.config.update({
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_ACCESS_KEY_ID,
    region: 'eu-west-1',
});

const sns = new aws.SNS();

const registerDeviceForPushNotificationsValidationSchema = {
    token: Joi.string().required(),
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

export const getCreatePlaformEndpointMiddleware = (snsClient: typeof sns) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { token, userId } = request.body;
        const { EndpointArn } = await snsClient
            .createPlatformEndpoint({
                Token: token,
                PlatformApplicationArn: SNS_PLATFORM_APPLICATION_ARN,
                CustomUserData: userId,
            })
            .promise();
        response.locals.endpointArn = EndpointArn;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreatePlatformEndpointMiddleware, err));
    }
};

export const createPlaformEndpointMiddleware = getCreatePlaformEndpointMiddleware(sns);

export const getCreateTopicSubscriptionMiddleware = (snsClient: typeof sns) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { endpointArn } = response.locals;
        await snsClient
            .subscribe({
                TopicArn: SNS_TOPIC_ARN,
                Endpoint: endpointArn,
                Protocol: 'application',
            })
            .promise();
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateTopicSubscriptionMiddleware, err));
    }
};

export const createTopicSubscriptionMiddleware = getCreateTopicSubscriptionMiddleware(sns);

export const getUpdateUserPushNotificationInformationMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, token } = request.body;
        const { endpointArn } = response.locals;
        await userModel.findByIdAndUpdate(userId, { pushNotificationToken: token, endpointArn });
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
        const { endpointArn } = response.locals;
        response.status(ResponseCodes.success).send(endpointArn);
    } catch (err) {
        next(new CustomError(ErrorType.SendSuccessfullyRegisteredDevice, err));
    }
};

export const registerDeviceForPushNotificationsMiddlewares = [
    registerDeviceForPushNotificationsValidationMiddleware,
    retreiveUserMiddleware,
    createPlaformEndpointMiddleware,
    createTopicSubscriptionMiddleware,
    updateUserPushNotificationInformationMiddleware,
    sendSuccessfullyRegisteredDevice,
];
