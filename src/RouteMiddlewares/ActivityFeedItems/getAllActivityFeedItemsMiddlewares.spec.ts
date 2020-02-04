/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllActivityFeedItemsMiddlewares,
    getActivityFeedItemsQueryValidationMiddleware,
    getFindActivityFeedItemsMiddleware,
    findActivityFeedItemsMiddleware,
    sendActivityFeedItemsMiddleware,
    DEFAULT_ACTIVITY_FEED_ITEMS_LIMIT,
    DEFAULT_ACTIVITY_FEED_ITEMS_SKIP,
} from './getAllActivityFeedItemsMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

const userIds = ['userId'];
const subjectId = 'streakId';
const activityFeedItemType = ActivityFeedItemTypes.completedSoloStreak;
const limit = 10;
const skip = 20;

const query = {
    userIds,
    subjectId,
    activityFeedItemType,
    limit,
    skip,
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
    test('queries database with just userIds and sets response.locals.activityFeedItems', async () => {
        expect.assertions(5);
        const skip = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ skip }));
        const find = jest.fn(() => ({ limit }));
        const activityModel = {
            find,
        };
        const request: any = { query: { userIds: `["userId"]` } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalled();
        expect(limit).toBeCalledWith(DEFAULT_ACTIVITY_FEED_ITEMS_LIMIT);
        expect(skip).toBeCalledWith(DEFAULT_ACTIVITY_FEED_ITEMS_SKIP);
        expect(response.locals.activityFeedItems).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just subjectId and sets response.locals.activityFeedItems', async () => {
        expect.assertions(5);
        const skip = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ skip }));
        const find = jest.fn(() => ({ limit }));
        const activityModel = {
            find,
        };
        const request: any = { query: { subjectId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ subjectId });
        expect(limit).toBeCalledWith(DEFAULT_ACTIVITY_FEED_ITEMS_LIMIT);
        expect(skip).toBeCalledWith(DEFAULT_ACTIVITY_FEED_ITEMS_SKIP);
        expect(response.locals.activityFeedItems).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just activityFeedItemType and sets response.locals.activityFeedItems', async () => {
        expect.assertions(5);
        const skip = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ skip }));
        const find = jest.fn(() => ({ limit }));
        const activityModel = {
            find,
        };
        const request: any = { query: { activityFeedItemType } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ activityFeedItemType });
        expect(limit).toBeCalledWith(DEFAULT_ACTIVITY_FEED_ITEMS_LIMIT);
        expect(skip).toBeCalledWith(DEFAULT_ACTIVITY_FEED_ITEMS_SKIP);
        expect(response.locals.activityFeedItems).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database using custom limit value and sets response.locals.activityFeedItems', async () => {
        expect.assertions(5);
        const skip = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ skip }));
        const find = jest.fn(() => ({ limit }));
        const activityModel = {
            find,
        };
        const customLimit = 30;
        const request: any = { query: { limit: customLimit } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(limit).toBeCalledWith(customLimit);
        expect(skip).toBeCalledWith(DEFAULT_ACTIVITY_FEED_ITEMS_SKIP);
        expect(response.locals.activityFeedItems).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database using custom skip value and sets response.locals.activityFeedItems', async () => {
        expect.assertions(5);
        const skip = jest.fn().mockResolvedValue(true);
        const limit = jest.fn(() => ({ skip }));
        const find = jest.fn(() => ({ limit }));
        const activityModel = {
            find,
        };
        const customSkip = 20;
        const request: any = { query: { skip: customSkip } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(limit).toBeCalledWith(DEFAULT_ACTIVITY_FEED_ITEMS_LIMIT);
        expect(skip).toBeCalledWith(customSkip);
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
