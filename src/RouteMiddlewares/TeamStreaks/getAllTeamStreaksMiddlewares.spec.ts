/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllTeamStreaksMiddlewares,
    getTeamStreaksQueryValidationMiddleware,
    getFindTeamStreaksMiddleware,
    findTeamStreaksMiddleware,
    sendTeamStreaksMiddleware,
    retrieveTeamStreaksMembersInformationMiddleware,
    getRetrieveTeamStreaksMembersInformationMiddleware,
    formatTeamStreaksMiddleware,
} from './getAllTeamStreaksMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { GetAllTeamStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamStreaks';
import { getMockUser } from '../../testHelpers/getMockUser';
import { getMockTeamMemberStreak } from '../../testHelpers/getMockTeamMemberStreak';
import TeamVisibilityTypes from '@streakoid/streakoid-models/lib/Types/TeamVisibilityTypes';

describe('getTeamStreaksValidationMiddleware', () => {
    const creatorId = 'creatorId';
    const memberId = 'memberId';
    const timezone = 'timezone';
    const status = StreakStatus.live;
    const completedToday = true;
    const active = true;
    const sortField = 'currentStreak';
    const query = {
        creatorId,
        memberId,
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

        getTeamStreaksQueryValidationMiddleware(request, response, next);

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
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ creatorId, visibility: TeamVisibilityTypes.everyone });
        expect(limit).toBeCalled();
        expect(lean).toBeCalled();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just memberId and sets response.locals.teamStreaks', async () => {
        expect.assertions(5);
        const lean = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ lean }));
        const find = jest.fn(() => ({ limit }));
        const teamStreakModel = {
            find,
        };
        const memberId = '1234';
        const request: any = { query: { memberId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ 'members.memberId': memberId, visibility: TeamVisibilityTypes.everyone });
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
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ timezone, visibility: TeamVisibilityTypes.everyone });
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
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ status, visibility: TeamVisibilityTypes.everyone });
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
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ visibility: TeamVisibilityTypes.everyone });
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
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ visibility: TeamVisibilityTypes.everyone });
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
        const middleware = getFindTeamStreaksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindTeamStreaksMiddleware, expect.any(Error)));
    });
});

describe('retrieveTeamStreakMembersInformationMiddleware', () => {
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

        const middleware = getRetrieveTeamStreaksMembersInformationMiddleware(userModel, teamMemberStreakModel);
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

        const middleware = getRetrieveTeamStreaksMembersInformationMiddleware({} as any, {} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.RetrieveTeamStreaksMembersInformation, expect.any(Error)),
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

        formatTeamStreaksMiddleware(request, response, next);

        expect(response.locals.teamStreaks[0].inviteKey).toBeUndefined();
        expect(next).toBeCalled();
    });

    test('calls next with FormatTeamStreaksMiddleware on middleware failure', () => {
        expect.assertions(1);
        const response: any = { locals: {} };
        const request: any = {};
        const next = jest.fn();

        formatTeamStreaksMiddleware(request, response, next);

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

        sendTeamStreaksMiddleware(request, response, next);

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

        sendTeamStreaksMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTeamStreaksMiddleware, expect.any(Error)));
    });
});

describe(`getAllTeamStreaksMiddlewares`, () => {
    test('that getTeamStreaksMiddlewares are defined in the correct order', async () => {
        expect.assertions(6);

        expect(getAllTeamStreaksMiddlewares.length).toEqual(5);
        expect(getAllTeamStreaksMiddlewares[0]).toBe(getTeamStreaksQueryValidationMiddleware);
        expect(getAllTeamStreaksMiddlewares[1]).toBe(findTeamStreaksMiddleware);
        expect(getAllTeamStreaksMiddlewares[2]).toBe(retrieveTeamStreaksMembersInformationMiddleware);
        expect(getAllTeamStreaksMiddlewares[3]).toBe(formatTeamStreaksMiddleware);
        expect(getAllTeamStreaksMiddlewares[4]).toBe(sendTeamStreaksMiddleware);
    });
});
