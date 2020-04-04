/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createTeamMemberMiddlewares,
    teamStreakExistsMiddleware,
    createTeamMemberBodyValidationMiddleware,
    getAddFollowerToTeamStreakMiddleware,
    sendCreateTeamMemberResponseMiddleware,
    getTeamStreakExistsMiddleware,
    getCreateTeamMemberStreakMiddleware,
    createTeamMemberStreakMiddleware,
    createTeamMemberParamsValidationMiddleware,
    getCreateJoinedTeamStreakActivityFeedItemMiddleware,
    createJoinedTeamStreakActivityFeedItemMiddleware,
    getFollowerExistsMiddleware,
    followerExistsMiddleware,
    addFollowerToTeamStreakMiddleware,
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
    const followerId = '12345678';

    const body = {
        followerId,
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

    test('sends followerId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, followerId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createTeamMemberBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "followerId" fails because ["followerId" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('followerExistsMiddleware', () => {
    test('sets response.locals.follower and calls next()', async () => {
        expect.assertions(4);
        const lean = jest.fn(() => true);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const followerId = 'abcdefg';
        const request: any = { body: { followerId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFollowerExistsMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.follower).toBeDefined();
        expect(findOne).toBeCalledWith({ _id: followerId });
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateTeamMemberFollowerDoesNotExist when follower does not exist', async () => {
        expect.assertions(1);
        const followerId = 'abcd';
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = { body: { followerId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFollowerExistsMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamMemberFollowerDoesNotExist));
    });

    test('throws CreateTeamMemberTeamStreakExistsMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFollowerExistsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateTeamMemberFollowerExistsMiddleware, expect.any(Error)),
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

        const followerId = 'abcdefg';
        const teamStreakId = '1a2b3c';
        const timezone = 'Europe/London';
        const save = jest.fn().mockResolvedValue(true);
        class TeamMember {
            userId: string;
            teamStreakId: string;
            timezone: string;

            constructor({ followerId, teamStreakId, timezone }: any) {
                this.userId = followerId;
                this.teamStreakId = teamStreakId;
                this.timezone = timezone;
            }

            save = save;
        }
        const response: any = { locals: { timezone } };
        const request: any = { body: { followerId }, params: { teamStreakId } };
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

describe(`addFollowerToTeamStreakMiddleware`, () => {
    test('sets response.locals.teamStreak to the updatedTeamStreak', async () => {
        expect.assertions(3);
        const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
        const teamStreakModel: any = {
            findByIdAndUpdate,
        };
        const teamMemberStreakId = 2;
        const teamMemberStreak = {
            _id: teamMemberStreakId,
        };
        const teamStreakId = 1;
        const followerId = 'abc';
        const follower = {
            followerId,
        };
        const request: any = { body: { followerId }, params: { teamStreakId } };
        const response: any = { locals: { teamMemberStreak, follower } };
        const next: any = jest.fn();
        const middleware = await getAddFollowerToTeamStreakMiddleware(teamStreakModel);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(teamStreakId, {
            $addToSet: { members: { memberId: followerId, teamMemberStreakId: teamMemberStreak._id } },
        });

        expect(next).toBeCalledWith();
        expect(response.locals.teamMember).toBeDefined();
    });

    test('calls next with AddFollowerToTeamStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getAddFollowerToTeamStreakMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AddFollowerToTeamStreakMiddleware, expect.any(Error)));
    });
});

describe(`sendCreateTeamMemberResponseMiddleware`, () => {
    test('responds with status 201 with teamMember', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const memberId = 'memberId';
        const teamMember = {
            memberId,
        };
        const response: any = { locals: { teamMember }, status };
        const request: any = {};
        const next = jest.fn();

        sendCreateTeamMemberResponseMiddleware(request, response, next);

        expect(next).toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(teamMember);
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

describe(`createJoinedTeamStreakActivityFeedItemMiddleware`, () => {
    test('creates a new createJoinedTeamStreakActivity', async () => {
        expect.assertions(2);
        const user = { _id: '_id' };
        const teamStreak = { _id: '_id' };
        const save = jest.fn().mockResolvedValue(true);
        const activityModel = jest.fn(() => ({ save }));

        const response: any = { locals: { user, teamStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateJoinedTeamStreakActivityFeedItemMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(save).toBeCalled();
        expect(next).not.toBeCalled();
    });

    test('calls next with CreateJoinedTeamStreakActivityFeedItemMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getCreateJoinedTeamStreakActivityFeedItemMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateJoinedTeamStreakActivityFeedItemMiddleware, expect.any(Error)),
        );
    });
});

describe(`createTeamMemberMiddlewares`, () => {
    test('are defined in the correct order', async () => {
        expect.assertions(9);

        expect(createTeamMemberMiddlewares.length).toEqual(8);
        expect(createTeamMemberMiddlewares[0]).toBe(createTeamMemberParamsValidationMiddleware);
        expect(createTeamMemberMiddlewares[1]).toBe(createTeamMemberBodyValidationMiddleware);
        expect(createTeamMemberMiddlewares[2]).toBe(followerExistsMiddleware);
        expect(createTeamMemberMiddlewares[3]).toBe(teamStreakExistsMiddleware);
        expect(createTeamMemberMiddlewares[4]).toBe(createTeamMemberStreakMiddleware);
        expect(createTeamMemberMiddlewares[5]).toBe(addFollowerToTeamStreakMiddleware);
        expect(createTeamMemberMiddlewares[6]).toBe(sendCreateTeamMemberResponseMiddleware);
        expect(createTeamMemberMiddlewares[7]).toBe(createJoinedTeamStreakActivityFeedItemMiddleware);
    });
});
