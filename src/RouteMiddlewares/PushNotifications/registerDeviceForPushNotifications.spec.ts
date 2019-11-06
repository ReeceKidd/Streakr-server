/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    registerDeviceForPushNotificationsValidationMiddleware,
    retreiveUserMiddleware,
    createTopicSubscriptionMiddleware,
    updateUserPushNotificationInformationMiddleware,
    sendSuccessfullyRegisteredDevice,
    getRetreiveUserMiddleware,
    getCreatePlaformEndpointMiddleware,
    getCreateTopicSubscriptionMiddleware,
    getUpdateUserPushNotificationInformationMiddleware,
    registerDeviceForPushNotificationsMiddlewares,
    createPlaformEndpointMiddleware,
} from './registerDeviceForPushNotifications';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError } from '../../../src/customError';
import { ErrorType } from '../../../src/customError';

describe(`registerDeviceForPushNotificationsValidationMiddleware`, () => {
    const token = 'token';
    const userId = 'userId';
    const platform = 'android';

    const body = {
        token,
        userId,
        platform,
    };

    test('valid request passes validation', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        registerDeviceForPushNotificationsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends token is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, token: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        registerDeviceForPushNotificationsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "token" fails because ["token" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends userId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, userId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        registerDeviceForPushNotificationsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends platform must be ios or android error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, platform: 'windows' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        registerDeviceForPushNotificationsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "platform" fails because ["platform" must be one of [ios, android]]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retreiveUserMiddleware', () => {
    test('sets response.locals.user and calls next()', async () => {
        expect.assertions(4);
        const lean = jest.fn(() => true);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const userId = 'abcdefg';
        const request: any = { body: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.user).toBeDefined();
        expect(findOne).toBeCalledWith({ _id: userId });
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws RegisterDeviceForPushNotificationUserNotFound when user does not exist', async () => {
        expect.assertions(1);
        const userId = 'abcd';
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = { body: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RegisterDeviceForPushNotificationUserNotFound));
    });

    test('throws RetreiveUserMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const userId = 'abcd';
        const findOne = jest.fn(() => ({}));
        const userModel = { findOne };
        const request: any = { body: { userId } };
        const response: any = { status, locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.RegisterDeviceForPushNotificationRetreiveUserMiddleware, expect.any(Error)),
        );
    });
});

describe('createPlatformEndpointMiddleware', () => {
    test('creates platform endpoint and sets response.locals.endpointArn', async () => {
        expect.assertions(4);
        const promise = jest.fn().mockResolvedValue({ EndpointArn: true });
        const createPlatformEndpoint = jest.fn(() => ({ promise }));
        const sns = {
            createPlatformEndpoint,
        };
        const token = 'token';
        const userId = 'userId';
        const request: any = { body: { token, userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCreatePlaformEndpointMiddleware(sns as any);

        await middleware(request, response, next);

        expect(createPlatformEndpoint).toBeCalledWith({
            Token: token,
            PlatformApplicationArn: 'arn:aws:sns:eu-west-1:932661412733:app/GCM/Firebase',
            CustomUserData: userId,
        });
        expect(promise).toBeCalledWith();
        expect(response.locals.endpointArn).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws CreatePlatformEndpointMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getCreatePlaformEndpointMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreatePlatformEndpointMiddleware, expect.any(Error)));
    });
});

describe('createTopicSubscriptionMiddleware', () => {
    test('subscribes endpoint to topic and calls next()', async () => {
        expect.assertions(3);
        const promise = jest.fn().mockResolvedValue(true);
        const subscribe = jest.fn(() => ({ promise }));
        const sns = {
            subscribe,
        };
        const endpointArn = 'endpointArn';
        const request: any = {};
        const response: any = { locals: { endpointArn } };
        const next = jest.fn();
        const middleware = getCreateTopicSubscriptionMiddleware(sns as any);

        await middleware(request, response, next);

        expect(subscribe).toBeCalledWith({
            TopicArn: 'arn:aws:sns:eu-west-1:932661412733:Streakoid',
            Endpoint: endpointArn,
            Protocol: 'application',
        });
        expect(promise).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateTopicSubscriptionMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getCreatePlaformEndpointMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTopicSubscriptionMiddleware, expect.any(Error)));
    });
});

describe('updateUserPushNotificationInformationMiddleware', () => {
    test('updtes users pushNotificationToken and endpointArn then calls next()', async () => {
        expect.assertions(2);
        const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
        const userModel = { findByIdAndUpdate };
        const userId = 'abcdefg';
        const token = 'token';
        const endpointArn = 'endpointArn';
        const request: any = { body: { userId, token } };
        const response: any = { locals: { endpointArn } };
        const next = jest.fn();
        const middleware = getUpdateUserPushNotificationInformationMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(userId, { pushNotificationToken: token, endpointArn });
        expect(next).toBeCalledWith();
    });

    test('throws UpdateUserPushNotificationInformationMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const userModel = {};
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getUpdateUserPushNotificationInformationMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.UpdateUserPushNotificationInformationMiddleware, expect.any(Error)),
        );
    });
});

describe(`sendSuccessfullyRegisteredDevice`, () => {
    test('responds with status 200 with the endpointArn', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const endpointArn = 'endpointArn';
        const response: any = { locals: { endpointArn }, status };
        const request: any = {};
        const next = jest.fn();

        sendSuccessfullyRegisteredDevice(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(endpointArn);
    });

    test('calls next with SendSuccessfullyRegisteredDevice error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};

        const request: any = {};
        const next = jest.fn();

        sendSuccessfullyRegisteredDevice(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendSuccessfullyRegisteredDevice, expect.any(Error)));
    });
});

describe(`registerDeviceForPushNotificationsMiddlewares`, () => {
    test('middlewares are defined in the correct order', async () => {
        expect.assertions(7);

        expect(registerDeviceForPushNotificationsMiddlewares.length).toEqual(6);
        expect(registerDeviceForPushNotificationsMiddlewares[0]).toBe(
            registerDeviceForPushNotificationsValidationMiddleware,
        );
        expect(registerDeviceForPushNotificationsMiddlewares[1]).toBe(retreiveUserMiddleware);
        expect(registerDeviceForPushNotificationsMiddlewares[2]).toBe(createPlaformEndpointMiddleware);
        expect(registerDeviceForPushNotificationsMiddlewares[3]).toBe(createTopicSubscriptionMiddleware);
        expect(registerDeviceForPushNotificationsMiddlewares[4]).toBe(updateUserPushNotificationInformationMiddleware);
        expect(registerDeviceForPushNotificationsMiddlewares[5]).toBe(sendSuccessfullyRegisteredDevice);
    });
});
