/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    patchSoloStreakMiddlewares,
    soloStreakRequestBodyValidationMiddleware,
    getPatchSoloStreakMiddleware,
    patchSoloStreakMiddleware,
    sendUpdatedSoloStreakMiddleware,
    soloStreakParamsValidationMiddleware,
} from './patchSoloStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('soloStreakParamsValidationMiddleware', () => {
    test('sends correct error response when soloStreakId is not defined', () => {
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

        soloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when soloStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { soloStreakId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        soloStreakParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "soloStreakId" fails because ["soloStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('soloStreakRequestBodyValidationMiddleware', () => {
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

        soloStreakRequestBodyValidationMiddleware(request, response, next);

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

        soloStreakRequestBodyValidationMiddleware(request, response, next);

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

        soloStreakRequestBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakDescription" fails because ["streakDescription" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('patchSoloStreakMiddleware', () => {
    test('sets response.locals.updatedSoloStreak', async () => {
        expect.assertions(3);
        const soloStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const status = 'archived';
        const request: any = {
            params: { soloStreakId },
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
        const soloStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(
            soloStreakId,
            { userId, streakName, streakDescription, status },
            { new: true },
        );
        expect(response.locals.updatedSoloStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws UpdatedSoloStreakNotFound error when solo streak is not found', async () => {
        expect.assertions(1);
        const soloStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { soloStreakId },
            body: {
                userId,
                streakName,
                streakDescription,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
        const soloStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.UpdatedSoloStreakNotFound));
    });

    test('calls next with PatchSoloStreakMiddleware on middleware failure', async () => {
        expect.assertions(1);
        const soloStreakId = 'abc123';
        const userId = '123cde';
        const streakName = 'Daily programming';
        const streakDescription = 'Do one hour of programming each day';
        const request: any = {
            params: { soloStreakId },
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
        const soloStreakModel = {
            findByIdAndUpdate,
        };
        const middleware = getPatchSoloStreakMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.PatchSoloStreakMiddleware));
    });
});

describe('sendUpdatedPatchMiddleware', () => {
    const ERROR_MESSAGE = 'error';
    const updatedSoloStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('sends updatedSoloStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const soloStreakResponseLocals = { updatedSoloStreak };
        const response: any = { locals: soloStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();
        const updatedResourceResponseCode = 200;

        sendUpdatedSoloStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(updatedResourceResponseCode);
        expect(send).toBeCalledWith(updatedSoloStreak);
    });

    test('calls next with SendUpdatedSoloStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { updatedSoloStreak }, status };
        const request: any = {};
        const next = jest.fn();

        sendUpdatedSoloStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendUpdatedSoloStreakMiddleware, expect.any(Error)));
    });
});

describe('patchSoloStreakMiddlewares', () => {
    test('are defined in the correct order', () => {
        expect.assertions(5);

        expect(patchSoloStreakMiddlewares.length).toBe(4);
        expect(patchSoloStreakMiddlewares[0]).toBe(soloStreakParamsValidationMiddleware);
        expect(patchSoloStreakMiddlewares[1]).toBe(soloStreakRequestBodyValidationMiddleware);
        expect(patchSoloStreakMiddlewares[2]).toBe(patchSoloStreakMiddleware);
        expect(patchSoloStreakMiddlewares[3]).toBe(sendUpdatedSoloStreakMiddleware);
    });
});
