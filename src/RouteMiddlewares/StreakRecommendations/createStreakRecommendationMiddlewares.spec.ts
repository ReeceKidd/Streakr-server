/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createStreakRecommendationMiddlewares,
    createStreakRecommendationBodyValidationMiddleware,
    createStreakRecommendationFromRequestMiddleware,
    getCreateStreakRecommendationFromRequestMiddleware,
    sendFormattedStreakRecommendationMiddleware,
} from './createStreakRecommendationMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`createStreakRecommendationBodyValidationMiddleware`, () => {
    const streakName = 'Spanish Streak';
    const streakDescription = ' Do the insane amount of XP for Duolingo each day';
    const numberOfMinutes = 20;

    const body = {
        streakName,
        streakDescription,
        numberOfMinutes,
    };

    test('valid request passes validation', () => {
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

        createStreakRecommendationBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends streakName is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakName: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createStreakRecommendationBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakName" fails because ["streakName" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends streakName is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakName: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createStreakRecommendationBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakName" fails because ["streakName" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends streakDescription is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakDescription: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createStreakRecommendationBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakDescription" fails because ["streakDescription" must be a string]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends numberOfMinutes is not a positive number error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, numberOfMinutes: -1 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createStreakRecommendationBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "numberOfMinutes" fails because ["numberOfMinutes" must be a positive number]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`createStreakRecommendationFromRequestMiddleware`, () => {
    test('sets response.locals.savedStreakRecommendation', async () => {
        expect.assertions(2);
        const userId = 'abcdefg';
        const streakName = 'streak streakName';
        const streakDescription = 'mock streak streakDescription';
        const timezone = 'Europe/London';
        const save = jest.fn().mockResolvedValue(true);
        const StreakRecommendation = jest.fn(() => ({ save }));

        const response: any = { locals: { timezone } };
        const request: any = { body: { userId, streakName, streakDescription } };
        const next = jest.fn();

        const middleware = getCreateStreakRecommendationFromRequestMiddleware(StreakRecommendation as any);

        await middleware(request, response, next);

        expect(response.locals.savedStreakRecommendation).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('calls next with CreateStreakRecommendationFromRequestMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const timezone = 'Europe/London';
        const userId = 'abcdefg';
        const streakName = 'streak streakName';
        const streakDescription = 'mock streak streakDescription';
        const response: any = { locals: { timezone } };
        const request: any = { body: { userId, streakName, streakDescription } };
        const next = jest.fn();
        const middleware = getCreateStreakRecommendationFromRequestMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateStreakRecommendationFromRequestMiddleware, expect.any(Error)),
        );
    });
});

describe(`sendFormattedStreakRecommendationMiddleware`, () => {
    const ERROR_MESSAGE = 'error';
    const savedStreakRecommendation = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('responds with status 201 with streakRecommendation', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const streakRecommendationResponseLocals = {
            savedStreakRecommendation,
        };
        const response: any = { locals: streakRecommendationResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedStreakRecommendationMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(savedStreakRecommendation);
    });

    test('calls next with SendFormattedStreakRecommendationMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedStreakRecommendation }, status };

        const request: any = {};
        const next = jest.fn();

        sendFormattedStreakRecommendationMiddleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.SendFormattedStreakRecommendationMiddleware, expect.any(Error)),
        );
    });
});

describe(`createStreakRecommendationMiddlewares`, () => {
    test('that createStreakRecommendation middlewares are defined in the correct order', async () => {
        expect.assertions(4);

        expect(createStreakRecommendationMiddlewares.length).toEqual(3);
        expect(createStreakRecommendationMiddlewares[0]).toBe(createStreakRecommendationBodyValidationMiddleware);
        expect(createStreakRecommendationMiddlewares[1]).toBe(createStreakRecommendationFromRequestMiddleware);
        expect(createStreakRecommendationMiddlewares[2]).toBe(sendFormattedStreakRecommendationMiddleware);
    });
});
