/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    completeTeamStreakQueryValidationMiddleware,
    getRetrieveCompleteTeamStreaksMiddleware,
    sendCompleteTeamStreaksResponseMiddleware,
    getCompleteTeamStreaksMiddlewares,
    retrieveCompleteTeamStreaksMiddleware,
} from './getCompleteTeamStreaksMiddlewares';

describe('completeTeamStreakQueryValidationMiddleware', () => {
    test('allows teamStreakId as a query paramter', () => {
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

        completeTeamStreakQueryValidationMiddleware(request, response, next);

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

        completeTeamStreakQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetrieveCompleteTeamStreaksMiddleware', () => {
    const teamStreakId = 'teamStreakId';

    test('queries with just teamStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeTeamStreakModel = {
            find,
        };
        const request: any = { query: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteTeamStreaksMiddleware(completeTeamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamStreakId });
        expect(response.locals.completeTeamStreaks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with no query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeTeamStreakModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetrieveCompleteTeamStreaksMiddleware(completeTeamStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.completeTeamStreaks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetCompleteTeamStreaksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetrieveCompleteTeamStreaksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetCompleteTeamStreaksMiddleware, expect.any(Error)));
    });
});

describe('sendCompleteTeamStreakDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const completeTeamStreaks = true;
        const response: any = { status, locals: { completeTeamStreaks } };
        const next = jest.fn();

        sendCompleteTeamStreaksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(completeTeamStreaks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendCompleteTeamStreaksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteTeamStreaksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getCompleteTeamStreakMiddlewares', () => {
    test('that getCompleteTeamStreakMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getCompleteTeamStreaksMiddlewares.length).toEqual(3);
        expect(getCompleteTeamStreaksMiddlewares[0]).toEqual(completeTeamStreakQueryValidationMiddleware);
        expect(getCompleteTeamStreaksMiddlewares[1]).toEqual(retrieveCompleteTeamStreaksMiddleware);
        expect(getCompleteTeamStreaksMiddlewares[2]).toEqual(sendCompleteTeamStreaksResponseMiddleware);
    });
});
