/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createTeamMemberMiddlewares,
    teamStreakExistsMiddleware,
    createTeamMemberBodyValidationMiddleware,
    getAddUserToTeamStreakMiddleware,
    sendCreateTeamMemberResponseMiddleware,
    getTeamStreakExistsMiddleware,
    getCreateTeamMemberStreakMiddleware,
    createTeamMemberStreakMiddleware,
    createTeamMemberParamsValidationMiddleware,
    getCreateJoinedTeamStreakActivityFeedItemMiddleware,
    createJoinedTeamStreakActivityFeedItemMiddleware,
    getUserExistsMiddleware,
    userExistsMiddleware,
    addUserToTeamStreakMiddleware,
    preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware,
    notifiyOtherTeamMembersAboutNewTeamMemberMiddleware,
    getNotifyOtherTeamMembersAboutNewTeamMemberMiddleware,
} from './createTeamMemberMiddlewares';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { getMockUser } from '../../testHelpers/getMockUser';

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
    const userId = '12345678';

    const body = {
        userId,
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
});

describe('userExistsMiddleware', () => {
    test('sets response.locals.teamMember and calls next()', async () => {
        expect.assertions(4);
        const lean = jest.fn(() => getMockUser({ _id: 'abc' }));
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const userId = 'userId';
        const request: any = { body: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getUserExistsMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(response.locals.newTeamMember).toBeDefined();
        expect(findOne).toBeCalledWith({ _id: userId });
        expect(lean).toBeCalledWith();
        expect(next).toBeCalledWith();
    });

    test('throws CreateTeamMemberUserDoesNotExist when follower does not exist', async () => {
        expect.assertions(1);
        const userId = 'abcd';
        const lean = jest.fn(() => false);
        const findOne = jest.fn(() => ({ lean }));
        const userModel = { findOne };
        const request: any = { body: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getUserExistsMiddleware(userModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamMemberUserDoesNotExist));
    });

    test('throws CreateTeamMemberTeamStreakExistsMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getUserExistsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateTeamMemberUserExistsMiddleware, expect.any(Error)));
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

describe('preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware', () => {
    test('if new team member id is not already in the teamStreak members it calls next()', async () => {
        expect.assertions(1);
        const newTeamMember = getMockUser({ _id: 'abc' });
        const request: any = {};
        const teamStreak = getMockTeamStreak({ creatorId: 'creatorId' });
        const response: any = { locals: { teamStreak, newTeamMember } };
        const next = jest.fn();

        preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });

    test('if new team member id is already in the team streak it calls next() with TeamMemberIsAlreadyInTeamStreak.', async () => {
        expect.assertions(1);
        const newTeamMember = getMockUser({ _id: 'abc' });
        const request: any = {};
        const teamStreak = getMockTeamStreak({ creatorId: 'creatorId' });

        const response: any = {
            locals: {
                newTeamMember,
                teamStreak: { ...teamStreak, members: [...teamStreak.members, { memberId: newTeamMember._id }] },
            },
        };
        const next = jest.fn();

        preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.TeamMemberIsAlreadyInTeamStreak));
    });

    test('throws PreventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(
                ErrorType.PreventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware,
                expect.any(Error),
            ),
        );
    });
});

