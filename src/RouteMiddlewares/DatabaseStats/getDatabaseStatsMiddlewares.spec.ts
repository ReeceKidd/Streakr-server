/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getDatabaseStatsMiddlewares,
    getCountTotalUsersMiddleware,
    getCountTotalLiveSoloStreaksMiddleware,
    getCountTotalLiveChallengeStreaksMiddleware,
    getCountTotalLiveTeamStreaksMiddleware,
    getCountTotalStreaksCreatedMiddleware,
    sendDatabaseStatsMiddleware,
    countTotalUsersMiddleware,
    countTotalLiveSoloStreaksMiddleware,
    countTotalLiveChallengeStreaksMiddleware,
    countTotalLiveTeamStreaksMiddleware,
    countTotalStreaksCreatedMiddleware,
} from './getDatabaseStatsMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakStatus } from '@streakoid/streakoid-sdk/lib';

describe('countTotalUserMiddlewares', () => {
    test('counts total number of users in the database', async () => {
        expect.assertions(3);
        const count = jest.fn().mockResolvedValue(10);
        const userModel = {
            count,
        };
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalUsersMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(count).toBeCalledWith({});
        expect(response.locals.totalUsers).toEqual(10);
        expect(next).toBeCalledWith();
    });

    test('calls next with CountTotalUsersMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalUsersMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CountTotalUsersMiddleware, expect.any(Error)));
    });
});

describe('countTotalLiveSoloStreaksMiddlewares', () => {
    test('counts total number of live solo streaks in the database', async () => {
        expect.assertions(3);
        const count = jest.fn().mockResolvedValue(10);
        const soloStreakModel = {
            count,
        };
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalLiveSoloStreaksMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(count).toBeCalledWith({ status: StreakStatus.live });
        expect(response.locals.totalLiveSoloStreaks).toEqual(10);
        expect(next).toBeCalledWith();
    });

    test('calls next with CountTotalLiveSoloStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalLiveSoloStreaksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CountTotalLiveSoloStreaksMiddleware, expect.any(Error)));
    });
});

describe('countTotalLiveChalengeStreakMiddlewares', () => {
    test('counts total number of live solo streaks in the database', async () => {
        expect.assertions(3);
        const count = jest.fn().mockResolvedValue(10);
        const challengeStreakModel = {
            count,
        };
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalLiveChallengeStreaksMiddleware(challengeStreakModel as any);

        await middleware(request, response, next);

        expect(count).toBeCalledWith({ status: StreakStatus.live });
        expect(response.locals.totalLiveChallengeStreaks).toEqual(10);
        expect(next).toBeCalledWith();
    });

    test('calls next with CountTotalLiveChallengeStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalLiveChallengeStreaksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CountTotalLiveChallengeStreaksMiddleware, expect.any(Error)),
        );
    });
});

describe('countTotalLiveTeamStreakMiddlewares', () => {
    test('counts total number of live team streaks in the database', async () => {
        expect.assertions(3);
        const count = jest.fn().mockResolvedValue(10);
        const teamStreakModel = {
            count,
        };
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalLiveTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(count).toBeCalledWith({ status: StreakStatus.live });
        expect(response.locals.totalLiveTeamStreaks).toEqual(10);
        expect(next).toBeCalledWith();
    });

    test('calls next with CountTotalLiveTeamStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalLiveTeamStreaksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CountTotalLiveTeamStreaksMiddleware, expect.any(Error)));
    });
});

describe('countTotalStreakMiddlewares', () => {
    test('counts total number of streaks in the database', async () => {
        expect.assertions(3);
        const count = jest.fn().mockResolvedValue(10);
        const soloStreakModel = {
            count,
        };
        const challengeStreakModel = {
            count,
        };
        const teamMemberStreakModel = {
            count,
        };
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalStreaksCreatedMiddleware(
            soloStreakModel as any,
            challengeStreakModel as any,
            teamMemberStreakModel as any,
        );

        await middleware(request, response, next);

        expect(count).toBeCalledWith({});
        expect(response.locals.totalStreaks).toEqual(30);
        expect(next).toBeCalledWith();
    });

    test('calls next with CountTotalStreaksCreatedMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getCountTotalStreaksCreatedMiddleware({} as any, {} as any, {} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CountTotalStreaksCreatedMiddleware, expect.any(Error)));
    });
});

describe('sendDatabaseStatsMiddleware', () => {
    test('sends database stats in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = {
            locals: {
                totalUsers: 0,
                totalLiveSoloStreaks: 0,
                totalLiveChallengeStreaks: 0,
                totalLiveTeamStreaks: 0,
                totalStreaks: 0,
            },
            status,
        };
        const next = jest.fn();

        sendDatabaseStatsMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith({
            totalUsers: 0,
            totalLiveSoloStreaks: 0,
            totalLiveChallengeStreaks: 0,
            totalLiveTeamStreaks: 0,
            totalStreaks: 0,
        });
    });

    test('calls next with SendDatabaseStatsMiddleware on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendDatabaseStatsMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendDatabaseStatsMiddleware, expect.any(Error)));
    });
});

describe(`getDatabaseStatsMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(7);

        expect(getDatabaseStatsMiddlewares.length).toEqual(6);
        expect(getDatabaseStatsMiddlewares[0]).toBe(countTotalUsersMiddleware);
        expect(getDatabaseStatsMiddlewares[1]).toBe(countTotalLiveSoloStreaksMiddleware);
        expect(getDatabaseStatsMiddlewares[2]).toBe(countTotalLiveChallengeStreaksMiddleware);
        expect(getDatabaseStatsMiddlewares[3]).toBe(countTotalLiveTeamStreaksMiddleware);
        expect(getDatabaseStatsMiddlewares[4]).toBe(countTotalStreaksCreatedMiddleware);
        expect(getDatabaseStatsMiddlewares[5]).toBe(sendDatabaseStatsMiddleware);
    });
});
