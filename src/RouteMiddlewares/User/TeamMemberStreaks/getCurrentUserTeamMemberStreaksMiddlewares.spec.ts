/* eslint-disable @typescript-eslint/no-explicit-any */

import { GetAllTeamMemberStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamMemberStreaks';
import {
    getCurrentUserTeamMemberStreaksQueryValidationMiddleware,
    getFindCurrentUserTeamMemberStreaksMiddleware,
    findCurrentUserTeamMemberStreaksMiddleware,
    sendCurrentUserTeamMemberStreaksMiddleware,
    getCurrentUserTeamMemberStreaksMiddlewares,
} from './getCurrentUserTeamMemberStreaksMiddlewares';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';
import { getMockUser } from '../../../testHelpers/getMockUser';

describe('getCurrentUserTeamMemberStreaksValidationMiddleware', () => {
    const teamStreakId = 'teamStreakId';
    const completedToday = true;
    const timezone = 'Europe/London';
    const active = true;
    const sortField = GetAllTeamMemberStreaksSortFields.currentStreak;
    const limit = 10;

    const query = {
        teamStreakId,
        completedToday,
        timezone,
        active,
        sortField,
        limit,
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

        getCurrentUserTeamMemberStreaksQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findCurrentUserTeamMemberStreaksMiddleware', () => {
    test('queries database with just timezone and sets response.locals.teamMemberStreaks', async () => {
        expect.assertions(4);

        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const teamMemberStreakModel = {
            find,
        };
        const timezone = 'Europe/London';
        const request: any = { query: { timezone } };
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindCurrentUserTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ timezone, userId: user._id });
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
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindCurrentUserTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ completedToday: true, userId: user._id });
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
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindCurrentUserTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ active: true, userId: user._id });
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
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindCurrentUserTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId: user._id });
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
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getFindCurrentUserTeamMemberStreaksMiddleware(teamMemberStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId: user._id });
        expect(sort).toBeCalledWith({ 'longestTeamMemberStreak.numberOfDays': -1 });
        expect(limit).toBeCalled();
        expect(response.locals.teamMemberStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindTeamMemberStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindCurrentUserTeamMemberStreaksMiddleware({} as any);

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

        sendCurrentUserTeamMemberStreaksMiddleware(request, response, next);

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

        sendCurrentUserTeamMemberStreaksMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTeamMemberStreaksMiddleware, expect.any(Error)));
    });
});

describe(`getCurrentUserTeamMemberStreaksMiddlewares`, () => {
    test('that getTeamMemberStreaksMiddlewares are defined in the correct order', async () => {
        expect.assertions(3);

        expect(getCurrentUserTeamMemberStreaksMiddlewares[0]).toBe(
            getCurrentUserTeamMemberStreaksQueryValidationMiddleware,
        );
        expect(getCurrentUserTeamMemberStreaksMiddlewares[1]).toBe(findCurrentUserTeamMemberStreaksMiddleware);
        expect(getCurrentUserTeamMemberStreaksMiddlewares[2]).toBe(sendCurrentUserTeamMemberStreaksMiddleware);
    });
});
