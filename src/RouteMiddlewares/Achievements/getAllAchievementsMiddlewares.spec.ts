/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllAchievementsMiddlewares,
    getAchievementsQueryValidationMiddleware,
    getFindAchievementsMiddleware,
    findAchievementsMiddleware,
    sendAchievementsMiddleware,
    formAchievementsQueryMiddleware,
    calculateTotalCountOfAchievementsMiddleware,
    getCalculateTotalCountOfAchievementsMiddleware,
} from './getAllAchievementsMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { AchievementTypes, SupportedResponseHeaders } from '@streakoid/streakoid-models/lib';

const achievementType = AchievementTypes.oneHundredDaySoloStreak;

const query = {
    achievementType,
};

describe('getAchievementsValidationMiddleware', () => {
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

        getAchievementsQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('formAchievementsQueryMiddleware', () => {
    test('populates response.locals.query with the achievement feed items query', async () => {
        expect.assertions(2);
        const request: any = {
            query,
        };
        const response: any = { locals: {} };
        const next = jest.fn();

        await formAchievementsQueryMiddleware(request, response, next);

        expect(response.locals.query).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with FormAchievementsQueryMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        formAchievementsQueryMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FormAchievementsQueryMiddleware, expect.any(Error)));
    });
});

describe('calculateTotalCountOfAchievementsMiddleware', () => {
    test('sets response.headers.x-total count header with total count.', async () => {
        expect.assertions(4);
        const countDocuments = jest.fn(() => 10);
        const find = jest.fn(() => ({ countDocuments }));
        const achievementModel = {
            find,
        };
        const set = jest.fn();
        const request: any = { query: {} };
        const response: any = {
            set,
            locals: { query: { achievementType: AchievementTypes.oneHundredDaySoloStreak }, headers: {} },
        };
        const next = jest.fn();
        const middleware = getCalculateTotalCountOfAchievementsMiddleware(achievementModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith(response.locals.query);
        expect(countDocuments).toBeCalledWith();
        expect(set).toBeCalledWith(SupportedResponseHeaders.TotalCount, String(10));
        expect(next).toBeCalledWith();
    });

    test('calls next with CalculateTotalCountOfAchievementsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getCalculateTotalCountOfAchievementsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CalculateTotalCountOfAchievementsMiddleware, expect.any(Error)),
        );
    });
});

describe('findAchievementsMiddleware', () => {
    test('sets response.locals.achievements with achievements.', async () => {
        expect.assertions(3);
        const find = jest.fn().mockResolvedValue(true);
        const achievementModel = {
            find,
        };
        const request: any = { query: {} };
        const response: any = { locals: { query: { achievementType: AchievementTypes.oneHundredDaySoloStreak } } };
        const next = jest.fn();
        const middleware = getFindAchievementsMiddleware(achievementModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalled();
        expect(response.locals.achievements).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindAchievementsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindAchievementsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindAchievementsMiddleware, expect.any(Error)));
    });
});

describe('sendAchievementsMiddleware', () => {
    test('sends achievements in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const achievements = ['achievement'];
        const response: any = { locals: { achievements }, status };
        const next = jest.fn();

        sendAchievementsMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(achievements);
    });

    test('calls next with SendAchievementsMiddleware on middleware failure', () => {
        expect.assertions(1);

        const response: any = {};
        const request: any = {};
        const next = jest.fn();

        sendAchievementsMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendAchievementsMiddleware, expect.any(Error)));
    });
});

describe(`getAllAchievementsMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(6);

        expect(getAllAchievementsMiddlewares.length).toEqual(5);
        expect(getAllAchievementsMiddlewares[0]).toBe(getAchievementsQueryValidationMiddleware);
        expect(getAllAchievementsMiddlewares[1]).toBe(formAchievementsQueryMiddleware);
        expect(getAllAchievementsMiddlewares[2]).toBe(calculateTotalCountOfAchievementsMiddleware);
        expect(getAllAchievementsMiddlewares[3]).toBe(findAchievementsMiddleware);
        expect(getAllAchievementsMiddlewares[4]).toBe(sendAchievementsMiddleware);
    });
});
