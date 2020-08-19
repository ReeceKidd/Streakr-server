/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getSoloStreaksQueryValidationMiddleware,
    getFindSoloStreaksForCurrentUserMiddleware,
    sendSoloStreaksForCurrentUserMiddleware,
    findSoloStreaksForCurrentUserMiddleware,
} from './getCurrentUserSoloStreaksMiddlewares';
import { ResponseCodes } from '../../../Server/responseCodes';
import { CustomError, ErrorType } from '../../../customError';
import { GetAllSoloStreaksSortFields } from '@streakoid/streakoid-sdk/lib/soloStreaks';
import { getMockUser } from '../../../testHelpers/getMockUser';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { getCurrentUserSoloStreaksMiddlewares } from './getCurrentUserSoloStreaksMiddlewares';
describe('getSoloStreaksValidationMiddleware', () => {
    test('passes valid request', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                status: StreakStatus.archived,
                completedToday: false,
                active: true,
                sortField: GetAllSoloStreaksSortFields.currentStreak,
                limit: 10,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getSoloStreaksQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findSoloStreaksForCurrentUserMiddleware', () => {
    test('queries database with just completedToday as a boolean and sets response.locals.soloStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const soloStreakModel = {
            find,
        };
        const completedToday = 'true';
        const user = getMockUser({ _id: 'userId' });
        const request: any = { query: { completedToday } };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindSoloStreaksForCurrentUserMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ completedToday: true, userId: user._id });
        expect(limit).toBeCalled();
        expect(response.locals.soloStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just active as a boolean and sets response.locals.soloStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const soloStreakModel = {
            find,
        };
        const active = 'true';
        const user = getMockUser({ _id: 'userId' });
        const request: any = { query: { active } };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindSoloStreaksForCurrentUserMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ active: true, userId: user._id });
        expect(limit).toBeCalled();
        expect(response.locals.soloStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just status and sets response.locals.soloStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const soloStreakModel = {
            find,
        };
        const status = 'active';
        const user = getMockUser({ _id: 'userId' });
        const request: any = { query: { status, userId: user._id } };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindSoloStreaksForCurrentUserMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ status, userId: user._id });
        expect(limit).toBeCalled();
        expect(response.locals.soloStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('if sort field is current streak it queries solo streaks and sorts them by currentStreak ', async () => {
        expect.assertions(5);
        const limit = jest.fn().mockResolvedValue(true);
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const soloStreakModel = {
            find,
        };
        const sortField = GetAllSoloStreaksSortFields.currentStreak;
        const request: any = { query: { sortField } };
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindSoloStreaksForCurrentUserMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId: user._id });
        expect(sort).toBeCalledWith({ 'currentStreak.numberOfDaysInARow': -1 });
        expect(limit).toBeCalled();
        expect(response.locals.soloStreaks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('if sort field is longestSoloStreak it queries solo streaks and sorts them by longestSoloStreak ', async () => {
        expect.assertions(5);
        const limit = jest.fn().mockResolvedValue(true);
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const soloStreakModel = {
            find,
        };
        const sortField = GetAllSoloStreaksSortFields.longestSoloStreak;
        const user = getMockUser({ _id: 'userId' });
        const request: any = { query: { sortField, userId: user._id } };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindSoloStreaksForCurrentUserMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId: user._id });
        expect(sort).toBeCalledWith({ 'longestSoloStreak.numberOfDays': -1 });
        expect(limit).toBeCalled();
        expect(response.locals.soloStreaks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries database with just limit and sets response.locals.soloStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const soloStreakModel = {
            find,
        };
        const limitValue = 10;
        const user = getMockUser({ _id: 'userId' });
        const request: any = { query: { limit: limitValue, userId: user._id } };
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindSoloStreaksForCurrentUserMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId: user._id });
        expect(limit).toBeCalledWith(limitValue);
        expect(response.locals.soloStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindSoloStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'error';
        const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const soloStreakModel = {
            find,
        };
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindSoloStreaksForCurrentUserMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindSoloStreaksMiddleware, expect.any(Error)));
    });
});

describe('sendSoloStreaksForCurrentUserMiddleware', () => {
    test('sends soloStreaks in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const soloStreaks = [
            {
                name: '30 minutes reading',
                description: 'Read for 30 minutes everyday',
                userId: '1234',
            },
        ];
        const response: any = { locals: { soloStreaks }, status };
        const next = jest.fn();

        sendSoloStreaksForCurrentUserMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(soloStreaks);
    });

    test('calls next with SendSoloStreaksMiddleware on middleware failure', () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'sendSoloStreaks error';
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendSoloStreaksForCurrentUserMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendSoloStreaksMiddleware, expect.any(Error)));
    });
});

describe(`getCurrentUserSoloStreaksMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getCurrentUserSoloStreaksMiddlewares.length).toEqual(3);
        expect(getCurrentUserSoloStreaksMiddlewares[0]).toBe(getSoloStreaksQueryValidationMiddleware);
        expect(getCurrentUserSoloStreaksMiddlewares[1]).toBe(findSoloStreaksForCurrentUserMiddleware);
        expect(getCurrentUserSoloStreaksMiddlewares[2]).toBe(sendSoloStreaksForCurrentUserMiddleware);
    });
});
