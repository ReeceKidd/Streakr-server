/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorHandler } from './errorHandler';
jest.mock('@sentry/node', () => ({
    setUser: jest.fn(),
    captureException: jest.fn(),
}));
jest.mock('./getServiceConfig', () => ({
    getServiceConfig: jest.fn(() => ({
        NODE_ENV: 'production',
    })),
}));

import * as Sentry from '@sentry/node';

describe('errorHandler', () => {
    test('if node env does not equal test and response.locals.user is undefined Sentry captures the exception without user data', () => {
        expect.assertions(1);
        const CustomError = {
            httpStatusCode: 400,
            body: {
                code: '400',
                message: 'Mock message',
            },
            localisedErrorMessage: 'Mock message',
        } as any;
        const request: any = {};
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = {
            locals: {},
            status,
        };
        const next = jest.fn();

        errorHandler(CustomError, request, response, next);

        expect(Sentry.captureException).toBeCalledWith(CustomError);
    });
    test('if node env does not equal test and response.locals.user is defined Sentry captures the exception with user data', () => {
        expect.assertions(2);
        const CustomError = {
            httpStatusCode: 400,
            body: {
                code: '400',
                message: 'Mock message',
            },
        } as any;
        const request: any = {};
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const email = 'user@gmail.com';
        const username = 'username';
        const _id = 'id';
        const response: any = {
            locals: { user: { email, username, _id } },
            status,
        };
        const next = jest.fn();

        errorHandler(CustomError, request, response, next);
        expect(Sentry.setUser).toBeCalledWith({ email, username, id: _id });
        expect(Sentry.captureException).toBeCalledWith(CustomError);
    });
    test('sends errors with httpStatusCode', () => {
        expect.assertions(2);
        const CustomError = {
            httpStatusCode: 400,
            body: {
                code: '400',
                message: 'Mock message',
            },
            localisedErrorMessage: 'Mock message',
        } as any;
        const request: any = {};
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = {
            locals: {},
            status,
        };
        const next = jest.fn();

        errorHandler(CustomError, request, response, next);

        expect(status).toBeCalledWith(400);
        expect(send).toBeCalledWith(CustomError);
    });

    test('sends errors without httpStatusCode', () => {
        expect.assertions(2);
        const CustomError = {
            body: {
                code: '400',
                message: 'Mock message',
            },
            localisedErrorMessage: 'Mock message',
        } as any;
        const request: any = {};
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = {
            locals: {},
            status,
        };
        const next = jest.fn();

        errorHandler(CustomError, request, response, next);

        expect(status).toBeCalledWith(500);
        expect(send).toBeCalledWith(CustomError);
    });
});