describe(`createTeamMemberStreakMiddleware`, () => {
    test('sets response.locals.teamMemberStreak', async () => {
        expect.assertions(2);

        const userId = 'abcdefg';
        const teamStreakId = '1a2b3c';
        const timezone = 'Europe/London';
        const save = jest.fn().mockResolvedValue(true);
        class TeamMember {
            userId: string;
            teamStreakId: string;
            timezone: string;

            constructor({ userId, teamStreakId, timezone }: any) {
                this.userId = userId;
                this.teamStreakId = teamStreakId;
                this.timezone = timezone;
            }

            save = save;
        }
        const response: any = { locals: { timezone } };
        const request: any = { body: { userId }, params: { teamStreakId } };
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

describe(`addUserToTeamStreakMiddleware`, () => {
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
        const userId = 'abc';
        const follower = {
            userId,
        };
        const request: any = { body: { userId }, params: { teamStreakId } };
        const response: any = { locals: { teamMemberStreak, follower } };
        const next: any = jest.fn();
        const middleware = await getAddUserToTeamStreakMiddleware(teamStreakModel);

        await middleware(request, response, next);

        expect(findByIdAndUpdate).toBeCalledWith(teamStreakId, {
            $addToSet: { members: { memberId: userId, teamMemberStreakId: teamMemberStreak._id } },
        });

        expect(next).toBeCalledWith();
        expect(response.locals.teamMember).toBeDefined();
    });

    test('calls next with AddUserToTeamStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getAddUserToTeamStreakMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.AddUserToTeamStreakMiddleware, expect.any(Error)));
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

describe(`notifiyOtherTeamMembersAboutNewTeamMemberMiddleware`, () => {
    test('notify other team members that a new team member has joined.', async () => {
        expect.assertions(2);
        const user = getMockUser({ _id: 'abc' });
        const newTeamMember = getMockUser({ _id: '123' });
        const teamStreak = { ...getMockTeamStreak({ creatorId: user._id }) };
        const sendPushNotification = jest.fn().mockResolvedValue(true);

        const request: any = {};
        const response: any = {
            locals: {
                newTeamMember,
                teamStreak,
            },
        };
        const next = jest.fn();
        const userModel = {
            findById: jest.fn().mockResolvedValue(user),
        };

        const middleware = getNotifyOtherTeamMembersAboutNewTeamMemberMiddleware(
            sendPushNotification as any,
            userModel as any,
        );
        await middleware(request, response, next);
        expect(sendPushNotification).toBeCalled();
        expect(next).toBeCalledWith();
    });

    test('calls next with NotifyOtherTeamMembersAboutNewTeamMemberMiddleware error on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getNotifyOtherTeamMembersAboutNewTeamMemberMiddleware({} as any, {} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.NotifyOtherTeamMembersAboutNewTeamMemberMiddleware, expect.any(Error)),
        );
    });
});

describe(`createJoinedTeamStreakActivityFeedItemMiddleware`, () => {
    test('creates a new createJoinedTeamStreakActivity', async () => {
        expect.assertions(2);
        const newTeamMember = getMockUser({ _id: 'newTeamMember' });
        const teamStreak = getMockTeamStreak({ creatorId: 'userId' });
        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const response: any = { locals: { newTeamMember, teamStreak } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateJoinedTeamStreakActivityFeedItemMiddleware(createActivityFeedItem as any);

        await middleware(request, response, next);

        expect(createActivityFeedItem).toBeCalled();
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
        expect.assertions(11);

        expect(createTeamMemberMiddlewares.length).toEqual(10);
        expect(createTeamMemberMiddlewares[0]).toBe(createTeamMemberParamsValidationMiddleware);
        expect(createTeamMemberMiddlewares[1]).toBe(createTeamMemberBodyValidationMiddleware);
        expect(createTeamMemberMiddlewares[2]).toBe(userExistsMiddleware);
        expect(createTeamMemberMiddlewares[3]).toBe(teamStreakExistsMiddleware);
        expect(createTeamMemberMiddlewares[4]).toBe(preventExistingTeamMembersFromBeingAddedToTeamStreakMiddleware);
        expect(createTeamMemberMiddlewares[5]).toBe(createTeamMemberStreakMiddleware);
        expect(createTeamMemberMiddlewares[6]).toBe(addUserToTeamStreakMiddleware);
        expect(createTeamMemberMiddlewares[7]).toBe(sendCreateTeamMemberResponseMiddleware);
        expect(createTeamMemberMiddlewares[8]).toBe(notifiyOtherTeamMembersAboutNewTeamMemberMiddleware);
        expect(createTeamMemberMiddlewares[9]).toBe(createJoinedTeamStreakActivityFeedItemMiddleware);
    });
});
