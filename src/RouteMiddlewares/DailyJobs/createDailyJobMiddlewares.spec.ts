/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createDailyJobBodyValidationMiddleware,
    getSaveDailyJobToDatabaseMiddleware,
    sendFormattedDailyJobMiddleware,
    createDailyJobMiddlewares,
    saveDailyJobToDatabaseMiddleware,
} from './createDailyJobMiddlewares';
import { StreakTypes, AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

describe(`createDailyJobBodyValidationMiddleware`, () => {
    const agendaJobId = 'agendaJobId';
    const jobName = AgendaJobNames.soloStreakDailyTracker;
    const timezone = 'Europe/London';
    const localisedJobCompleteTime = new Date().toString();
    const streakType = StreakTypes.team;

    const body = {
        agendaJobId,
        jobName,
        timezone,
        localisedJobCompleteTime,
        streakType,
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

        createDailyJobBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct error response when agendaJobId is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, agendaJobId: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createDailyJobBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "agendaJobId" fails because ["agendaJobId" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct correct response when jobName is incorrect', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, jobName: 'incorrect' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createDailyJobBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message:
                'child "jobName" fails because ["jobName" must be one of [soloStreakDailyTracker, teamStreakDailyTracker]]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when timezone is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, timezone: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createDailyJobBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "timezone" fails because ["timezone" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when localisedJobCompleteTime is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, localisedJobCompleteTime: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createDailyJobBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "localisedJobCompleteTime" fails because ["localisedJobCompleteTime" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when streakType is not valid', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, streakType: 'invalid' },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createDailyJobBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "streakType" fails because ["streakType" must be one of [solo, team, teamMember]]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`saveDailyJobToDatabaseMiddleware`, () => {
    test('sets response.locals.savedDailyJob', async () => {
        expect.assertions(2);

        const jobName = AgendaJobNames.soloStreakDailyTracker;
        const timezone = 'Europe/London';
        const localisedJobCompleteTime = new Date().toString();
        const streakType = StreakTypes.team;

        const save = jest.fn().mockResolvedValue(true);

        const dailyJob = jest.fn(() => ({ save }));

        const request: any = {
            body: { jobName, timezone, localisedJobCompleteTime, streakType },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getSaveDailyJobToDatabaseMiddleware(dailyJob as any);

        await middleware(request, response, next);

        expect(response.locals.savedDailyJob).toBeDefined();
        expect(save).toBeCalledWith();
    });

    test('calls next with CreateDailyJobFromRequestMiddleware error on middleware failure', () => {
        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getSaveDailyJobToDatabaseMiddleware({} as any);

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateDailyJobFromRequestMiddleware, expect.any(Error)));
    });
});

describe(`sendFormattedDailyJobMiddleware`, () => {
    test('sends savedDailyJob in request', () => {
        expect.assertions(3);
        const jobName = AgendaJobNames.soloStreakDailyTracker;
        const timezone = 'Europe/London';
        const localisedJobCompleteTime = new Date().toString();
        const streakType = StreakTypes.team;
        const savedDailyJob = {
            jobName,
            timezone,
            localisedJobCompleteTime,
            streakType,
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedDailyJob }, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedDailyJobMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith({
            jobName,
            timezone,
            localisedJobCompleteTime,
            streakType,
        });
    });

    test('calls next with SendFormattedDailyJobMiddlewar error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendFormattedDailyJobMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedDailyJobMiddleware));
    });
});

describe(`createDailyJobMiddlewares`, () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(createDailyJobMiddlewares.length).toEqual(3);
        expect(createDailyJobMiddlewares[0]).toBe(createDailyJobBodyValidationMiddleware);
        expect(createDailyJobMiddlewares[1]).toBe(saveDailyJobToDatabaseMiddleware);
        expect(createDailyJobMiddlewares[2]).toBe(sendFormattedDailyJobMiddleware);
    });
});
