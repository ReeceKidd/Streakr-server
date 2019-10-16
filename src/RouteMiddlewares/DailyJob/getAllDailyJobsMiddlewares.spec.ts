/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    getAllDailyJobsMiddlewares,
    getDailyJobsQueryValidationMiddleware,
    getFindDailyJobsMiddleware,
    findDailyJobsMiddleware,
    sendDailyJobsMiddleware,
} from './getAllDailyJobsMiddlewares';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const agendaJobId = 'agendaJobId';
const jobName = 'jobName';
const timezone = 'timezone';

const query = {
    agendaJobId,
    jobName,
    timezone,
};

describe('getDailyJobsValidationMiddleware', () => {
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

        getDailyJobsQueryValidationMiddleware(request, response, next);

        expect(next).toBeCalledWith();
    });
});

describe('findDailyJobsMiddleware', () => {
    test('queries database with just agendaJobId and sets response.locals.dailyJobs', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
        };
        const request: any = { query: { agendaJobId } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindDailyJobsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ agendaJobId });
        expect(response.locals.dailyJobs).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with just jobName and sets response.locals.dailyJobs', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
        };
        const request: any = { query: { jobName } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindDailyJobsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ jobName });
        expect(response.locals.dailyJobs).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('queries database with timezone and sets response.locals.dailyJobs', async () => {
        expect.assertions(3);
        const find = jest.fn(() => Promise.resolve(true));
        const soloStreakModel = {
            find,
        };
        const request: any = { query: { timezone } };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getFindDailyJobsMiddleware(soloStreakModel as any);

        await middleware(request, response, next);

        expect(find).toBeCalledWith({ timezone });
        expect(response.locals.dailyJobs).toEqual(true);
        expect(next).toBeCalledWith();
    });

    test('calls next with FindDailyJobsMiddleware error on middleware failure', async () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();
        const middleware = getFindDailyJobsMiddleware({} as any);

        await middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.FindDailyJobsMiddleware, expect.any(Error)));
    });
});

describe('sendDailyJobsMiddleware', () => {
    test('sends dailyJobs in response', () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {};
        const dailyJobs = [
            {
                name: '30 minutes reading',
                description: 'Read for 30 minutes everyday',
                userId: '1234',
            },
        ];
        const response: any = { locals: { dailyJobs }, status };
        const next = jest.fn();

        sendDailyJobsMiddleware(request, response, next);

        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.success);
        expect(send).toBeCalledWith(dailyJobs);
    });

    test('calls next with SendDailyJobsMiddleware on middleware failure', () => {
        expect.assertions(1);
        const ERROR_MESSAGE = 'sendDailyJobs error';
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {};
        const next = jest.fn();

        sendDailyJobsMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendDailyJobsMiddleware, expect.any(Error)));
    });
});

describe(`getAllDailyJobsMiddlewares`, () => {
    test('are in the correct order', async () => {
        expect.assertions(4);

        expect(getAllDailyJobsMiddlewares.length).toEqual(3);
        expect(getAllDailyJobsMiddlewares[0]).toBe(getDailyJobsQueryValidationMiddleware);
        expect(getAllDailyJobsMiddlewares[1]).toBe(findDailyJobsMiddleware);
        expect(getAllDailyJobsMiddlewares[2]).toBe(sendDailyJobsMiddleware);
    });
});
