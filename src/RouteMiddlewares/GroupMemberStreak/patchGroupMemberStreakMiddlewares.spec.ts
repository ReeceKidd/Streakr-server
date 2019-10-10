/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchGroupMemberStreakMiddlewares,
    groupMemberStreakRequestBodyValidationMiddleware,
    getPatchGroupMemberStreakMiddleware,
    patchGroupMemberStreakMiddleware,
    sendUpdatedGroupMemberStreakMiddleware,
    groupMemberStreakParamsValidationMiddleware,
} from './patchGroupMemberStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('groupMemberStreakParamsValidationMiddleware', () => {
    test('sends correct error response when groupMemberStreakId is not defined', () => {
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

        groupMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupMemberStreakId" fails because ["groupMemberStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when groupMemberStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { groupMemberStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        groupMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "groupMemberStreakId" fails because ["groupMemberStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('groupMemberStreakRequestBodyValidationMiddleware', () => {
    const timezone = 'timezone';
    const completedToday = true;
    const active = true;
    const currentStreak = {};
    const pastStreaks: object[] = [];
    const body = {
        timezone,
        completedToday,
        active,
        currentStreak,
        pastStreaks,
    };
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

        groupMemberStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error when timezone is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, timezone: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        groupMemberStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "timezone" fails because ["timezone" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error when completedToday is not a boolean', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, completedToday: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        groupMemberStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "completedToday" fails because ["completedToday" must be a boolean]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error when active is not a boolean', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, active: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        groupMemberStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "active" fails because ["active" must be a boolean]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error when currentStreak is not an object', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, currentStreak: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        groupMemberStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "currentStreak" fails because ["currentStreak" must be an object]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error when pastStreaks is not an array', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, pastStreaks: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        groupMemberStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "pastStreaks" fails because ["pastStreaks" must be an array]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchGroupMemberStreakMiddleware', () => {
    test('sets response.locals.updatedGroupMemberStreak', async () => {
        expect.assertions(3);
        const groupMemberStreakId = 'abc123';
        const completedToday = true;
        const request: any = {
            params: { groupMemberStreakId },
            body: {
                completedToday,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const groupMemberStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(groupMemberStreakId, { completedToday }, { new: true });
        expect(response.locals.updatedGroupMemberStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedGroupMemberStreakNotFound error when solo streak is not found', async () => {
        expect.assertions(1);
        const groupMemberStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { groupMemberStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
        const groupMemberStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedGroupMemberStreakNotFound));
    });

    test('calls next with PatchGroupMemberStreakMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const groupMemberStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { groupMemberStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const errorMessage = 'error';
        const findByIdAndUpdate = jest.fn(() => Promise.reject(errorMessage));
        const groupMemberStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchGroupMemberStreakMiddleware(groupMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchGroupMemberStreakMiddleware));
    });
});

describe('sendUpdatedPatchMiddleware', () => {
    const ERROR_MESSAGE = 'error';
    const updatedGroupMemberStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('sends updatedGroupMemberStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const groupMemberStreakResponseLocals = { updatedGroupMemberStreak };
        const response: any = { locals: groupMemberStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();
        const updatedResourceResponseCode = 200;

        sendUpdatedGroupMemberStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(updatedResourceResponseCode);
        expect(send).toBeCalledWith(updatedGroupMemberStreak);
    });

    test('calls next with SendUpdatedGroupMemberStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { updatedGroupMemberStreak }, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedGroupMemberStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendUpdatedGroupMemberStreakMiddleware, expect.any(Error)),
        );
    });
});

describe('patchGroupMemberStreakMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(patchGroupMemberStreakMiddlewares.length).toBe(4);
        expect(patchGroupMemberStreakMiddlewares[0]).toBe(groupMemberStreakParamsValidationMiddleware);
        expect(patchGroupMemberStreakMiddlewares[1]).toBe(groupMemberStreakRequestBodyValidationMiddleware);
        expect(patchGroupMemberStreakMiddlewares[2]).toBe(patchGroupMemberStreakMiddleware);
        expect(patchGroupMemberStreakMiddlewares[3]).toBe(sendUpdatedGroupMemberStreakMiddleware);
    });
});
