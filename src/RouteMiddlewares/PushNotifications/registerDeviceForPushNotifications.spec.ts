/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    registerDeviceForPushNotificationsValidationMiddleware,
    retreiveUserMiddleware,
    updateUserPushNotificationInformationMiddleware,
    sendSuccessfullyRegisteredDevice,
    getRetreiveUserMiddleware,
    getUpdateUserPushNotificationInformationMiddleware,
    registerDeviceForPushNotificationsMiddlewares,
} from './registerDeviceForPushNotifications';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError } from '../../../src/customError';
import { ErrorType } from '../../../src/customError';

describe(`registerDeviceForPushNotificationsValidationMiddleware`, () => {
    const pushNotificationToken = 'pushNotificationToken';
    const userId = 'userId';
    const platform = 'android';

    const body = {
        pushNotificationToken,
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

    test('sends pushNotificationToken is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, pushNotificationToken: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        registerDeviceForPushNotificationsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "pushNotificationToken" fails because ["pushNotificationToken" is required]',
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

describe('updateUserPushNotificationInformationMiddleware', () => {
    test('updtes users pushNotificationToken then calls next()', async () => {
        expect.assertions(2);
        const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
        const userModel = { findByIdAndUpdate };
        const userId = 'abcdefg';
        const pushNotificationToken = 'pushNotificationToken';
        const request: any = { body: { userId, pushNotificationToken } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getUpdateUserPushNotificationInformationMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(userId, { pushNotificationToken: pushNotificationToken });
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
    test('responds with status 200', () => {
        expect.assertions(2);
        const status = jest.fn();
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendSuccessfullyRegisteredDevice(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
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
        expect.assertions(5);

        expect(registerDeviceForPushNotificationsMiddlewares.length).toEqual(4);
        expect(registerDeviceForPushNotificationsMiddlewares[0]).toBe(
            registerDeviceForPushNotificationsValidationMiddleware,
        );
        expect(registerDeviceForPushNotificationsMiddlewares[1]).toBe(retreiveUserMiddleware);
        expect(registerDeviceForPushNotificationsMiddlewares[2]).toBe(updateUserPushNotificationInformationMiddleware);
        expect(registerDeviceForPushNotificationsMiddlewares[3]).toBe(sendSuccessfullyRegisteredDevice);
    });
});
