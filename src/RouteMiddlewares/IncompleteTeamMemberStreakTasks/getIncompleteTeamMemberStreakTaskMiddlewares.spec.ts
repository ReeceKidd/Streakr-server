/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    incompleteTeamMemberStreakTaskQueryValidationMiddleware,
    getRetrieveIncompleteTeamMemberStreakTasksMiddleware,
    sendIncompleteTeamMemberStreakTasksResponseMiddleware,
    getIncompleteTeamMemberStreakTasksMiddlewares,
    retrieveIncompleteTeamMemberStreakTasksMiddleware,
} from './getIncompleteTeamMemberStreakTaskMiddlewares';

describe('incompleteTeamMemberStreakTaskQueryValidationMiddleware', () => {
    const userId = 'userId';
    const teamMemberStreakId = 'teamMemberStreakId';
    const teamStreakId = 'teamStreakId';

    const query = {
        userId,
        teamMemberStreakId,
        teamStreakId,
    };

    test('allows userId, teamMemberStreak, and teamStreakId as query parameters', () => {
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

        incompleteTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

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

        incompleteTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows just teamMemberStreakId as a query paramater', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                teamMemberStreakId,
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

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

        incompleteTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

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

        incompleteTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetrieveIncompleteTeamMemberStreakTasksMiddleware', () => {
    test('queries with all query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn().mockResolvedValue(true);
        const incompleteTeamMemberStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const teamMemberStreakId = 'teamMemberStreakId';
        const teamStreakId = 'teamStreakId';
        const request: any = { query: { userId, teamMemberStreakId, teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteTeamMemberStreakTasksMiddleware(
            incompleteTeamMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId, teamMemberStreakId, teamStreakId });
        expect(response.locals.incompleteTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries withjust userId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteTeamMemberStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteTeamMemberStreakTasksMiddleware(
            incompleteTeamMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.incompleteTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries withjust teamMemberStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteTeamMemberStreakTaskModel = {
            find,
        };
        const teamMemberStreakId = 'teamMemberStreakId';
        const request: any = { query: { teamMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteTeamMemberStreakTasksMiddleware(
            incompleteTeamMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamMemberStreakId });
        expect(response.locals.incompleteTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries withjust teamStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteTeamMemberStreakTaskModel = {
            find,
        };
        const teamStreakId = 'teamStreakId';
        const request: any = { query: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteTeamMemberStreakTasksMiddleware(
            incompleteTeamMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamStreakId });
        expect(response.locals.incompleteTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries withno query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteTeamMemberStreakTaskModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteTeamMemberStreakTasksMiddleware(
            incompleteTeamMemberStreakTaskModel as any,
        );

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.incompleteTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetIncompleteTeamMemberStreakTasksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetrieveIncompleteTeamMemberStreakTasksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.GetIncompleteTeamMemberStreakTasksMiddleware, expect.any(Error)),
        );
    });
});

describe('sendIncompleteTeamMemberStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const incompleteTeamMemberStreakTasks = true;
        const response: any = { status, locals: { incompleteTeamMemberStreakTasks } };
        const next = jest.fn();

        sendIncompleteTeamMemberStreakTasksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(incompleteTeamMemberStreakTasks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendIncompleteTeamMemberStreakTasksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendIncompleteTeamMemberStreakTasksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getIncompleteTeamMemberStreakTaskMiddlewares', () => {
    test('that getIncompleteTeamMemberStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getIncompleteTeamMemberStreakTasksMiddlewares.length).toEqual(3);
        expect(getIncompleteTeamMemberStreakTasksMiddlewares[0]).toEqual(
            incompleteTeamMemberStreakTaskQueryValidationMiddleware,
        );
        expect(getIncompleteTeamMemberStreakTasksMiddlewares[1]).toEqual(
            retrieveIncompleteTeamMemberStreakTasksMiddleware,
        );
        expect(getIncompleteTeamMemberStreakTasksMiddlewares[2]).toEqual(
            sendIncompleteTeamMemberStreakTasksResponseMiddleware,
        );
    });
});
