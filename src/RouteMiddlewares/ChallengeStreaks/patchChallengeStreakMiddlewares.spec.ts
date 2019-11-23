/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchChallengeStreakMiddlewares,
    challengeStreakRequestBodyValidationMiddleware,
    getPatchChallengeStreakMiddleware,
    patchChallengeStreakMiddleware,
    sendUpdatedChallengeStreakMiddleware,
    challengeStreakParamsValidationMiddleware,
} from './patchChallengeStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('challengeStreakParamsValidationMiddleware', () => {
    test('sends correct error response when challengeStreakId is not defined', () => {
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

        challengeStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeStreakId" fails because ["challengeStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when challengeStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { challengeStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        challengeStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeStreakId" fails because ["challengeStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('challengeStreakRequestBodyValidationMiddleware', () => {
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

        challengeStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedKey" is not allowed',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error when streakName is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { streakName: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        challengeStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakName" fails because ["streakName" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct response is sent when streakDescription is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { streakDescription: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        challengeStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakDescription" fails because ["streakDescription" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchChallengeStreakMiddleware', () => {
    test('sets response.locals.updatedChallengeStreak', async () => {
        expect.assertions(3);
        const challengeStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const status = 'archived';
        const request: any = {
            params: { challengeStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
                status,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
        const challengeStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchChallengeStreakMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(
            challengeStreakId,
            { userId, streakName, streakDescription, status },
            { new: true },
        );
        expect(response.locals.updatedChallengeStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedChallengeStreakNotFound error when challenge streak is not found', async () => {
        expect.assertions(1);
        const challengeStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { challengeStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
        const challengeStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchChallengeStreakMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedChallengeStreakNotFound));
    });

    test('calls next with PatchChallengeStreakMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const challengeStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { challengeStreakId },
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
        const challengeStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchChallengeStreakMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchChallengeStreakMiddleware));
    });
});

describe('sendUpdatedPatchMiddleware', () => {
    const ERROR_MESSAGE = 'error';
    const updatedChallengeStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('sends updatedChallengeStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const challengeStreakResponseLocals = { updatedChallengeStreak };
        const response: any = { locals: challengeStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();
        const updatedResourceResponseCode = 200;

        sendUpdatedChallengeStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(updatedResourceResponseCode);
        expect(send).toBeCalledWith(updatedChallengeStreak);
    });

    test('calls next with SendUpdatedChallengeStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { updatedChallengeStreak }, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedChallengeStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedChallengeStreakMiddleware, expect.any(Error)));
    });
});

describe('patchChallengeStreakMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(patchChallengeStreakMiddlewares.length).toBe(4);
        expect(patchChallengeStreakMiddlewares[0]).toBe(challengeStreakParamsValidationMiddleware);
        expect(patchChallengeStreakMiddlewares[1]).toBe(challengeStreakRequestBodyValidationMiddleware);
        expect(patchChallengeStreakMiddlewares[2]).toBe(patchChallengeStreakMiddleware);
        expect(patchChallengeStreakMiddlewares[3]).toBe(sendUpdatedChallengeStreakMiddleware);
    });
});
