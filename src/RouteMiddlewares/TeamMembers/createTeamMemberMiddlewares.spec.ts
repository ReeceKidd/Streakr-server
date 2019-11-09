/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createTeamMemberMiddlewares,
    teamStreakExistsMiddleware,
    createTeamMemberBodyValidationMiddleware,
    friendExistsMiddleware,
    getAddFriendToTeamStreakMiddleware,
    sendCreateTeamMemberResponseMiddleware,
    getFriendExistsMiddleware,
    getTeamStreakExistsMiddleware,
    getCreateTeamMemberStreakMiddleware,
    createTeamMemberStreakMiddleware,
    addFriendToTeamStreakMiddleware,
    createTeamMemberParamsValidationMiddleware,
} from './createTeamMemberMiddlewares';

describe(`createTeamMemberParamsValidationMiddleware`, () => {
    const teamStreakId = 'abcdefg';

    const params = {
        teamStreakId,
    };

    test('valid request passes validation', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createTeamMemberParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends teamStreakId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { ...params, teamStreakId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createTeamMemberParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`createTeamMemberBodyValidationMiddleware`, () => {
    const friendId = '12345678';

    const body = {
        friendId,
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

        createTeamMemberBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends friendId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, friendId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createTeamMemberBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "friendId" fails because ["friendId" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('friendExistsMiddleware', () => {
    test('sets response.locals.friend and calls next()', async () => {
        expect.assertions(4);
        const lean = jest.fn(() => true);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const friendId = 'abcdefg';
        const request: any = { body: { friendId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFriendExistsMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.friend).toBeDefined();
        expect(findOne).toBeCalledWith({ _id: friendId });
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateTeamMemberFriendDoesNotExist when friend does not exist', async () => {
        expect.assertions(1);
        const friendId = 'abcd';
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = { body: { friendId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFriendExistsMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamMemberFriendDoesNotExist));
    });

    test('throws CreateTeamMemberTeamStreakExistsMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFriendExistsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateTeamMemberFriendExistsMiddleware, expect.any(Error)),
        );
    });
});

describe('teamStreakExistsMiddleware', () => {
    test('sets response.locals.teamStreak and calls next()', async () => {
        expect.assertions(3);
        const teamStreakId = 'abc';
        const request: any = {
            params: { teamStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(true);
        const findOne = jest.fn(() => ({ lean }));
        const teamStreakModel = { findOne };
        const middleware = getTeamStreakExistsMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: teamStreakId });
        expect(response.locals.teamStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws CreateTeamMemberTeamStreakDoesNotExist error when team streak does not exist', async () => {
        expect.assertions(1);
        const teamStreakId = 'abc';
        const request: any = {
            params: { teamStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const lean = jest.fn().mockResolvedValue(false);
        const findOne = jest.fn(() => ({ lean }));
        const TeamStreakModel = { findOne };
        const middleware = getTeamStreakExistsMiddleware(TeamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamMemberTeamStreakDoesNotExist));
    });

    test('throws CreateTeamMemberTeamStreakExistsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getTeamStreakExistsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateTeamMemberTeamStreakExistsMiddleware, expect.any(Error)),
        );
    });
});

describe(`createTeamMemberStreakMiddleware`, () => {
    test('sets response.locals.teamMemberStreak', async () => {
        expect.assertions(2);

        const friendId = 'abcdefg';
        const teamStreakId = '1a2b3c';
        const timezone = 'Europe/London';
        const save = jest.fn().mockResolvedValue(true);
        class TeamMember {
            userId: string;
            teamStreakId: string;
            timezone: string;

            constructor({ friendId, teamStreakId, timezone }: any) {
                this.userId = friendId;
                this.teamStreakId = teamStreakId;
                this.timezone = timezone;
            }

            save = save;
        }
        const response: any = { locals: { timezone } };
        const request: any = { body: { friendId }, params: { teamStreakId } };
        const next = jest.fn();
        const middleware = getCreateTeamMemberStreakMiddleware(TeamMember as any);

        await middleware(request, response, next);

        expect(save).toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('calls next with CreateTeamMemberCreateTeamMemberStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateTeamMemberStreakMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateTeamMemberCreateTeamMemberStreakMiddleware, expect.any(Error)),
        );
    });
});

describe(`addFriendToTeamStreakMiddleware`, () => {
    test('sets response.locals.teamStreak to the updatedTeamStreak', async () => {
        expect.assertions(3);
        const lean = jest.fn().mockResolvedValue(true);
        const findByIdAndUpdate = jest.fn(() => ({ lean }));
        const TeamStreakModel: any = {
            findByIdAndUpdate,
        };
        const teamMemberStreakId = 2;
        const teamMemberStreak = {
            _id: teamMemberStreakId,
        };
        const members: any[] = [];
        const teamStreakId = 1;
        const teamStreak = {
            _id: teamStreakId,
            members,
        };
        const friendId = 'abc';
        const friend = {
            friendId,
        };
        const request: any = { body: { friendId }, params: { teamStreakId } };
        const response: any = { locals: { teamStreak, teamMemberStreak, friend } };
        const next: any = jest.fn();
        const middleware = await getAddFriendToTeamStreakMiddleware(TeamStreakModel);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(
            teamStreakId,
            {
                members: [{ memberId: friendId, teamMemberStreakId }],
            },
            { new: true },
        );
        expect(lean).toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('calls next with AddFriendToTeamStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getAddFriendToTeamStreakMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AddFriendToTeamStreakMiddleware, expect.any(Error)));
    });
});

describe(`sendCreateTeamMemberResponseMiddleware`, () => {
    test('responds with status 201 with teamMember', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const memberId = 'memberId';
        const teamStreakId = 'teamStreakId';
        const members = [{ memberId, teamStreakId }];
        const teamStreak = {
            members,
        };
        const response: any = { locals: { teamStreak }, status };
        const request: any = {};
        const next = jest.fn();

        sendCreateTeamMemberResponseMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(teamStreak.members);
    });

    test('calls next with SendFormattedTeamMemberMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendCreateTeamMemberResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCreateTeamMemberResponseMiddleware, expect.any(Error)),
        );
    });
});

describe(`createTeamMemberMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(8);

        expect(createTeamMemberMiddlewares.length).toEqual(7);
        expect(createTeamMemberMiddlewares[0]).toBe(createTeamMemberParamsValidationMiddleware);
        expect(createTeamMemberMiddlewares[1]).toBe(createTeamMemberBodyValidationMiddleware);
        expect(createTeamMemberMiddlewares[2]).toBe(friendExistsMiddleware);
        expect(createTeamMemberMiddlewares[3]).toBe(teamStreakExistsMiddleware);
        expect(createTeamMemberMiddlewares[4]).toBe(createTeamMemberStreakMiddleware);
        expect(createTeamMemberMiddlewares[5]).toBe(addFriendToTeamStreakMiddleware);
        expect(createTeamMemberMiddlewares[6]).toBe(sendCreateTeamMemberResponseMiddleware);
    });
});
