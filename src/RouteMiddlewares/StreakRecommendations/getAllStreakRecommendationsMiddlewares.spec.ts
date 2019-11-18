/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllStreakRecommendationsMiddlewares,
    getStreakRecommendationsQueryValidationMiddleware,
    sendStreakRecommendationsMiddleware,
    getFindStreakRecommendationsMiddleware,
    findStreakRecommendationsMiddleware,
} from './getAllStreakRecommendationsMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe('getStreakRecommendationsValidationMiddleware', () => {
    test('passes valid request', () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const response: any = {
            status,
        };
        const next = jest.fn();

        getStreakRecommendationsQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findStreakRecommendationsMiddleware', () => {
    test('if random is true it returns the number of random streak recommendations based on the limit ', async () => {
        expect.assertions(3);
        const aggregate = jest.fn(() => Promise.resolve(true));
        const streakRecommendationModel = {
            aggregate,
        };
        const limit = 5;
        const request: any = {
            query: {
                random: true,
                limit: 5,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindStreakRecommendationsMiddleware(streakRecommendationModel as any);

        await middleware(request, response, next);

        expect(aggregate).toBeCalledWith([{ $sample: { size: Number(limit) } }]);
        expect(response.locals.streakRecommendations).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('if random is false it returns the number of streak recommendations based on the limit', async () => {
        expect.assertions(4);
        const limit = jest.fn().mockResolvedValue(true);
        const find = jest.fn(() => ({ limit }));
        const streakRecommendationModel = {
            find,
        };
        const request: any = {
            query: {
                random: false,
                limit: 5,
            },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindStreakRecommendationsMiddleware(streakRecommendationModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({});
        expect(limit).toBeCalledWith(Number('5'));
        expect(response.locals.streakRecommendations).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindStreakRecommendationsMiddleware error on middleware failure', async () => {
        expect.assertions(1);

        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        const middleware = getFindStreakRecommendationsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindStreakRecommendationsMiddleware, expect.any(Error)));
    });
});

describe('sendStreakRecommendationsMiddleware', () => {
    test('sends streakRecommendations in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const streakRecommendations = [
            {
                name: '30 minutes reading',
                description: 'Read for 30 minutes everyday',
                userId: '1234',
            },
        ];
        const response: any = { locals: { streakRecommendations }, status };
        const next = jest.fn();

        sendStreakRecommendationsMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(streakRecommendations);
    });

    test('calls next with SendStreakRecommendationsMiddleware on middleware failure', () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'sendStreakRecommendations error';
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendStreakRecommendationsMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendStreakRecommendationsMiddleware, expect.any(Error)));
    });
});

describe(`getAllStreakRecommendationsMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getAllStreakRecommendationsMiddlewares.length).toEqual(3);
        expect(getAllStreakRecommendationsMiddlewares[0]).toBe(getStreakRecommendationsQueryValidationMiddleware);
        expect(getAllStreakRecommendationsMiddlewares[1]).toBe(findStreakRecommendationsMiddleware);
        expect(getAllStreakRecommendationsMiddlewares[2]).toBe(sendStreakRecommendationsMiddleware);
    });
});
