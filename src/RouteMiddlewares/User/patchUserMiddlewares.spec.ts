/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchUserMiddlewares,
    userRequestBodyValidationMiddleware,
    getPatchUserMiddleware,
    patchUserMiddleware,
    sendUpdatedUserMiddleware,
    userParamsValidationMiddleware,
    formatUpdatedUserMiddleware,
} from './patchUserMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import UserTypes from '@streakoid/streakoid-sdk/lib/userTypes';

describe('userParamsValidationMiddleware', () => {
    test('sends correct error response when userId is not defined', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: {},
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('userRequestBodyValidationMiddleware', () => {
    test('sends correct error response when unsupported key is sent', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { unsupportedKey: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct response is sent when timezone is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { timezone: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        userRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "timezone" fails because ["timezone" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchUserMiddleware', () => {
    test('sets response.locals.updatedUser', async () => {
        expect.assertions(3);
        const userId = 'abc123';
        const timezone = 'Europe/London';
        const request: any = {
            params: { userId },
            body: {
                timezone,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(true);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const userModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(userId, { timezone }, { new: true });
        expect(response.locals.updatedUser).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedUserNotFound error when user is not found', async () => {
        expect.assertions(1);
        const userId = '123cde';
        const request: any = {
            params: { userId },
            body: {
                userId,
                timezone: 'Europe/London',
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(false);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const userModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedUserNotFound));
    });

    test('calls next with PatchUserMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getPatchUserMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchUserMiddleware));
    });
});

describe('formatUpdatedUserMiddleware', () => {
    test('removes email from updatedUser and removes updated user email', () => {
        expect.assertions(2);
        const request: any = {};
        const updatedUser = {
            _id: '_id',
            username: 'username',
            membershipInformation: {
                isPayingMember: true,
                pastMemberships: [],
            },
            email: 'test@test.com',
            createdAt: 'Jan 1st',
            updatedAt: 'Jan 1st',
            timezone: 'Europe/London',
            userType: UserTypes.basic,
            friends: [],
            profileImages: {
                originalImageUrl: 'https://streakoid-profile-pictures.s3-eu-west-1.amazonaws.com/steve.jpg',
            },
            stripe: {
                customer: 'abc',
                subscription: 'sub_1',
            },
        };
        const response: any = { locals: { updatedUser } };
        const next = jest.fn();

        formatUpdatedUserMiddleware(request, response, next);

        expect(Object.keys(response.locals.updatedUser).sort()).toEqual(
            [
                '_id',
                'username',
                'isPayingMember',
                'userType',
                'timezone',
                'friends',
                'createdAt',
                'updatedAt',
                'profileImages',
                'endpointArn',
            ].sort(),
        );
        expect(next).toBeCalled();
    });

    test('calls next with FormatUpdatedUserMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        formatUpdatedUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormatUpdatedUserMiddleware, expect.any(Error)));
    });
});

describe('sendUpdatedPatchMiddleware', () => {
    test('sends updatedUser', () => {
        expect.assertions(3);
        const updatedTimezone = 'Europe/Paris';
        const updatedUser = {
            userId: 'abc',
            timezone: updatedTimezone,
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const userResponseLocals = { updatedUser };
        const response: any = { locals: userResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedUserMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(updatedUser);
    });

    test('calls next with SendUpdatedUserMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendUpdatedUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedUserMiddleware, expect.any(Error)));
    });
});

describe('patchUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(6);

        expect(patchUserMiddlewares.length).toBe(5);
        expect(patchUserMiddlewares[0]).toBe(userParamsValidationMiddleware);
        expect(patchUserMiddlewares[1]).toBe(userRequestBodyValidationMiddleware);
        expect(patchUserMiddlewares[2]).toBe(patchUserMiddleware);
        expect(patchUserMiddlewares[3]).toBe(formatUpdatedUserMiddleware);
        expect(patchUserMiddlewares[4]).toBe(sendUpdatedUserMiddleware);
    });
});
