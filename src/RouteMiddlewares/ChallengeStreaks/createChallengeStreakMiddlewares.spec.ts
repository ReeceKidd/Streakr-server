/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createChallengeStreakMiddlewares,
    createChallengeStreakBodyValidationMiddleware,
    createChallengeStreakFromRequestMiddleware,
    getCreateChallengeStreakFromRequestMiddleware,
    sendFormattedChallengeStreakMiddleware,
} from './createChallengeStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`createChallengeStreakBodyValidationMiddleware`, () => {
    const userId = '12345678';
    const challengeId = 'abcdefgh';

    const body = {
        userId,
        challengeId,
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

        createChallengeStreakBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
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

        createChallengeStreakBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends challengeId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, challengeId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createChallengeStreakBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "challengeId" fails because ["challengeId" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`createChallengeStreakFromRequestMiddleware`, () => {
    test('sets response.locals.savedChallengeStreak', async () => {
        expect.assertions(2);
        const userId = 'abcdefg';
        const streakName = 'streak streakName';
        const streakDescription = 'mock streak streakDescription';
        const timezone = 'Europe/London';
        const save = jest.fn().mockResolvedValue(true);

        const challengeStreak = jest.fn(() => ({ save }));

        const response: any = { locals: { timezone } };
        const request: any = { body: { userId, streakName, streakDescription } };
        const next = jest.fn();

        const middleware = getCreateChallengeStreakFromRequestMiddleware(challengeStreak as any);

        await middleware(request, response, next);

        expect(response.locals.savedChallengeStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with CreateChallengeStreakFromRequestMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateChallengeStreakFromRequestMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateChallengeStreakFromRequestMiddleware, expect.any(Error)),
        );
    });
});

describe(`sendFormattedChallengeStreakMiddleware`, () => {
    const ERROR_MESSAGE = 'error';
    const savedChallengeStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('responds with status 201 with challengeStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const challengeStreakResponseLocals = {
            savedChallengeStreak,
        };
        const response: any = { locals: challengeStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedChallengeStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(savedChallengeStreak);
    });

    test('calls next with SendFormattedChallengeStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedChallengeStreak }, status };

        const request: any = {};
        const next = jest.fn();

        sendFormattedChallengeStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendFormattedChallengeStreakMiddleware, expect.any(Error)),
        );
    });
});

describe(`createChallengeStreakMiddlewares`, () => {
    test('that createChallengeStreak middlewares are defined in the correct order', async () => {
        expect.assertions(4);

        expect(createChallengeStreakMiddlewares.length).toEqual(3);
        expect(createChallengeStreakMiddlewares[0]).toBe(createChallengeStreakBodyValidationMiddleware);
        expect(createChallengeStreakMiddlewares[1]).toBe(createChallengeStreakFromRequestMiddleware);
        expect(createChallengeStreakMiddlewares[2]).toBe(sendFormattedChallengeStreakMiddleware);
    });
});
