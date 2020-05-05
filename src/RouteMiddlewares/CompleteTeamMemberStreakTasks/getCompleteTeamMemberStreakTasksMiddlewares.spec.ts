/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    completeTeamMemberStreakTaskQueryValidationMiddleware,
    getRetrieveCompleteTeamMemberStreakTasksMiddleware,
    sendCompleteTeamMemberStreakTasksResponseMiddleware,
    getCompleteTeamMemberStreakTasksMiddlewares,
    retrieveCompleteTeamMemberStreakTasksMiddleware,
} from './getCompleteTeamMemberStreakTasksMiddlewares';

describe('completeTeamMemberStreakTaskQueryValidationMiddleware', () => {
    const userId = 'userId';
    const teamMemberStreakId = 'teamMemberStreakId';
    const teamStreakId = 'teamStreakId';
    const query = {
        userId,
        teamMemberStreakId,
        teamStreakId,
    };
    test('allows userId as a query paramter', () => {
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

        completeTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows teamMemberStreakId as a query paramater', () => {
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

        completeTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

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

        completeTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

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

        completeTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

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

        completeTeamMemberStreakTaskQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetrieveCompleteTeamMemberStreakTasksMiddleware', () => {
    test('queries with just userId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeTeamMemberStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteTeamMemberStreakTasksMiddleware(completeTeamMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.completeTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with just teamMemberStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeTeamMemberStreakTaskModel = {
            find,
        };
        const teamMemberStreakId = 'teamMemberStreakId';
        const request: any = { query: { teamMemberStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteTeamMemberStreakTasksMiddleware(completeTeamMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamMemberStreakId });
        expect(response.locals.completeTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with just teamStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeTeamMemberStreakTaskModel = {
            find,
        };
        const teamStreakId = 'teamStreakId';
        const request: any = { query: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteTeamMemberStreakTasksMiddleware(completeTeamMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamStreakId });
        expect(response.locals.completeTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with userId, teamMemberStreakId and teamId', async () => {
        expect.assertions(3);

        const find = jest.fn().mockResolvedValue(true);
        const completeTeamMemberStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const teamMemberStreakId = 'teamMemberStreakId';
        const teamStreakId = 'teamStreakId';
        const request: any = {
            query: { userId, teamMemberStreakId, teamStreakId },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteTeamMemberStreakTasksMiddleware(completeTeamMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId, teamStreakId, teamMemberStreakId });
        expect(response.locals.completeTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with no query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeTeamMemberStreakTaskModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteTeamMemberStreakTasksMiddleware(completeTeamMemberStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.completeTeamMemberStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetCompleteTeamMemberStreakTasksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetrieveCompleteTeamMemberStreakTasksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.GetCompleteTeamMemberStreakTasksMiddleware, expect.any(Error)),
        );
    });
});

describe('sendCompleteTeamMemberStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const completeTeamMemberStreakTasks = true;
        const response: any = {
            status,
            locals: { completeTeamMemberStreakTasks },
        };
        const next = jest.fn();

        sendCompleteTeamMemberStreakTasksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(completeTeamMemberStreakTasks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendCompleteTeamMemberStreakTasksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteTeamMemberStreakTasksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getCompleteTeamMemberStreakTaskMiddlewares', () => {
    test('that getCompleteTeamMemberStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getCompleteTeamMemberStreakTasksMiddlewares.length).toEqual(3);
        expect(getCompleteTeamMemberStreakTasksMiddlewares[0]).toEqual(
            completeTeamMemberStreakTaskQueryValidationMiddleware,
        );
        expect(getCompleteTeamMemberStreakTasksMiddlewares[1]).toEqual(retrieveCompleteTeamMemberStreakTasksMiddleware);
        expect(getCompleteTeamMemberStreakTasksMiddlewares[2]).toEqual(
            sendCompleteTeamMemberStreakTasksResponseMiddleware,
        );
    });
});
