/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    incompleteGroupMemberStreakTaskQueryValidationMiddleware,
    getRetreiveIncompleteGroupMemberStreakTasksMiddleware,
    sendIncompleteGroupMemberStreakTasksResponseMiddleware,
    getIncompleteGroupMemberStreakTasksMiddlewares,
    retreiveIncompleteGroupMemberStreakTasksMiddleware,
} from './getIncompleteGroupMemberStreakTaskMiddlewares';
import { GroupStreakTypes } from '@streakoid/streakoid-sdk/lib';

describe('incompleteGroupMemberStreakTaskQueryValidationMiddleware', () => {
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

    test('allows userId, groupMemberStreak, groupStreakType and teamStreakId as query paramaters', () => {
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

        incompleteGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows just userId as a query paramater', () => {
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

        incompleteGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows just groupMemberStreakId as a query paramater', () => {
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

        incompleteGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows just groupMemberStreakType as a query paramater', () => {
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

        incompleteGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows just teamStreakId as a query paramater', () => {
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

        incompleteGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

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

        incompleteGroupMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetreiveIncompleteGroupMemberStreakTasksMiddleware', () => {
    test('queries incompleteGroupMemberStreakTask model and sets response.locals.incompleteGroupMemberStreakTasks with all query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn().mockResolvedValue(true);
        const incompleteGroupMemberStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const groupMemberStreakId = 'groupMemberStreakId';
        const groupStreakType = GroupStreakTypes.team;
        const teamStreakId = 'teamStreakId';
        const request: any = { query: { userId, groupMemberStreakId, groupStreakType, teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveIncompleteGroupMemberStreakTasksMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId, groupMemberStreakId, groupStreakType, teamStreakId });
        expect(response.locals.incompleteGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries incompleteGroupMemberStreakTask model and sets response.locals.incompleteGroupMemberStreakTasks with just userId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteGroupMemberStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveIncompleteGroupMemberStreakTasksMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.incompleteGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries incompleteGroupMemberStreakTask model and sets response.locals.incompleteGroupMemberStreakTasks with just groupMemberStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteGroupMemberStreakTaskModel = {
            find,
        };
        const groupMemberStreakId = 'groupMemberStreakId';
        const request: any = { query: { groupMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveIncompleteGroupMemberStreakTasksMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ groupMemberStreakId });
        expect(response.locals.incompleteGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries incompleteGroupMemberStreakTask model and sets response.locals.incompleteGroupMemberStreakTasks with just groupStreakType', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteGroupMemberStreakTaskModel = {
            find,
        };
        const groupStreakType = GroupStreakTypes.team;
        const request: any = { query: { groupStreakType } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveIncompleteGroupMemberStreakTasksMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ groupStreakType });
        expect(response.locals.incompleteGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries incompleteGroupMemberStreakTask model and sets response.locals.incompleteGroupMemberStreakTasks with just teamStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteGroupMemberStreakTaskModel = {
            find,
        };
        const teamStreakId = 'teamStreakId';
        const request: any = { query: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveIncompleteGroupMemberStreakTasksMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamStreakId });
        expect(response.locals.incompleteGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries incompleteGroupMemberStreakTask model and sets response.locals.incompleteGroupMemberStreakTasks with no query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteGroupMemberStreakTaskModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveIncompleteGroupMemberStreakTasksMiddleware(
            incompleteGroupMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.incompleteGroupMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetIncompleteGroupMemberStreakTasksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetreiveIncompleteGroupMemberStreakTasksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.GetIncompleteGroupMemberStreakTasksMiddleware, expect.any(Error)),
        );
    });
});

describe('sendIncompleteGroupMemberStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const incompleteGroupMemberStreakTasks = true;
        const response: any = { status, locals: { incompleteGroupMemberStreakTasks } };
        const next = jest.fn();

        sendIncompleteGroupMemberStreakTasksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(incompleteGroupMemberStreakTasks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendIncompleteGroupMemberStreakTasksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendIncompleteGroupMemberStreakTasksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getIncompleteGroupMemberStreakTaskMiddlewares', () => {
    test('that getIncompleteGroupMemberStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getIncompleteGroupMemberStreakTasksMiddlewares.length).toEqual(3);
        expect(getIncompleteGroupMemberStreakTasksMiddlewares[0]).toEqual(
            incompleteGroupMemberStreakTaskQueryValidationMiddleware,
        );
        expect(getIncompleteGroupMemberStreakTasksMiddlewares[1]).toEqual(
            retreiveIncompleteGroupMemberStreakTasksMiddleware,
        );
        expect(getIncompleteGroupMemberStreakTasksMiddlewares[2]).toEqual(
            sendIncompleteGroupMemberStreakTasksResponseMiddleware,
        );
    });
});
