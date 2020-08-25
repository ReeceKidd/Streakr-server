/* eslint-disable @typescript-eslint/no-explicit-any */

import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { GetAllTeamStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamStreaks';
import {
    getCurrentUserTeamStreaksQueryValidationMiddleware,
    getCurrentUserFindTeamStreaksMiddleware,
    getCurrentUserTeamStreaksMiddlewares,
    getRetrieveCurrentUserTeamStreaksMembersInformationMiddleware,
    findCurrentUserTeamStreaksMiddleware,
    formatCurrentUserTeamStreaksMiddleware,
    retrieveCurrentUserTeamStreaksMembersInformationMiddleware,
    sendCurrentUserTeamStreaksMiddleware,
} from './getCurrentUserTeamStreaksMiddlewares';
import { getMockUser } from '../../../testHelpers/getMockUser';
import { getMockTeamStreak } from '../../../testHelpers/getMockTeamStreak';
import { getMockTeamMemberStreak } from '../../../testHelpers/getMockTeamMemberStreak';
import { CustomError, ErrorType } from '../../../customError';
import { ResponseCodes } from '../../../Server/responseCodes';

describe('getTeamStreaksValidationMiddleware', () => {
    const creatorId = 'creatorId';
    const timezone = 'timezone';
    const status = StreakStatus.live;
    const completedToday = true;
    const active = true;
    const sortField = 'currentStreak';
    const query = {
        creatorId,
        timezone,
        status,
        completedToday,
        active,
        sortField,
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

        getCurrentUserTeamStreaksQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findTeamStreaksMiddleware', () => {
    test('queries database with just creatorId and sets response.locals.teamStreaks', async () => {
        expect.assertions(5);
        const lean = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ lean }));
        const find = jest.fn(() => ({ limit }));
        const teamStreakModel = {
            find,
        };
        const creatorId = '1234';
        const request: any = { query: { creatorId } };
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getCurrentUserFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ creatorId, ['members.memberId']: user._id });
        expect(limit).toBeCalled();
        expect(lean).toBeCalled();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just timezone and sets response.locals.teamStreaks', async () => {
        expect.assertions(5);
        const lean = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ lean }));
        const find = jest.fn(() => ({ limit }));
        const teamStreakModel = {
            find,
        };
        const timezone = 'Europe/London';
        const request: any = { query: { timezone } };
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getCurrentUserFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ timezone, ['members.memberId']: user._id });
        expect(limit).toBeCalled();
        expect(lean).toBeCalled();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with status and sets response.locals.teamStreaks', async () => {
        expect.assertions(5);
        const lean = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ lean }));
        const find = jest.fn(() => ({ limit }));
        const teamStreakModel = {
            find,
        };
        const status = 'active';
        const request: any = { query: { status } };
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getCurrentUserFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ status, ['members.memberId']: user._id });
        expect(limit).toBeCalled();
        expect(lean).toBeCalled();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('if sort field is equal to current streak it queries team streaks and sorts them by current streak and sets response.locals.teamStreaks with a sorted list of team streaks', async () => {
        expect.assertions(6);
        const lean = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ lean }));
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const teamStreakModel = {
            find,
        };
        const sortField = GetAllTeamStreaksSortFields.currentStreak;
        const request: any = { query: { sortField } };
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getCurrentUserFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ ['members.memberId']: user._id });
        expect(sort).toBeCalledWith({ 'currentStreak.numberOfDaysInARow': -1 });
        expect(limit).toBeCalled();
        expect(lean).toBeCalled();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('if sort field is equal to longest team streak it queries team streaks and sorts them by longest team streak and sets response.locals.teamStreaks with a sorted list of team streaks', async () => {
        expect.assertions(6);
        const lean = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ lean }));
        const sort = jest.fn(() => ({ limit }));
        const find = jest.fn(() => ({ sort }));
        const teamStreakModel = {
            find,
        };
        const sortField = GetAllTeamStreaksSortFields.longestTeamStreak;
        const request: any = { query: { sortField } };
        const user = getMockUser({ _id: 'userId' });
        const response: any = { locals: { user } };
        const next = jest.fn();
        const middleware = getCurrentUserFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ ['members.memberId']: user._id });
        expect(sort).toBeCalledWith({ 'longestTeamStreak.numberOfDays': -1 });
        expect(limit).toBeCalled();
        expect(lean).toBeCalled();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindTeamStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getCurrentUserFindTeamStreaksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindCurrentUserTeamStreaksMiddleware, expect.any(Error)));
    });
});

