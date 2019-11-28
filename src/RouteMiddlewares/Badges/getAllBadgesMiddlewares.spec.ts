/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllBadgesMiddlewares,
    getBadgesQueryValidationMiddleware,
    getFindBadgesMiddleware,
    findBadgesMiddleware,
    sendBadgesMiddleware,
} from './getAllBadgesMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { BadgeTypes } from '@streakoid/streakoid-sdk/lib';

const name = 'name';
const badgeType = BadgeTypes.challenge;

const query = {
    name,
    badgeType,
};

describe('getBadgesValidationMiddleware', () => {
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

        getBadgesQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findBadgesMiddleware', () => {
    test('queries database with just name and sets response.locals.badges', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
        };
        const request: any = { query: { name } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindBadgesMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ name });
        expect(response.locals.badges).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just badgeType and sets response.locals.badges', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
        };
        const request: any = { query: { badgeType } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindBadgesMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ badgeType });
        expect(response.locals.badges).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindBadgesMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindBadgesMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindBadgesMiddleware, expect.any(Error)));
    });
});

describe('sendBadgesMiddleware', () => {
    test('sends badges in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const badges = [
            {
                name,
            },
        ];
        const response: any = { locals: { badges }, status };
        const next = jest.fn();

        sendBadgesMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(badges);
    });

    test('calls next with SendBadgesMiddleware on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendBadgesMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendBadgesMiddleware, expect.any(Error)));
    });
});

describe(`getAllBadgesMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getAllBadgesMiddlewares.length).toEqual(3);
        expect(getAllBadgesMiddlewares[0]).toBe(getBadgesQueryValidationMiddleware);
        expect(getAllBadgesMiddlewares[1]).toBe(findBadgesMiddleware);
        expect(getAllBadgesMiddlewares[2]).toBe(sendBadgesMiddleware);
    });
});
