/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllTeamStreaksMiddlewares,
    getTeamStreaksQueryValidationMiddleware,
    getFindTeamStreaksMiddleware,
    findTeamStreaksMiddleware,
    sendTeamStreaksMiddleware,
    retreiveTeamStreaksMembersInformationMiddleware,
    getRetreiveTeamStreaksMembersInformationMiddleware,
} from './getAllTeamStreaksMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { GetAllTeamStreaksSortFields } from '@streakoid/streakoid-sdk/lib/teamStreaks';

describe('getTeamStreaksValidationMiddleware', () => {
    const creatorId = 'creatorId';
    const memberId = 'memberId';
    const timezone = 'timezone';
    const status = StreakStatus.live;
    const completedToday = true;
    const active = true;
    const sortField = GetAllTeamStreaksSortFields.currentStreak;
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
        expect.assertions(4);

        const lean = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ lean }));
        const teamStreakModel = {
            find,
        };
        const creatorId = '1234';
        const request: any = { query: { creatorId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ creatorId });
        expect(lean).toBeCalledWith();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just memberId and sets response.locals.TeamStreaks', async () => {
        expect.assertions(4);

        const lean = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ lean }));
        const teamStreakModel = {
            find,
        };
        const memberId = '1234';
        const request: any = { query: { memberId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ 'members.memberId': memberId });
        expect(lean).toBeCalledWith();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just timezone and sets response.locals.TeamStreaks', async () => {
        expect.assertions(4);

        const lean = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ lean }));
        const teamStreakModel = {
            find,
        };
        const timezone = 'Europe/London';
        const request: any = { query: { timezone } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ timezone });
        expect(lean).toBeCalledWith();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with status and sets response.locals.TeamStreaks', async () => {
        expect.assertions(4);

        const lean = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ lean }));
        const teamStreakModel = {
            find,
        };
        const status = 'active';
        const request: any = { query: { status } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindTeamStreaksMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ status });
        expect(lean).toBeCalledWith();
        expect(response.locals.teamStreaks).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with a sortField and sets response.locals.TeamStreaks with a sorted list of team streaks', async () => {
        expect.assertions(5);

        const lean = jest.fn().mockResolvedValue(true);
        const sort = jest.fn(() => ({ lean }));
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

        expect(find).toBeCalledWith({});
        expect(sort).toBeCalledWith({ 'currentStreak.numberOfDaysInARow': -1 });
        expect(lean).toBeCalledWith();
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

describe('retreiveTeamStreakMembersInformationMiddleware', () => {
    test('retreives team streak members information for each team team and sets response.locals.TeamStreaks', async () => {
        expect.assertions(5);

        const user = {
            _id: '12345678',
            username: 'usernames',
            profileImages: { originalImageUrl: 'streakoid.com/user' },
        };
        const lean = jest.fn().mockResolvedValue(user);
        const findOne = jest.fn(() => ({ lean }));
        const userModel: any = {
            findOne,
        };
        const teamStreakModel: any = {
            findOne,
        };
        const members = ['12345678'];
        const teamStreak = { _id: 'abc', members };
        const teamStreaks = [teamStreak];
        const request: any = {};
        const response: any = { locals: { teamStreaks } };
        const next = jest.fn();

        const middleware = getRetreiveTeamStreaksMembersInformationMiddleware(userModel, teamStreakModel);
        await middleware(request, response, next);

        expect(findOne).toHaveBeenCalledTimes(2);
        expect(lean).toHaveBeenCalledTimes(2);

        expect(response.locals.teamStreaks).toBeDefined();
        const member = response.locals.teamStreaks[0].members[0];
        expect(Object.keys(member)).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak']);

        expect(next).toBeCalledWith();
    });

    test('calls next with RetreiveTeamStreakMembersInformation on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getRetreiveTeamStreaksMembersInformationMiddleware({} as any, {} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.RetreiveTeamStreaksMembersInformation, expect.any(Error)),
        );
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
        expect.assertions(5);

        expect(getAllTeamStreaksMiddlewares.length).toEqual(4);
        expect(getAllTeamStreaksMiddlewares[0]).toBe(getTeamStreaksQueryValidationMiddleware);
        expect(getAllTeamStreaksMiddlewares[1]).toBe(findTeamStreaksMiddleware);
        expect(getAllTeamStreaksMiddlewares[2]).toBe(retreiveTeamStreaksMembersInformationMiddleware);
        expect(getAllTeamStreaksMiddlewares[3]).toBe(sendTeamStreaksMiddleware);
    });
});
