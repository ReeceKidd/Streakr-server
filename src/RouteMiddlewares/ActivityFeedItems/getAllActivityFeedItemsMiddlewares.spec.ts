/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllActivityFeedItemsMiddlewares,
    getActivityFeedItemsQueryValidationMiddleware,
    getFindActivityFeedItemsMiddleware,
    findActivityFeedItemsMiddleware,
    sendActivityFeedItemsMiddleware,
} from './getAllActivityFeedItemsMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

const userId = 'userId';
const subjectId = 'streakId';
const activityFeedItemType = ActivityFeedItemTypes.completedSoloStreak;

const query = {
    userId,
    subjectId,
    activityFeedItemType,
};

describe('getActivityFeedItemsValidationMiddleware', () => {
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

        getActivityFeedItemsQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findActivityFeedItemsMiddleware', () => {
    test('queries database with just userId and sets response.locals.activityFeedItems', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const activityModel = {
            find,
        };
        const request: any = { query: { userId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ userId });
        expect(response.locals.activityFeedItems).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just subjectId and sets response.locals.activityFeedItems', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const activityModel = {
            find,
        };
        const request: any = { query: { subjectId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ subjectId });
        expect(response.locals.activityFeedItems).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just activityFeedItemType and sets response.locals.activityFeedItems', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const activityModel = {
            find,
        };
        const request: any = { query: { activityFeedItemType } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ activityFeedItemType });
        expect(response.locals.activityFeedItems).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindActivityFeedItemsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindActivityFeedItemsMiddleware, expect.any(Error)));
    });
});

describe('sendActivityFeedItemsMiddleware', () => {
    test('sends activityFeedItems in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const activityFeedItems = ['activity'];
        const response: any = { locals: { activityFeedItems }, status };
        const next = jest.fn();

        sendActivityFeedItemsMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(activityFeedItems);
    });

    test('calls next with SendActivityFeedItemsMiddleware on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendActivityFeedItemsMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendActivityFeedItemsMiddleware, expect.any(Error)));
    });
});

describe(`getAllActivityFeedItemsMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getAllActivityFeedItemsMiddlewares.length).toEqual(3);
        expect(getAllActivityFeedItemsMiddlewares[0]).toBe(getActivityFeedItemsQueryValidationMiddleware);
        expect(getAllActivityFeedItemsMiddlewares[1]).toBe(findActivityFeedItemsMiddleware);
        expect(getAllActivityFeedItemsMiddlewares[2]).toBe(sendActivityFeedItemsMiddleware);
    });
});
