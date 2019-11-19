/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import {
    createBadgeBodyValidationMiddleware,
    getSaveBadgeToDatabaseMiddleware,
    sendFormattedBadgeMiddleware,
    createBadgeMiddlewares,
    saveBadgeToDatabaseMiddleware,
} from './createBadgeMiddlewares';
import { StreakTypes, AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

describe(`createBadgeBodyValidationMiddleware`, () => {
    const name = 'Paint';
    const description = 'Must sit down and paint for 30 minutes';
    const icon = 'paint-brush';
    const level = {
        level: 0,
        color: 'red',
        criteria: '30 days in a row',
    };
    const levels = [level];

    const body = {
        name,
        description,
        icon,
        levels,
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

        createBadgeBodyValidationMiddleware(request, response, next);

        expect(next).toBeCalled();
    });

    test('sends correct error response when name is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, name: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createBadgeBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "name" fails because ["name" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when description is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, description: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createBadgeBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "description" fails because ["description" is required]',
        });
        expect(next).not.toBeCalled();
    });

    test('sends correct error response when icon is missing', () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request: any = {
            body: { ...body, icon: undefined },
        };
        const response: any = {
            status,
        };
        const next = jest.fn();

        createBadgeBodyValidationMiddleware(request, response, next);

        expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "icon" fails because ["icon" is required]',
        });
        expect(next).not.toBeCalled();
    });
});

describe(`saveBadgeToDatabaseMiddleware`, () => {
    test('sets response.locals.savedBadge', async () => {
        expect.assertions(2);

        const jobName = AgendaJobNames.soloStreakDailyTracker;
        const timezone = 'Europe/London';
        const localisedJobCompleteTime = new Date().toString();
        const streakType = StreakTypes.team;

        const save = jest.fn().mockResolvedValue(true);

        const badge = jest.fn(() => ({ save }));

        const request: any = {
            body: { jobName, timezone, localisedJobCompleteTime, streakType },
        };
        const response: any = { locals: {} };
        const next = jest.fn();
        const middleware = getSaveBadgeToDatabaseMiddleware(badge as any);

        await middleware(request, response, next);

        expect(response.locals.savedBadge).toBeDefined();
        expect(save).toBeCalledWith();
    });

    test('calls next with CreateBadgeFromRequestMiddleware error on middleware failure', () => {
        const response: any = {};
        const request: any = {};
        const next = jest.fn();
        const middleware = getSaveBadgeToDatabaseMiddleware({} as any);

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new CustomError(ErrorType.CreateBadgeFromRequestMiddleware, expect.any(Error)));
    });
});

describe(`sendFormattedBadgeMiddleware`, () => {
    test('sends savedBadge in request', () => {
        expect.assertions(3);
        const name = 'Paint';
        const description = 'Must sit down and paint for 30 minutes';
        const icon = 'paint-brush';
        const level = {
            level: 0,
            color: 'red',
            criteria: '30 days in a row',
        };
        const levels = [level];

        const savedBadge = {
            name,
            description,
            icon,
            levels,
        };

        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: { savedBadge }, status };
        const request: any = {};
        const next = jest.fn();

        sendFormattedBadgeMiddleware(request, response, next);

        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(ResponseCodes.created);
        expect(send).toBeCalledWith({
            name,
            description,
            icon,
            levels,
        });
    });

    test('calls next with SendFormattedBadgeMiddlewar error on middleware failure', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {};
        const next = jest.fn();

        sendFormattedBadgeMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.SendFormattedBadgeMiddleware));
    });
});

describe(`createBadgeMiddlewares`, () => {
    test('are defined in the correct order', () => {
        expect.assertions(4);

        expect(createBadgeMiddlewares.length).toEqual(3);
        expect(createBadgeMiddlewares[0]).toBe(createBadgeBodyValidationMiddleware);
        expect(createBadgeMiddlewares[1]).toBe(saveBadgeToDatabaseMiddleware);
        expect(createBadgeMiddlewares[2]).toBe(sendFormattedBadgeMiddleware);
    });
});
