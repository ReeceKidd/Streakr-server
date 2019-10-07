/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createSoloStreakMiddlewares,
    createSoloStreakBodyValidationMiddleware,
    createSoloStreakFromRequestMiddleware,
    getCreateSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    sendFormattedSoloStreakMiddleware,
} from './createSoloStreakMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

describe(`createSoloStreakBodyValidationMiddleware`, () => {
    const userId = '12345678';
    const streakName = 'Spanish Streak';
    const streakDescription = ' Do the insane amount of XP for Duolingo each day';

    const body = {
        userId,
        streakName,
        streakDescription,
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

        createSoloStreakBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends userId is missing error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, userId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createSoloStreakBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends userId is not a string error', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, userId: 123 },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createSoloStreakBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]',
        });
        expect(next).not.toBeCalled();
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

        createSoloStreakBodyValidationMiddleware(request, response, next);

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

        createSoloStreakBodyValidationMiddleware(request, response, next);

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

        createSoloStreakBodyValidationMiddleware(request, response, next);

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

        createSoloStreakBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "numberOfMinutes" fails because ["numberOfMinutes" must be a positive number]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`createSoloStreakFromRequestMiddleware`, () => {
    test('sets response.locals.newSoloStreak', async () => {
        expect.assertions(2);
        const userId = 'abcdefg';
        const streakName = 'streak streakName';
        const streakDescription = 'mock streak streakDescription';
        const timezone = 'Europe/London';
        class SoloStreak {
            userId: string;
            streakName: string;
            streakDescription: string;
            timezone: string;

            constructor({ userId, streakName, streakDescription, timezone }: any) {
                this.userId = userId;
                this.streakName = streakName;
                this.streakDescription = streakDescription;
                this.timezone = timezone;
            }
        }
        const response: any = { locals: { timezone } };
        const request: any = { body: { userId, streakName, streakDescription } };
        const next = jest.fn();
        const newSoloStreak = new SoloStreak({
            userId,
            streakName,
            streakDescription,
            timezone,
        });
        const middleware = getCreateSoloStreakFromRequestMiddleware(SoloStreak as any);

        middleware(request, response, next);

        expect(response.locals.newSoloStreak).toEqual(newSoloStreak);
        expect(next).toBeCalledWith();
    });

    test('calls next with CreateSoloStreakFromRequestMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const timezone = 'Europe/London';
        const userId = 'abcdefg';
        const streakName = 'streak streakName';
        const streakDescription = 'mock streak streakDescription';
        const response: any = { locals: { timezone } };
        const request: any = { body: { userId, streakName, streakDescription } };
        const next = jest.fn();
        const middleware = getCreateSoloStreakFromRequestMiddleware({} as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(
            new CustomError(ErrorType.CreateSoloStreakFromRequestMiddleware, expect.any(Error)),
        );
    });
});

describe(`saveSoloStreakToDatabaseMiddleware`, () => {
    const ERROR_MESSAGE = 'error';

    test('sets response.locals.savedSoloStreak', async () => {
        expect.assertions(3);
        const save = jest.fn(() => {
            return Promise.resolve(true);
        });
        const mockSoloStreak = {
            userId: 'abcdefg',
            email: 'user@gmail.com',
            password: 'password',
            save,
        } as any;
        const response: any = { locals: { newSoloStreak: mockSoloStreak } };
        const request: any = {};
        const next = jest.fn();

        await saveSoloStreakToDatabaseMiddleware(request, response, next);

        expect(save).toBeCalled();
        expect(response.locals.savedSoloStreak).toBeDefined();
        expect(next).toBeCalled();
    });

    test('calls next with SaveSoloStreakToDatabaseMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const save = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE);
        });
        const request: any = {};
        const response: any = { locals: { newSoloStreak: { save } } };
        const next = jest.fn();

        await saveSoloStreakToDatabaseMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SaveSoloStreakToDatabaseMiddleware, expect.any(Error)));
    });
});

describe(`sendFormattedSoloStreakMiddleware`, () => {
    const ERROR_MESSAGE = 'error';
    const savedSoloStreak = {
        userId: 'abc',
        streakName: 'Daily Spanish',
        streakDescription: 'Practice spanish every day',
        startDate: new Date(),
    };

    test('responds with status 201 with soloStreak', () => {
        expect.assertions(4);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const soloStreakResponseLocals = {
            savedSoloStreak,
        };
        const response: any = { locals: soloStreakResponseLocals, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedSoloStreakMiddleware(request, response, next);

        expect(response.locals.user).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith(savedSoloStreak);
    });

    test('calls next with SendFormattedSoloStreakMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedSoloStreak }, status };

        const request: any = {};
        const next = jest.fn();

        sendFormattedSoloStreakMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedSoloStreakMiddleware, expect.any(Error)));
    });
});

describe(`createSoloStreakMiddlewares`, () => {
    test('that createSoloStreak middlewares are defined in the correct order', async () => {
        expect.assertions(5);

        expect(createSoloStreakMiddlewares.length).toEqual(4);
        expect(createSoloStreakMiddlewares[0]).toBe(createSoloStreakBodyValidationMiddleware);
        expect(createSoloStreakMiddlewares[1]).toBe(createSoloStreakFromRequestMiddleware);
        expect(createSoloStreakMiddlewares[2]).toBe(saveSoloStreakToDatabaseMiddleware);
        expect(createSoloStreakMiddlewares[3]).toBe(sendFormattedSoloStreakMiddleware);
    });
});
