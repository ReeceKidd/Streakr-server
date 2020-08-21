/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchTeamMemberStreakMiddlewares,
    teamMemberStreakRequestBodyValidationMiddleware,
    getPatchTeamMemberStreakMiddleware,
    patchTeamMemberStreakMiddleware,
    sendUpdatedTeamMemberStreakMiddleware,
    teamMemberStreakParamsValidationMiddleware,
} from './patchTeamMemberStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import TeamVisibilityTypes from '@streakoid/streakoid-models/lib/Types/TeamVisibilityTypes';

describe('teamMemberStreakParamsValidationMiddleware', () => {
    test('sends correct error response when teamMemberStreakId is not defined', () => {
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

        teamMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when teamMemberStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { teamMemberStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        teamMemberStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamMemberStreakId" fails because ["teamMemberStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('teamMemberStreakRequestBodyValidationMiddleware', () => {
    const timezone = 'timezone';
    const completedToday = true;
    const active = true;
    const currentStreak = {};
    const pastStreaks: object[] = [];
    const visibility = TeamVisibilityTypes.members;
    const body = {
        timezone,
        completedToday,
        active,
        currentStreak,
        pastStreaks,
        visibility,
    };

    test('allows valid request with all keys to pass', () => {
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

        teamMemberStreakRequestBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });
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

        teamMemberStreakRequestBodyValidationMiddleware(request, response, next);

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

        teamMemberStreakRequestBodyValidationMiddleware(request, response, next);

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

        teamMemberStreakRequestBodyValidationMiddleware(request, response, next);

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

        teamMemberStreakRequestBodyValidationMiddleware(request, response, next);

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

        teamMemberStreakRequestBodyValidationMiddleware(request, response, next);

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

        teamMemberStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "pastStreaks" fails because ["pastStreaks" must be an array]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchTeamMemberStreakMiddleware', () => {
    test('sets response.locals.updatedTeamMemberStreak', async () => {
        expect.assertions(3);
        const teamMemberStreakId = 'abc123';
        const completedToday = true;
        const request: any = {
            params: { teamMemberStreakId },
            body: {
                completedToday,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const teamMemberStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(teamMemberStreakId, { completedToday }, { new: true });
        expect(response.locals.updatedTeamMemberStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedTeamMemberStreakNotFound error when solo streak is not found', async () => {
        expect.assertions(1);
        const teamMemberStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { teamMemberStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
        const teamMemberStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedTeamMemberStreakNotFound));
    });

    test('calls next with PatchTeamMemberStreakMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const teamMemberStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { teamMemberStreakId },
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
        const teamMemberStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchTeamMemberStreakMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchTeamMemberStreakMiddleware));
    });
});

describe('sendUpdatedPatchMiddleware', () => {
    const ERROR_MESSAGE = 'error';
    const updatedTeamMemberStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('sends updatedTeamMemberStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const teamMemberStreakResponseLocals = { updatedTeamMemberStreak };
        const response: any = { locals: teamMemberStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();
        const updatedResourceResponseCode = 200;

        sendUpdatedTeamMemberStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(updatedResourceResponseCode);
        expect(send).toBeCalledWith(updatedTeamMemberStreak);
    });

    test('calls next with SendUpdatedTeamMemberStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { updatedTeamMemberStreak }, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedTeamMemberStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendUpdatedTeamMemberStreakMiddleware, expect.any(Error)),
        );
    });
});

describe('patchTeamMemberStreakMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(patchTeamMemberStreakMiddlewares.length).toBe(4);
        expect(patchTeamMemberStreakMiddlewares[0]).toBe(teamMemberStreakParamsValidationMiddleware);
        expect(patchTeamMemberStreakMiddlewares[1]).toBe(teamMemberStreakRequestBodyValidationMiddleware);
        expect(patchTeamMemberStreakMiddlewares[2]).toBe(patchTeamMemberStreakMiddleware);
        expect(patchTeamMemberStreakMiddlewares[3]).toBe(sendUpdatedTeamMemberStreakMiddleware);
    });
});
