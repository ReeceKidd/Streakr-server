/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllTeamMemberStreaksMiddlewares,
    getTeamMemberStreaksQueryValidationMiddleware,
    getFindTeamMemberStreaksMiddleware,
    findTeamMemberStreaksMiddleware,
    sendTeamMemberStreaksMiddleware,
} from './getAllTeamMemberStreaksMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { GetAllTeamMemberStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamMemberStreaks';
import TeamVisibilityTypes from '@streakoid/streakoid-models/lib/Types/TeamVisibilityTypes';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

describe('getTeamMemberStreaksValidationMiddleware', () => {
    const userId = 'userId';
    const teamStreakId = 'teamStreakId';
    const completedToday = true;
    const timezone = 'Europe/London';
    const active = true;
    const sortField = GetAllTeamMemberStreaksSortFields.currentStreak;
    const limit = 10;
    const status = StreakStatus.live;

    const query = {
        userId,
        teamStreakId,
        completedToday,
        timezone,
        active,
        sortField,
        limit,
        status,
    };

    test('passes valid request', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getTeamMemberStreaksQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findTeamMemberStreaksMiddleware', () => {
    test('queries database with just userId and sets response.locals.teamMemberStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const teamMemberStreakModel = {
            find,
        };
        const userId = '1234';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId, visibility: TeamVisibilityTypes.everyone });
        expect(limit).toBeCalled();
        expect(response.locals.teamMemberStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just timezone and sets response.locals.teamMemberStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const teamMemberStreakModel = {
            find,
        };
        const timezone = 'Europe/London';
        const request: any = { query: { timezone } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ timezone, visibility: TeamVisibilityTypes.everyone });
        expect(limit).toBeCalled();
        expect(response.locals.teamMemberStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just completedToday and sets response.locals.teamMemberStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const teamMemberStreakModel = {
            find,
        };
        const completedToday = 'true';
        const request: any = { query: { completedToday } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ completedToday: true, visibility: TeamVisibilityTypes.everyone });
        expect(limit).toBeCalled();
        expect(response.locals.teamMemberStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just active and sets response.locals.teamMemberStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const teamMemberStreakModel = {
            find,
        };
        const active = 'true';
        const request: any = { query: { active } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ active: true, visibility: TeamVisibilityTypes.everyone });
        expect(limit).toBeCalled();
        expect(response.locals.teamMemberStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just status and sets response.locals.teamMemberStreaks', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const teamMemberStreakModel = {
            find,
        };
        const status = StreakStatus.live;
        const request: any = { query: { status } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ status, visibility: TeamVisibilityTypes.everyone });
        expect(limit).toBeCalled();
        expect(response.locals.teamMemberStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('if sort field is equal to current streak it queries team streaks and sorts them by current streak and sets response.locals.TeamStreaks with a sorted list of team streaks', async () => {
        expect.assertions(5);

        const limit = jest.fn().mockResolvedValue(true);
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const teamMemberStreakModel = {
            find,
        };
        const sortField = GetAllTeamMemberStreaksSortFields.currentStreak;
        const request: any = { query: { sortField } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ visibility: TeamVisibilityTypes.everyone });
        expect(sort).toBeCalledWith({ 'currentStreak.numberOfDaysInARow': -1 });
        expect(limit).toBeCalled();
        expect(response.locals.teamMemberStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('if sort field is equal to longest team streak it queries team streaks and sorts them by longest team streak and sets response.locals.TeamStreaks with a sorted list of team streaks', async () => {
        expect.assertions(5);

        const limit = jest.fn().mockResolvedValue(true);
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const teamMemberStreakModel = {
            find,
        };
        const sortField = GetAllTeamMemberStreaksSortFields.longestTeamMemberStreak;
        const request: any = { query: { sortField } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ visibility: TeamVisibilityTypes.everyone });
        expect(sort).toBeCalledWith({ 'longestTeamMemberStreak.numberOfDays': -1 });
        expect(limit).toBeCalled();
        expect(response.locals.teamMemberStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindTeamMemberStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'error';
        const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const teamMemberStreakModel = {
            find,
        };
        const request: any = { query: { userId: '1234' } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindTeamMemberStreaksMiddleware, expect.any(Error)));
    });
});

describe('sendTeamMemberStreaksMiddleware', () => {
    test('sends teamMemberStreaks in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const teamMemberStreaks = [
            {
                name: '30 minutes reading',
                description: 'Read for 30 minutes everyday',
                userId: '1234',
            },
        ];
        const response: any = { locals: { teamMemberStreaks }, status };
        const next = jest.fn();

        sendTeamMemberStreaksMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(teamMemberStreaks);
    });

    test('calls next with SendTeamMemberStreaksMiddleware on middleware failure', () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'sendTeamMemberStreaks error';
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendTeamMemberStreaksMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTeamMemberStreaksMiddleware, expect.any(Error)));
    });
});

describe(`getAllTeamMemberStreaksMiddlewares`, () => {
    test('that getTeamMemberStreaksMiddlewares are defined in the correct order', async () => {
        expect.assertions(3);

        expect(getAllTeamMemberStreaksMiddlewares[0]).toBe(getTeamMemberStreaksQueryValidationMiddleware);
        expect(getAllTeamMemberStreaksMiddlewares[1]).toBe(findTeamMemberStreaksMiddleware);
        expect(getAllTeamMemberStreaksMiddlewares[2]).toBe(sendTeamMemberStreaksMiddleware);
    });
});
