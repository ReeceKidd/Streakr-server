/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getOneTeamStreakMiddlewares,
    retrieveTeamStreakMiddleware,
    getRetrieveTeamStreakMiddleware,
    sendTeamStreakMiddleware,
    getTeamStreakParamsValidationMiddleware,
    getSendTeamStreakMiddleware,
    retrieveTeamStreakMembersInformationMiddleware,
    getRetrieveTeamStreakMembersInformationMiddleware,
    retrieveTeamStreakCreatorInformationMiddleware,
    getRetrieveTeamStreakCreatorInformationMiddleware,
} from './getOneTeamStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { ErrorType, CustomError } from '../../customError';

describe(`getTeamStreakParamsValidationMiddleware`, () => {
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

        getTeamStreakParamsValidationMiddleware(request, response, next);

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

        getTeamStreakParamsValidationMiddleware(request, response, next);

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

        getTeamStreakParamsValidationMiddleware(request, response, next);

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

describe('retrieveTeamStreakMembersInformation', () => {
    test('retrieves team streak members information and sets response.locals.TeamStreaksWithUsers', async () => {
        expect.assertions(5);

        const user = {
            _id: '12345678',
            username: 'usernames',
            profileImages: { originalImageUrl: 'originalImageUrl' },
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
        const request: any = {};
        const response: any = { locals: { teamStreak } };
        const next = jest.fn();

        const middleware = getRetrieveTeamStreakMembersInformationMiddleware(userModel, teamStreakModel);
        await middleware(request, response, next);

        expect(findOne).toHaveBeenCalledTimes(2);
        expect(lean).toHaveBeenCalledTimes(2);

        expect(response.locals.teamStreak).toBeDefined();
        const member = response.locals.teamStreak.members[0];
        expect(Object.keys(member)).toEqual(['_id', 'username', 'profileImage', 'teamMemberStreak']);

        expect(next).toBeCalledWith();
    });

    test('calls next with RetrieveTeamStreakMembersInformation on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getRetrieveTeamStreakMembersInformationMiddleware({} as any, {} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveTeamStreakMembersInformation, expect.any(Error)));
    });
});

describe('retrieveTeamStreakCreatorInformation', () => {
    test('retrieves team streak creator information and sets response.locals.teamStreak', async () => {
        expect.assertions(4);

        const user = { _id: '12345678', username: 'usernames' };
        const lean = jest.fn().mockResolvedValue(user);
        const findOne = jest.fn(() => ({ lean }));
        const userModel: any = {
            findOne,
        };
        const creatorId = 'creatorId';
        const teamStreak = { _id: 'abc', creatorId };
        const request: any = {};
        const response: any = { locals: { teamStreak } };
        const next = jest.fn();

        const middleware = getRetrieveTeamStreakCreatorInformationMiddleware(userModel);
        await middleware(request, response, next);

        expect(findOne).toHaveBeenCalledWith({ _id: creatorId });
        expect(lean).toHaveBeenCalled();
        expect(response.locals.teamStreak.creator).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with RetrieveTeamStreakCreatorInformationMiddleware on middleware failure', async () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getRetrieveTeamStreakCreatorInformationMiddleware({} as any);
        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.RetrieveTeamStreakCreatorInformationMiddleware, expect.any(Error)),
        );
    });
});

describe('sendTeamStreakMiddleware', () => {
    test('sends teamStreak', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const teamStreak = { _id: 'abc' };
        const request: any = {};
        const response: any = { locals: { teamStreak }, status };
        const next = jest.fn();
        const resourceCreatedCode = 401;
        const middleware = getSendTeamStreakMiddleware(resourceCreatedCode);

        middleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(resourceCreatedCode);
        expect(send).toBeCalledWith(teamStreak);
    });

    test('calls next with SendTeamStreakMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const error = 'error';
        const send = jest.fn(() => Promise.reject(error));
        const status = jest.fn(() => ({ send }));
        const response: any = { status };
        const next = jest.fn();
        const resourceCreatedResponseCode = 401;
        const middleware = getSendTeamStreakMiddleware(resourceCreatedResponseCode);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendTeamStreakMiddleware, expect.any(Error)));
    });
});

describe('getTeamStreakMiddlewares', () => {
    test('that getTeamStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(6);

        expect(getOneTeamStreakMiddlewares.length).toEqual(5);
        expect(getOneTeamStreakMiddlewares[0]).toEqual(getTeamStreakParamsValidationMiddleware);
        expect(getOneTeamStreakMiddlewares[1]).toEqual(retrieveTeamStreakMiddleware);
        expect(getOneTeamStreakMiddlewares[2]).toEqual(retrieveTeamStreakMembersInformationMiddleware);
        expect(getOneTeamStreakMiddlewares[3]).toEqual(retrieveTeamStreakCreatorInformationMiddleware);
        expect(getOneTeamStreakMiddlewares[4]).toEqual(sendTeamStreakMiddleware);
    });
});
