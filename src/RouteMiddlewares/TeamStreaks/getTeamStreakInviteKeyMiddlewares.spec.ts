/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getTeamStreakInviteParamsValidationMiddleware,
    getTeamStreakInviteKeyMiddlewares,
    retrieveTeamStreakMiddleware,
    getRetrieveTeamStreakMiddleware,
    sendTeamStreakInviteKeyMiddleware,
} from './getTeamStreakInviteKeyMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';
import { getMockTeamStreak } from '../../testHelpers/getMockTeamStreak';
import { getMockUser } from '../../testHelpers/getMockUser';
import { keepInviteLinkIfUserIsApartOfTeamStreakMiddleware } from './getTeamStreakInviteKeyMiddlewares';

describe(`getTeamStreakInviteParamsValidationMiddleware`, () => {
    const teamStreakId = '12345678';

    test('calls next() when correct params are supplied', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { teamStreakId },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getTeamStreakInviteParamsValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends error response when teamStreakId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: {},
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getTeamStreakInviteParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends error response when teamStreakId is not a string', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            params: { teamStreakId: 1234 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        getTeamStreakInviteParamsValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "teamStreakId" fails because ["teamStreakId" must be a string]',
        });
        expect(next).not.toBeCalled();
    });
});

describe('retrieveTeamStreakMiddleware', () => {
    test('sets response.locals.teamStreak', async () => {
        expect.assertions(3);
        const lean = jest.fn(() => Promise.resolve(true));
        const findOne = jest.fn(() => ({ lean }));
        const teamStreakModel = {
            findOne,
        };
        const teamStreakId = 'abcd';
        const request: any = { params: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveTeamStreakMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(findOne).toBeCalledWith({ _id: teamStreakId });
        expect(response.locals.teamStreak).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws GetTeamStreakNoTeamStreakFound when team streak is not found', async () => {
        expect.assertions(1);
        const lean = jest.fn(() => Promise.resolve(false));
        const findOne = jest.fn(() => ({ lean }));
        const teamStreakModel = {
            findOne,
        };
        const teamStreakId = 'abcd';
        const request: any = { params: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveTeamStreakMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetTeamStreakNoTeamStreakFound));
    });

    test('calls next with RetrieveTeamStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const errorMessage = 'error';
        const lean = jest.fn(() => Promise.reject(errorMessage));
        const findOne = jest.fn(() => ({ lean }));
        const teamStreakModel = {
            findOne,
        };
        const teamStreakId = 'abcd';
        const request: any = { params: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveTeamStreakMiddleware(teamStreakModel as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveTeamStreakMiddleware, expect.any(Error)));
    });
});

describe('keepInviteLinkIfUserIsApartOfTeamStreakMiddleware', () => {
    test('keeps invite link on team streak if user is apart of the team streak.', async () => {
        expect.assertions(2);

        const user = getMockUser();
        const teamStreak = getMockTeamStreak({ creatorId: user._id });

        const request: any = {};
        const response: any = { locals: { teamStreak, user } };
        const next = jest.fn();

        keepInviteLinkIfUserIsApartOfTeamStreakMiddleware(request, response, next);

        expect(response.locals.inviteKey).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('if current user is not apart of the team streak they do not receive an invite link.', async () => {
        expect.assertions(2);

        const user = getMockUser();
        const teamStreak = getMockTeamStreak({ creatorId: user._id });
        const request: any = {};
        const response: any = { locals: { teamStreak: { ...teamStreak, members: [] }, user } };
        const next = jest.fn();

        keepInviteLinkIfUserIsApartOfTeamStreakMiddleware(request, response, next);

        expect(response.locals.inviteKey).toBe(null);
        expect(next).toBeCalledWith();
    });

    test('calls next with KeepInviteLinkIfUserIsApartOfTeamStreak on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        keepInviteLinkIfUserIsApartOfTeamStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.KeepInviteLinkIfUserIsApartOfTeamStreak, expect.any(Error)),
        );
    });
});

describe('sendTeamStreakInviteKeyMiddleware', () => {
    test('sends teamStreak', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const inviteKey = '12345';
        const request: any = {};
        const response: any = { locals: { inviteKey }, status };
        const next = jest.fn();

        sendTeamStreakInviteKeyMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith({ inviteKey });
    });

    test('calls next with SendTeamStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendTeamStreakInviteKeyMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTeamStreakMiddleware, expect.any(Error)));
    });
});

describe('getTeamStreakInviteKeyMiddlewares', () => {
    test('that getTeamStreakInviteKeyMiddlewares are defined in the correct order', () => {
        expect.assertions(5);

        expect(getTeamStreakInviteKeyMiddlewares.length).toEqual(4);
        expect(getTeamStreakInviteKeyMiddlewares[0]).toEqual(getTeamStreakInviteParamsValidationMiddleware);
        expect(getTeamStreakInviteKeyMiddlewares[1]).toEqual(retrieveTeamStreakMiddleware);
        expect(getTeamStreakInviteKeyMiddlewares[2]).toEqual(keepInviteLinkIfUserIsApartOfTeamStreakMiddleware);
        expect(getTeamStreakInviteKeyMiddlewares[3]).toEqual(sendTeamStreakInviteKeyMiddleware);
    });
});
