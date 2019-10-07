/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorHandler } from './errorHandler';

describe('errorHandler', () => {
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
            status,
        };
        const next = jest.fn();

        errorHandler(CustomError, request, response, next);

        expect(status).toBeCalledWith(500);
        expect(send).toBeCalledWith(CustomError);
    });
});
