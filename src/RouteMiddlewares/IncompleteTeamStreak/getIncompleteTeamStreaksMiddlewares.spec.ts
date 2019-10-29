/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    incompleteTeamStreakQueryValidationMiddleware,
    getRetreiveIncompleteTeamStreaksMiddleware,
    sendIncompleteTeamStreaksResponseMiddleware,
    getIncompleteTeamStreaksMiddlewares,
    retreiveIncompleteTeamStreaksMiddleware,
} from './getIncompleteTeamStreaksMiddlewares';

describe('incompleteTeamStreakQueryValidationMiddleware', () => {
    test('allows teamStreakId as a query paramater', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            query: {
                teamStreakId: 'teamStreakId',
            },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        incompleteTeamStreakQueryValidationMiddleware(request, response, next);

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

        incompleteTeamStreakQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetreiveIncompleteTeamStreaksMiddleware', () => {
    const teamStreakId = 'teamStreakId';

    test('queries with just teamStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteTeamStreakModel = {
            find,
        };
        const request: any = { query: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveIncompleteTeamStreaksMiddleware(incompleteTeamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamStreakId });
        expect(response.locals.incompleteTeamStreaks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with no query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const incompleteTeamStreakModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveIncompleteTeamStreaksMiddleware(incompleteTeamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.incompleteTeamStreaks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetIncompleteTeamStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetreiveIncompleteTeamStreaksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetIncompleteTeamStreaksMiddleware, expect.any(Error)));
    });
});

describe('sendIncompleteTeamStreakDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const incompleteTeamStreaks = true;
        const response: any = { status, locals: { incompleteTeamStreaks } };
        const next = jest.fn();

        sendIncompleteTeamStreaksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(incompleteTeamStreaks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendIncompleteTeamStreaksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendIncompleteTeamStreaksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getIncompleteTeamStreakMiddlewares', () => {
    test('that getIncompleteTeamStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getIncompleteTeamStreaksMiddlewares.length).toEqual(3);
        expect(getIncompleteTeamStreaksMiddlewares[0]).toEqual(incompleteTeamStreakQueryValidationMiddleware);
        expect(getIncompleteTeamStreaksMiddlewares[1]).toEqual(retreiveIncompleteTeamStreaksMiddleware);
        expect(getIncompleteTeamStreaksMiddlewares[2]).toEqual(sendIncompleteTeamStreaksResponseMiddleware);
    });
});
