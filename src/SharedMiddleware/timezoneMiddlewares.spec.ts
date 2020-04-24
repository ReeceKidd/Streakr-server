/* eslint-disable @typescript-eslint/no-explicit-any */
import { retrieveTimezoneHeaderMiddleware, getValidateTimezoneMiddleware } from './timezoneMiddlewares';
import { CustomError, ErrorType } from '../customError';

describe('retrieveTimezoneHeaderMiddleware', () => {
    test('sets response.locals.timezone and calls next()', () => {
        const timezone = 'Europe/London';
        expect.assertions(3);
        const header = jest.fn(() => timezone);
        const request: any = {
            header,
        };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        retrieveTimezoneHeaderMiddleware(request, response, next);

        expect(header).toBeCalledWith('x-timezone');
        expect(response.locals.timezone).toBeDefined();
        expect(next).toBeCalledWith();
    });

    test('throws CreateSoloStreakTaskCompleteMissingTimezoneHeader error when timezone is missing', () => {
        expect.assertions(1);
        const timezoneHeader = undefined;
        const header = jest.fn(() => timezoneHeader);
        const request: any = {
            header,
        };
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        retrieveTimezoneHeaderMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.MissingTimezoneHeader));
    });

    test('throws RetrieveTimezoneHeaderMiddleware when middleware fails', () => {
        expect.assertions(1);
        const request: any = {};
        const response: any = {
            locals: {},
        };
        const next = jest.fn();

        retrieveTimezoneHeaderMiddleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.RetrieveTimezoneHeaderMiddleware, expect.any(Error)));
    });
});

describe('validateTimezoneMiddleware', () => {
    test('sets response.locals.validTimezone and calls next()', () => {
        expect.assertions(2);
        const timezone = 'Europe/London';
        const request: any = {};
        const response: any = { locals: { timezone } };
        const next = jest.fn();
        const isValidTimezone = jest.fn(() => true);
        const middleware = getValidateTimezoneMiddleware(isValidTimezone);

        middleware(request, response, next);

        expect(isValidTimezone).toBeCalledWith(timezone);
        expect(next).toBeCalledWith();
    });

    test('throws InvalidTimezone error when timezone is invalid', () => {
        expect.assertions(1);
        const timezone = 'Invalid';
        const request: any = {};
        const response: any = { locals: { timezone } };
        const next = jest.fn();
        const isValidTimezone = jest.fn(() => false);
        const middleware = getValidateTimezoneMiddleware(isValidTimezone);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.InvalidTimezone));
    });

    test('throws ValidateTimezoneMiddleware error on middleware failure', () => {
        expect.assertions(1);
        const timezone = 'Europe/London';
        const request: any = {};
        const response: any = { locals: { timezone } };
        const next = jest.fn();
        const middleware = getValidateTimezoneMiddleware(undefined as any);

        middleware(request, response, next);

        expect(next).toBeCalledWith(new CustomError(ErrorType.ValidateTimezoneMiddleware, expect.any(Error)));
    });
});