describe('retrieveCurrentUserTeamStreakMembersInformationMiddleware', () => {
    test('retrieves team streak members information for each team team and sets response.locals.teamStreaks', async () => {
        expect.assertions(5);

        const user = getMockUser({ _id: 'userId' });
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const teamMemberStreak = getMockTeamMemberStreak({ user, teamStreak });

        const userFindOne = jest.fn().mockResolvedValue(user);
        const userModel: any = {
            findOne: userFindOne,
        };
        const teamMemberStreakFindOne = jest.fn().mockResolvedValue(teamMemberStreak);
        const teamMemberStreakModel: any = {
            findOne: teamMemberStreakFindOne,
        };
        const teamStreaks = [teamStreak];
        const request: any = {};
        const response: any = { locals: { teamStreaks } };
        const next = jest.fn();

        const middleware = getRetrieveCurrentUserTeamStreaksMembersInformationMiddleware(
            userModel,
            teamMemberStreakModel,
        );
        await middleware(request, response, next);

        expect(userFindOne).toBeCalled();
        expect(teamMemberStreakFindOne).toBeCalled();

        expect(response.locals.teamStreaks).toBeDefined();
        const member = response.locals.teamStreaks[0].members[0];
        expect(Object.keys(member)).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak']);

        expect(next).toBeCalledWith();
    });

    test('calls next with RetrieveTeamStreakMembersInformation on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getRetrieveCurrentUserTeamStreaksMembersInformationMiddleware({} as any, {} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.RetrieveCurrentUserTeamStreaksMembersInformation, expect.any(Error)),
        );
    });
});

describe('formatTeamStreaksMiddleware', () => {
    test('undefines the inviteKey for each team streak', () => {
        expect.assertions(2);
        const request: any = {};
        const teamStreaks = [getMockTeamStreak({ creatorId: 'creator' })];
        const response: any = { locals: { teamStreaks } };
        const next = jest.fn();

        formatCurrentUserTeamStreaksMiddleware(request, response, next);

        expect(response.locals.teamStreaks[0].inviteKey).toBeUndefined();
        expect(next).toBeCalled();
    });

    test('calls next with FormatTeamStreaksMiddleware on middleware failure', () => {
        expect.assertions(1);
        const response: any = { locals: {} };
        const request: any = {};
        const next = jest.fn();

        formatCurrentUserTeamStreaksMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormatTeamStreaksMiddleware, expect.any(Error)));
    });
});

describe('sendTeamStreaksMiddleware', () => {
    test('sends teamStreaks in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const teamStreaks = [
            {
                name: '30 minutes reading',
                description: 'Read for 30 minutes everyday',
                members: [
                    {
                        _id: 'abcd',
                        username: 'user',
                    },
                ],
            },
        ];
        const response: any = { locals: { teamStreaks }, status };
        const next = jest.fn();

        sendCurrentUserTeamStreaksMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(teamStreaks);
    });

    test('calls next with SendTeamStreaksMiddleware on middleware failure', () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'sendTeamStreaks error';
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendCurrentUserTeamStreaksMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendCurrentUserTeamStreaksMiddleware, expect.any(Error)));
    });
});

describe(`getCurrentUserTeamStreaksMiddlewares`, () => {
    test('that getCurrentUserTeamStreaksMiddlewares are defined in the correct order', async () => {
        expect.assertions(6);

        expect(getCurrentUserTeamStreaksMiddlewares.length).toEqual(5);
        expect(getCurrentUserTeamStreaksMiddlewares[0]).toBe(getCurrentUserTeamStreaksQueryValidationMiddleware);
        expect(getCurrentUserTeamStreaksMiddlewares[1]).toBe(findCurrentUserTeamStreaksMiddleware);
        expect(getCurrentUserTeamStreaksMiddlewares[2]).toBe(
            retrieveCurrentUserTeamStreaksMembersInformationMiddleware,
        );
        expect(getCurrentUserTeamStreaksMiddlewares[3]).toBe(formatCurrentUserTeamStreaksMiddleware);
        expect(getCurrentUserTeamStreaksMiddlewares[4]).toBe(sendCurrentUserTeamStreaksMiddleware);
    });
});
