/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    completeSoloStreakTaskQueryValidationMiddleware,
    getRetrieveCompleteSoloStreakTasksMiddleware,
    sendCompleteSoloStreakTasksResponseMiddleware,
    getCompleteSoloStreakTasksMiddlewares,
    retrieveCompleteSoloStreakTasksMiddleware,
} from './getCompleteSoloStreakTasksMiddlewares';

describe('completeSoloStreakTaskQueryValidationMiddleware', () => {
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

        completeSoloStreakTaskQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('allows streakId as a query paramater', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                streakId: 'userId',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        completeSoloStreakTaskQueryValidationMiddleware(request, response, next);

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

        completeSoloStreakTaskQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetrieveCompleteSoloStreakTasksMiddleware', () => {
    test('queries with just userId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeSoloStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteSoloStreakTasksMiddleware(completeSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.completeSoloStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with just streakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeSoloStreakTaskModel = {
            find,
        };
        const streakId = 'streakId';
        const request: any = { query: { streakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteSoloStreakTasksMiddleware(completeSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ streakId });
        expect(response.locals.completeSoloStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with both a userId and streakId', async () => {
        expect.assertions(3);

        const find = jest.fn().mockResolvedValue(true);
        const completeSoloStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const streakId = 'streakId';
        const request: any = { query: { userId, streakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteSoloStreakTasksMiddleware(completeSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId, streakId });
        expect(response.locals.completeSoloStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with no query parameters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeSoloStreakTaskModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteSoloStreakTasksMiddleware(completeSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.completeSoloStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetCompleteSoloStreakTasksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetrieveCompleteSoloStreakTasksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetCompleteSoloStreakTasksMiddleware, expect.any(Error)));
    });
});

describe('sendCompleteSoloStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const completeSoloStreakTasks = true;
        const response: any = { status, locals: { completeSoloStreakTasks } };
        const next = jest.fn();

        sendCompleteSoloStreakTasksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(completeSoloStreakTasks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendCompleteSoloStreakTasksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteSoloStreakTasksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getCompleteSoloStreakTaskMiddlewares', () => {
    test('that getCompleteSoloStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getCompleteSoloStreakTasksMiddlewares.length).toEqual(3);
        expect(getCompleteSoloStreakTasksMiddlewares[0]).toEqual(completeSoloStreakTaskQueryValidationMiddleware);
        expect(getCompleteSoloStreakTasksMiddlewares[1]).toEqual(retrieveCompleteSoloStreakTasksMiddleware);
        expect(getCompleteSoloStreakTasksMiddlewares[2]).toEqual(sendCompleteSoloStreakTasksResponseMiddleware);
    });
});
