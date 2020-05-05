/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    completeChallengeStreakTaskQueryValidationMiddleware,
    getRetrieveCompleteChallengeStreakTasksMiddleware,
    sendCompleteChallengeStreakTasksResponseMiddleware,
    getCompleteChallengeStreakTasksMiddlewares,
    retrieveCompleteChallengeStreakTasksMiddleware,
} from './getCompleteChallengeStreakTaskMiddlewares';

describe('completeChallengeStreakTaskQueryValidationMiddleware', () => {
    test('allows userId as a query paramter', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                userId: 'userId',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeChallengeStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows challengeStreakId as a query paramater', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                challengeStreakId: 'challengeStreakId',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeChallengeStreakTaskQueryValidationMiddleware(request, response, next);

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

        completeChallengeStreakTaskQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetrieveCompleteChallengeStreakTasksMiddleware', () => {
    test('queries with just userId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeChallengeStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteChallengeStreakTasksMiddleware(completeChallengeStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.completeChallengeStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with just challengeStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeChallengeStreakTaskModel = {
            find,
        };
        const challengeStreakId = 'challengeStreakId';
        const request: any = { query: { challengeStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteChallengeStreakTasksMiddleware(completeChallengeStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ challengeStreakId });
        expect(response.locals.completeChallengeStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with both a userId and challengeStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn().mockResolvedValue(true);
        const completeChallengeStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const challengeStreakId = 'challengeStreakId';
        const request: any = { query: { userId, challengeStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteChallengeStreakTasksMiddleware(completeChallengeStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId, challengeStreakId });
        expect(response.locals.completeChallengeStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with no query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeChallengeStreakTaskModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteChallengeStreakTasksMiddleware(completeChallengeStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.completeChallengeStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetCompleteChallengeStreakTasksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetrieveCompleteChallengeStreakTasksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.GetCompleteChallengeStreakTasksMiddleware, expect.any(Error)),
        );
    });
});

describe('sendCompleteChallengeStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const completeChallengeStreakTasks = true;
        const response: any = { status, locals: { completeChallengeStreakTasks } };
        const next = jest.fn();

        sendCompleteChallengeStreakTasksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(completeChallengeStreakTasks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendCompleteChallengeStreakTasksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteChallengeStreakTasksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getCompleteChallengeStreakTaskMiddlewares', () => {
    test('that getCompleteChallengeStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getCompleteChallengeStreakTasksMiddlewares.length).toEqual(3);
        expect(getCompleteChallengeStreakTasksMiddlewares[0]).toEqual(
            completeChallengeStreakTaskQueryValidationMiddleware,
        );
        expect(getCompleteChallengeStreakTasksMiddlewares[1]).toEqual(retrieveCompleteChallengeStreakTasksMiddleware);
        expect(getCompleteChallengeStreakTasksMiddlewares[2]).toEqual(
            sendCompleteChallengeStreakTasksResponseMiddleware,
        );
    });
});
