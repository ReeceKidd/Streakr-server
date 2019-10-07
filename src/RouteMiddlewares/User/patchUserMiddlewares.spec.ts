/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchUserMiddlewares,
    userRequestBodyValidationMiddleware,
    getPatchUserMiddleware,
    patchUserMiddleware,
    sendUpdatedUserMiddleware,
    userParamsValidationMiddleware,
} from './patchUserMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

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
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const userModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchUserMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(userId, { timezone }, { new: true });
        expect(response.locals.updatedUser).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedUserNotFound error when solo streak is not found', async () => {
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
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
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

describe('sendUpdatedPatchMiddleware', () => {
    const ERROR_MESSAGE = 'error';
    const updatedTimezone = 'Europe/Paris';
    const updatedUser = {
        userId: 'abc',
        timezone: updatedTimezone,
    };

    test('sends updatedUser', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const userResponseLocals = { updatedUser };
        const response: any = { locals: userResponseLocals, status };
        const request: any = {};
        const next = jest.fn();
        const updatedResourceResponseCode = 200;

        sendUpdatedUserMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(updatedResourceResponseCode);
        expect(send).toBeCalledWith(updatedUser);
    });

    test('calls next with SendUpdatedUserMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { updatedUser }, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedUserMiddleware, expect.any(Error)));
    });
});

describe('patchUserMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(patchUserMiddlewares.length).toBe(4);
        expect(patchUserMiddlewares[0]).toBe(userParamsValidationMiddleware);
        expect(patchUserMiddlewares[1]).toBe(userRequestBodyValidationMiddleware);
        expect(patchUserMiddlewares[2]).toBe(patchUserMiddleware);
        expect(patchUserMiddlewares[3]).toBe(sendUpdatedUserMiddleware);
    });
});
