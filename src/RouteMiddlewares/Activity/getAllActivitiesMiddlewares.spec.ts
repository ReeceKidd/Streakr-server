/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllActivitiesMiddlewares,
    getActivitiesQueryValidationMiddleware,
    getFindActivitiesMiddleware,
    findActivitiesMiddleware,
    sendActivitiesMiddleware,
} from './getAllActivitiesMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const userId = 'userId';
const streakId = 'streakId';

const query = {
    userId,
    streakId,
};

describe('getActivitiesValidationMiddleware', () => {
    test('passes valid request', () => {
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

        getActivitiesQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findActivitiesMiddleware', () => {
    test('queries database with just userId and sets response.locals.activities', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const activityModel = {
            find,
        };
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivitiesMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.activities).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just streakId and sets response.locals.activities', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const activityModel = {
            find,
        };
        const request: any = { query: { streakId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivitiesMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ streakId });
        expect(response.locals.activities).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindActivitiesMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindActivitiesMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindActivitiesMiddleware, expect.any(Error)));
    });
});

describe('sendActivitiesMiddleware', () => {
    test('sends activities in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const activities = ['activity'];
        const response: any = { locals: { activities }, status };
        const next = jest.fn();

        sendActivitiesMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(activities);
    });

    test('calls next with SendActivitiesMiddleware on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendActivitiesMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendActivitiesMiddleware, expect.any(Error)));
    });
});

describe(`getAllActivitiesMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getAllActivitiesMiddlewares.length).toEqual(3);
        expect(getAllActivitiesMiddlewares[0]).toBe(getActivitiesQueryValidationMiddleware);
        expect(getAllActivitiesMiddlewares[1]).toBe(findActivitiesMiddleware);
        expect(getAllActivitiesMiddlewares[2]).toBe(sendActivitiesMiddleware);
    });
});
