/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllActivityFeedItemsMiddlewares,
    getActivityFeedItemsQueryValidationMiddleware,
    getFindActivityFeedItemsMiddleware,
    findActivityFeedItemsMiddleware,
    sendActivityFeedItemsMiddleware,
    formActivityFeedItemsQueryMiddleware,
    calculateTotalCountOfActivityFeedItemsMiddleware,
    getCalculateTotalCountOfActivityFeedItemsMiddleware,
} from './getAllActivityFeedItemsMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

const userIds = ['userId'];
const subjectId = 'streakId';
const activityFeedItemType = ActivityFeedItemTypes.completedSoloStreak;
const limit = 10;
const lastActivityFeedItemId = 'lastActivityFeedItemId';

const query = {
    userIds,
    subjectId,
    activityFeedItemType,
    limit,
    lastActivityFeedItemId,
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

describe('formActivityFeedItemsQueryMiddleware', () => {
    test('populates response.locals.query with the activity feed items query', async () => {
        expect.assertions(2);
        const request: any = {
            query: {
                userIds: `["userId"]`,
                subjectId: 'subjectId',
                activityFeedItemType: ActivityFeedItemTypes.completedSoloStreak,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();

        await formActivityFeedItemsQueryMiddleware(request, response, next);

        expect(response.locals.query).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with FormActivityFeedItemsQueryMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        formActivityFeedItemsQueryMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormActivityFeedItemsQueryMiddleware, expect.any(Error)));
    });
});

describe('calculateTotalCountOfActivityFeedItemsMiddleware', () => {
    test('sets response.locals.totalCountOfActivityFeedItems with the count value', async () => {
        expect.assertions(4);
        const count = jest.fn(() => 10);
        const find = jest.fn(() => ({ count }));
        const activityModel = {
            find,
        };
        const request: any = { query: { userIds: `["userId"]`, limit: 10, skip: 0 } };
        const response: any = { locals: { query: { subjectId: 'subjectId' } } };
        const next = jest.fn();
        const middleware = getCalculateTotalCountOfActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith(response.locals.query);
        expect(count).toBeCalledWith();
        expect(response.locals.totalCountOfActivityFeedItems).toEqual(10);
        expect(next).toBeCalledWith();
    });

    test('calls next with CalculateTotalCountOfActivityFeedItemsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getCalculateTotalCountOfActivityFeedItemsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CalculateTotalCountOfActivityFeedItemsMiddleware, expect.any(Error)),
        );
    });
});

describe('findActivityFeedItemsMiddleware', () => {
    test('if lastActivityFeedItemId isnt defined the query begins from the start of the collection.', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const activityModel = {
            find,
        };
        const request: any = { query: { limit: 10, skip: 0 } };
        const response: any = { locals: { query: { subjectId: 'subjectId' } } };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalled();
        expect(limit).toBeCalledWith(10);
        expect(response.locals.activityFeedItems).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('if lastActivityFeedItemId is defined the query begins from the lastActivityFeedItemId.', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const activityModel = {
            find,
        };
        const request: any = {
            query: { limit: 10, skip: 0, lastActivityFeedItemId: '5d0fc0de86821005b0e9de5b' },
        };
        const response: any = {
            locals: { query: { subjectId: 'subjectId' } },
        };
        const next = jest.fn();
        const middleware = getFindActivityFeedItemsMiddleware(activityModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalled();
        expect(limit).toBeCalledWith(10);
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
        const totalCountOfActivityFeedItems = 10;
        const response: any = { locals: { activityFeedItems, totalCountOfActivityFeedItems }, status };
        const next = jest.fn();

        sendActivityFeedItemsMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith({ activityFeedItems, totalCountOfActivityFeedItems });
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
        expect.assertions(6);

        expect(getAllActivityFeedItemsMiddlewares.length).toEqual(5);
        expect(getAllActivityFeedItemsMiddlewares[0]).toBe(getActivityFeedItemsQueryValidationMiddleware);
        expect(getAllActivityFeedItemsMiddlewares[1]).toBe(formActivityFeedItemsQueryMiddleware);
        expect(getAllActivityFeedItemsMiddlewares[2]).toBe(calculateTotalCountOfActivityFeedItemsMiddleware);
        expect(getAllActivityFeedItemsMiddlewares[3]).toBe(findActivityFeedItemsMiddleware);
        expect(getAllActivityFeedItemsMiddlewares[4]).toBe(sendActivityFeedItemsMiddleware);
    });
});
