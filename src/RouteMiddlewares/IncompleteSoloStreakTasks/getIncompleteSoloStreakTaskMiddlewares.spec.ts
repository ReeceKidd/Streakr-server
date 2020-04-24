/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    incompleteSoloStreakTaskQueryValidationMiddleware,
    getRetrieveIncompleteSoloStreakTasksMiddleware,
    sendIncompleteSoloStreakTasksResponseMiddleware,
    getIncompleteSoloStreakTasksMiddlewares,
    retrieveIncompleteSoloStreakTasksMiddleware,
} from './getIncompleteSoloStreakTaskMiddlewares';

describe('incompleteSoloStreakTaskQueryValidationMiddleware', () => {
    test('allows userId as a query paramater', () => {
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

        incompleteSoloStreakTaskQueryValidationMiddleware(request, response, next);

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

        incompleteSoloStreakTaskQueryValidationMiddleware(request, response, next);

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

        incompleteSoloStreakTaskQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetrieveIncompleteSoloStreakTasksMiddleware', () => {
    test('queries with just userId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteSoloStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteSoloStreakTasksMiddleware(incompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.incompleteSoloStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with just streakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteSoloStreakTaskModel = {
            find,
        };
        const streakId = 'streakId';
        const request: any = { query: { streakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteSoloStreakTasksMiddleware(incompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ streakId });
        expect(response.locals.incompleteSoloStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with both a userId and streakId', async () => {
        expect.assertions(3);

        const find = jest.fn().mockResolvedValue(true);
        const incompleteSoloStreakTaskModel = {
            find,
        };
        const userId = 'userId';
        const streakId = 'streakId';
        const request: any = { query: { userId, streakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteSoloStreakTasksMiddleware(incompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId, streakId });
        expect(response.locals.incompleteSoloStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with no query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteSoloStreakTaskModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveIncompleteSoloStreakTasksMiddleware(incompleteSoloStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.incompleteSoloStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetIncompleteSoloStreakTasksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetrieveIncompleteSoloStreakTasksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.GetIncompleteSoloStreakTasksMiddleware, expect.any(Error)),
        );
    });
});

describe('sendIncompleteSoloStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const incompleteSoloStreakTasks = true;
        const response: any = { status, locals: { incompleteSoloStreakTasks } };
        const next = jest.fn();

        sendIncompleteSoloStreakTasksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(incompleteSoloStreakTasks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendIncompleteSoloStreakTasksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendIncompleteSoloStreakTasksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getIncompleteSoloStreakTaskMiddlewares', () => {
    test('that getIncompleteSoloStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getIncompleteSoloStreakTasksMiddlewares.length).toEqual(3);
        expect(getIncompleteSoloStreakTasksMiddlewares[0]).toEqual(incompleteSoloStreakTaskQueryValidationMiddleware);
        expect(getIncompleteSoloStreakTasksMiddlewares[1]).toEqual(retrieveIncompleteSoloStreakTasksMiddleware);
        expect(getIncompleteSoloStreakTasksMiddlewares[2]).toEqual(sendIncompleteSoloStreakTasksResponseMiddleware);
    });
});
