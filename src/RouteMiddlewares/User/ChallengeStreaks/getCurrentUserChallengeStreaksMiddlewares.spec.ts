/* eslint-disable @typescript-eslint/no-explicit-any */

import { GetAllChallengeStreaksSortFields } from '@streakoid/streakoid-sdk/lib/challengeStreaks';
import {
    getChallengeStreaksQueryValidationMiddleware,
    getFindCurrentUserChallengeStreaksMiddleware,
    getCurrentUserChallengeStreaksMiddleware,
    findCurrentUserChallengeStreaksMiddleware,
    sendCurrentUserChallengeStreaksMiddleware,
} from './getCurrentUserChallengeStreaksMiddlewares';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

describe('getChallengeStreaksValidationMiddleware', () => {
    test('passes valid request', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                challengeId: 'challengeId',
                timezone: 'Europe/London',
                status: StreakStatus.archived,
                completedToday: false,
                active: true,
                sortField: GetAllChallengeStreaksSortFields.currentStreak,
                limit: 10,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getChallengeStreaksQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findCurrentUserChallengeStreaksMiddleware', () => {
    test('queries database with just timezone and sets response.locals.challengeStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const challengeStreakModel = {
            find,
        };
        const timezone = 'Europe/London';
        const request: any = { query: { timezone } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindCurrentUserChallengeStreaksMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ timezone });
        expect(limit).toBeCalled();
        expect(response.locals.challengeStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just completedToday as a boolean and sets response.locals.challengeStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const challengeStreakModel = {
            find,
        };
        const completedToday = 'true';
        const request: any = { query: { completedToday } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindCurrentUserChallengeStreaksMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ completedToday: true });
        expect(limit).toBeCalled();
        expect(response.locals.challengeStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just active as a boolean and sets response.locals.challengeStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const challengeStreakModel = {
            find,
        };
        const active = 'true';
        const request: any = { query: { active } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindCurrentUserChallengeStreaksMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ active: true });
        expect(limit).toBeCalled();
        expect(response.locals.challengeStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just status and sets response.locals.challengeStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const challengeStreakModel = {
            find,
        };
        const status = 'active';
        const request: any = { query: { status } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindCurrentUserChallengeStreaksMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ status });
        expect(limit).toBeCalled();
        expect(response.locals.challengeStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('sorts challenge streaks by current streak when sort field is set to current streak and sets response.locals.challengeStreaks', async () => {
        expect.assertions(5);
        const limit = jest.fn().mockResolvedValue(true);
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const challengeStreakModel = {
            find,
        };
        const sortField = GetAllChallengeStreaksSortFields.currentStreak;
        const request: any = { query: { sortField } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindCurrentUserChallengeStreaksMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(sort).toBeCalledWith({ 'currentStreak.numberOfDaysInARow': -1 });
        expect(limit).toBeCalled();
        expect(response.locals.challengeStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('sorts challenge streaks by longestChallengeStreak when sort field is set to longestChallengeStreak and sets response.locals.challengeStreaks', async () => {
        expect.assertions(5);
        const limit = jest.fn().mockResolvedValue(true);
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const challengeStreakModel = {
            find,
        };
        const sortField = GetAllChallengeStreaksSortFields.longestChallengeStreak;
        const request: any = { query: { sortField } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindCurrentUserChallengeStreaksMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(limit).toBeCalled();
        expect(sort).toBeCalledWith({ 'longestChallengeStreak.numberOfDays': -1 });
        expect(response.locals.challengeStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindChallengeStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'error';
        const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const challengeStreakModel = {
            find,
        };
        const request: any = { query: { userId: '1234' } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindCurrentUserChallengeStreaksMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindChallengeStreaksMiddleware, expect.any(Error)));
    });
});

describe('sendChallengeStreaksMiddleware', () => {
    test('sends challengeStreaks in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const challengeStreaks = [
            {
                name: '30 minutes reading',
                description: 'Read for 30 minutes everyday',
                userId: '1234',
            },
        ];
        const response: any = { locals: { challengeStreaks }, status };
        const next = jest.fn();

        sendCurrentUserChallengeStreaksMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(challengeStreaks);
    });

    test('calls next with SendChallengeStreaksMiddleware on middleware failure', () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'sendChallengeStreaks error';
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendCurrentUserChallengeStreaksMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendChallengeStreaksMiddleware, expect.any(Error)));
    });
});

describe(`getCurrentUserChallengeStreaksMiddleware`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getCurrentUserChallengeStreaksMiddleware.length).toEqual(3);
        expect(getCurrentUserChallengeStreaksMiddleware[0]).toBe(getChallengeStreaksQueryValidationMiddleware);
        expect(getCurrentUserChallengeStreaksMiddleware[1]).toBe(findCurrentUserChallengeStreaksMiddleware);
        expect(getCurrentUserChallengeStreaksMiddleware[2]).toBe(sendCurrentUserChallengeStreaksMiddleware);
    });
});
