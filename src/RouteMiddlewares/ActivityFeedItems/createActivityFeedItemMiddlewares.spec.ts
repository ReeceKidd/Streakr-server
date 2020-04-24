/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createActivityFeedItemBodyValidationMiddleware,
    sendActivityFeedItemMiddleware,
    createActivityFeedItemMiddlewares,
    saveActivityFeedItemToDatabaseMiddleware,
    getSaveActivityFeedItemToDatabaseMiddleware,
} from './createActivityFeedItemMiddlewares';
import { ActivityFeedItemTypes } from '@streakoid/streakoid-models/lib';

describe(`createActivityFeedItemBodyValidationMiddleware`, () => {
    const activityFeedItemType = ActivityFeedItemTypes.lostSoloStreak;
    const userId = 'userId';
    const username = 'username';
    const userProfileImage = 'google.com/image';
    const soloStreakId = 'soloStreakId';
    const soloStreakName = 'Reading';
    const challengeStreakId = 'challengeStreakId';
    const challengeId = 'challengeId';
    const challengeName = 'Yoga';
    const teamStreakId = 'teamStreakId';
    const teamStreakName = 'teamStreakName';
    const numberOfDaysLost = 10;

    const body = {
        activityFeedItemType,
        userId,
        username,
        userProfileImage,
        soloStreakId,
        soloStreakName,
        challengeStreakId,
        challengeId,
        challengeName,
        teamStreakId,
        teamStreakName,
        numberOfDaysLost,
    };

    test('check that valid request passes', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body,
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createActivityFeedItemBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct correct response when activityFeedItemType is incorrect', () => {
        expect.assertions(2);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, activityFeedItemType: 'incorrect' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createActivityFeedItemBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(next).not.toBeCalled();
    });

    test('sends correct correct response when activityFeedItemType is undefined', () => {
        expect.assertions(2);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, activityFeedItemType: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createActivityFeedItemBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(next).not.toBeCalled();
    });
});

describe(`saveActivityFeedItemToDatabaseMiddleware`, () => {
    test('sets response.locals.activityFeedItem', async () => {
        expect.assertions(2);

        const activityFeedItemType = 'LostStreak';
        const subjectId = 'abcdefg';
        const userId = '12345';

        const createActivityFeedItem = jest.fn().mockResolvedValue(true);

        const request: any = { body: { activityFeedItemType, subjectId, userId } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getSaveActivityFeedItemToDatabaseMiddleware(createActivityFeedItem);

        await middleware(request, response, next);

        expect(response.locals.activityFeedItem).toBeDefined();
        expect(createActivityFeedItem).toBeCalled();
    });

    test('calls next with SaveActivityFeedItemToDatabaseMiddleware error on middleware failure', () => {
        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        const middleware = getSaveActivityFeedItemToDatabaseMiddleware({} as any);

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SaveActivityFeedItemToDatabaseMiddleware, expect.any(Error)),
        );
    });
});

describe(`sendActivityFeedItemMiddleware`, () => {
    test('sends savedActivityFeedItem in request', () => {
        expect.assertions(3);
        const activityFeedItemType = 'LostStreak';
        const subjectId = 'abcdefg';
        const userId = '12345';
        const activityFeedItem = {
            activityFeedItemType,
            subjectId,
            userId,
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { activityFeedItem }, status };
        const request: any = {};
        const next = jest.fn();

        sendActivityFeedItemMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith({ activityFeedItemType, subjectId, userId });
    });

    test('calls next with SendActivityFeedItemMiddlewar error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendActivityFeedItemMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendActivityFeedItemMiddleware));
    });
});

describe(`createActivityFeedItemMiddlewares`, () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(createActivityFeedItemMiddlewares.length).toEqual(3);
        expect(createActivityFeedItemMiddlewares[0]).toBe(createActivityFeedItemBodyValidationMiddleware);
        expect(createActivityFeedItemMiddlewares[1]).toBe(saveActivityFeedItemToDatabaseMiddleware);
        expect(createActivityFeedItemMiddlewares[2]).toBe(sendActivityFeedItemMiddleware);
    });
});
