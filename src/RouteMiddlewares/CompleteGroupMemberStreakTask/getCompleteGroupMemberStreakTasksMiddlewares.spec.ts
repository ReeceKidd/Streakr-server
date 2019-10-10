/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    completeGroupMemberStreakTaskQueryValidationMiddleware,
    getRetreiveCompleteGroupMemberStreakTasksMiddleware,
    sendCompleteGroupMemberStreakTasksResponseMiddleware,
    getCompleteGroupMemberStreakTasksMiddlewares,
    retreiveCompleteGroupMemberStreakTasksMiddleware,
} from './getCompleteGroupMemberStreakTasksMiddlewares';
import { GroupStreakTypes } from '@streakoid/streakoid-sdk/lib';

describe('completeGroupMemberStreakTaskQueryValidationMiddleware', () => {
    const userId = 'userId';
    const groupMemberStreakId = 'groupMemberStreakId';
    const groupStreakType = GroupStreakTypes.team;
    const teamStreakId = 'teamStreakId';
    const query = {
        userId,
        groupMemberStreakId,
        groupStreakType,
        teamStreakId,
    };
    test('allows userId as a query paramater', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                userId,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows groupMemberStreakId as a query paramater', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                groupMemberStreakId,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows groupStreakType as a query paramater', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                groupStreakType,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows teamStreakId as a query paramater', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                teamStreakId,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows all query paramaters at once', () => {
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

        completeGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends unsupported query error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                unsupportedQuery: 'unsupportedQuery',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetreiveCompleteGroupMemberStreakTasksMiddleware', () => {
    test('queries with just userId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeGroupMemberStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
            completeGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with just groupMemberStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeGroupMemberStreakTaskModel = {
            find,
        };
        const groupMemberStreakId = 'groupMemberStreakId';
        const request: any = { query: { groupMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
            completeGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ groupMemberStreakId });
        expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with just groupStreakType', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeGroupMemberStreakTaskModel = {
            find,
        };
        const groupStreakType = 'groupStreakType';
        const request: any = { query: { groupStreakType } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
            completeGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ groupStreakType });
        expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with just teamStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeGroupMemberStreakTaskModel = {
            find,
        };
        const teamStreakId = 'teamStreakId';
        const request: any = { query: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
            completeGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamStreakId });
        expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with userId, groupMemberStreakId, groupStreakType and teamId', async () => {
        expect.assertions(3);

        const find = jest.fn().mockResolvedValue(true);
        const completeGroupMemberStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const groupMemberStreakId = 'groupMemberStreakId';
        const groupStreakType = GroupStreakTypes.team;
        const teamStreakId = 'teamStreakId';
        const request: any = {
            query: { userId, groupMemberStreakId, groupStreakType, teamStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
            completeGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId, teamStreakId, groupStreakType, groupMemberStreakId });
        expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with no query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeGroupMemberStreakTaskModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
            completeGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetCompleteGroupMemberStreakTasksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.GetCompleteGroupMemberStreakTasksMiddleware, expect.any(Error)),
        );
    });
});

describe('sendCompleteGroupMemberStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const completeGroupMemberStreakTasks = true;
        const response: any = {
            status,
            locals: { completeGroupMemberStreakTasks },
        };
        const next = jest.fn();

        sendCompleteGroupMemberStreakTasksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(completeGroupMemberStreakTasks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendCompleteGroupMemberStreakTasksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteGroupMemberStreakTasksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getCompleteGroupMemberStreakTaskMiddlewares', () => {
    test('that getCompleteGroupMemberStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getCompleteGroupMemberStreakTasksMiddlewares.length).toEqual(3);
        expect(getCompleteGroupMemberStreakTasksMiddlewares[0]).toEqual(
            completeGroupMemberStreakTaskQueryValidationMiddleware,
        );
        expect(getCompleteGroupMemberStreakTasksMiddlewares[1]).toEqual(
            retreiveCompleteGroupMemberStreakTasksMiddleware,
        );
        expect(getCompleteGroupMemberStreakTasksMiddlewares[2]).toEqual(
            sendCompleteGroupMemberStreakTasksResponseMiddleware,
        );
    });
});
