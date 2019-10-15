/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    completeTeamStreakTaskQueryValidationMiddleware,
    getRetreiveCompleteTeamStreakTasksMiddleware,
    sendCompleteTeamStreakTasksResponseMiddleware,
    getCompleteTeamStreakTasksMiddlewares,
    retreiveCompleteTeamStreakTasksMiddleware,
} from './getCompleteTeamStreakTasksMiddlewares';

describe('completeTeamStreakTaskQueryValidationMiddleware', () => {
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

        completeTeamStreakTaskQueryValidationMiddleware(request, response, next);

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

        completeTeamStreakTaskQueryValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: '"unsupportedQuery" is not allowed',
        });
        expect(next).not.toBeCalled();
    });
});

describe('getRetreiveCompleteTeamStreakTasksMiddleware', () => {
    const teamStreakId = 'teamStreakId';

    test('queries with just teamStreakId', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeTeamStreakTaskModel = {
            find,
        };
        const request: any = { query: { teamStreakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveCompleteTeamStreakTasksMiddleware(completeTeamStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ teamStreakId });
        expect(response.locals.completeTeamStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('queries with no query paramaters', async () => {
        expect.assertions(3);

        const find = jest.fn(() => Promise.resolve(true));
        const completeTeamStreakTaskModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getRetreiveCompleteTeamStreakTasksMiddleware(completeTeamStreakTaskModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(response.locals.completeTeamStreakTasks).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with GetCompleteTeamStreakTasksMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getRetreiveCompleteTeamStreakTasksMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.GetCompleteTeamStreakTasksMiddleware, expect.any(Error)));
    });
});

describe('sendCompleteTeamStreakTaskDeletedResponseMiddleware', () => {
    test('responds with successful deletion', () => {
        expect.assertions(3);

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const completeTeamStreakTasks = true;
        const response: any = { status, locals: { completeTeamStreakTasks } };
        const next = jest.fn();

        sendCompleteTeamStreakTasksResponseMiddleware(request, response, next);

        expect(status).toBeCalledWith(200);
        expect(send).toBeCalledWith(completeTeamStreakTasks);
        expect(next).not.toBeCalled();
    });

    test('that on error next is called with error', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        sendCompleteTeamStreakTasksResponseMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendCompleteTeamStreakTasksResponseMiddleware, expect.any(Error)),
        );
    });
});

describe('getCompleteTeamStreakTaskMiddlewares', () => {
    test('that getCompleteTeamStreakTaskMiddlewares are defined in the correct order', () => {
        expect.assertions(4);

        expect(getCompleteTeamStreakTasksMiddlewares.length).toEqual(3);
        expect(getCompleteTeamStreakTasksMiddlewares[0]).toEqual(completeTeamStreakTaskQueryValidationMiddleware);
        expect(getCompleteTeamStreakTasksMiddlewares[1]).toEqual(retreiveCompleteTeamStreakTasksMiddleware);
        expect(getCompleteTeamStreakTasksMiddlewares[2]).toEqual(sendCompleteTeamStreakTasksResponseMiddleware);
    });
});
