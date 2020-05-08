/* eslint-disable @typescript-eslint/no-explicit-any */
import { errorHandler } from './errorHandler';
import { ResponseCodes } from './Server/responseCodes';

describe('errorHandler', () => {
    test('sends errors with 500 httpStatusCodes', () => {
        expect.assertions(2);
        const CustomError = {
            httpStatusCode: ResponseCodes.warning,
            body: {
                code: '500',
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
        expect(send).toBeCalledWith({ ...CustomError, message: 'Internal server error' });
    });

    test('sends errors with non 500 httpStatusCode', () => {
        expect.assertions(2);
        const CustomError = {
            body: {
                code: '400',
                message: 'Mock message',
            },
            httpStatusCode: ResponseCodes.unprocessableEntity,
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

        expect(status).toBeCalledWith(ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith(CustomError);
    });

    test('sends errors with out http status codes', () => {
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
