import {
    verifyJsonWebTokenMiddlewares,
    retreiveJsonWebTokenMiddleware,
    getRetreiveJsonWebTokenMiddleware,
    jsonWebTokenDoesNotExistResponseMiddleware,
    getJsonWebTokenDoesNotExistResponseMiddleware,
    decodeJsonWebTokenMiddleware,
    getDecodeJsonWebTokenMiddleware,
    DecodedJsonWebToken,
    jsonWebTokenErrorResponseMiddleware,
    getJsonWebTokenErrorResponseMiddleware,
    VerifyJsonWebTokenResponseLocals,
} from './verifyJsonWebTokenMiddlewares'

import { SupportedHeaders } from '../../Server/headers';
import { AuthResponseObject } from "../../Server/response";
import { ErrorStatusCodes } from '../../Server/statusCodes';

describe('retreiveJsonWebTokenMiddleware', () => {
    test('should set response.locals.jsonWebToken', () => {

        const jsonWebTokenHeaderNameMock = 123;

        const response: any = { locals: {} };
        const request: any = { headers: { [SupportedHeaders.xAccessToken]: jsonWebTokenHeaderNameMock } };
        const next = jest.fn();

        const middleware = getRetreiveJsonWebTokenMiddleware(SupportedHeaders.xAccessToken);
        middleware(request, response, next);

        expect.assertions(2);
        expect(response.locals.jsonWebToken).toBeDefined();
        expect(next).toBeCalled();
    });

    test('should call next with an error on failure', () => {

        const response: any = { locals: {} };
        const request: any = {};
        const next = jest.fn();

        const middleware = getRetreiveJsonWebTokenMiddleware(SupportedHeaders.xAccessToken);
        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot read property 'x-access-token' of undefined"));
    });

});

describe(`jsonWebTokenDoesNotExistResponseMiddleware`, () => {

    const ERROR_MESSAGE = 'Error'
    const mockJsonWebTokenValidationErrorObject = {
        auth: false,
        message: ERROR_MESSAGE
    }
    const mockJsonWebToken = '1234'

    test("checks when response.locals.jsonWebToken is defined next function is called", () => {

        const response: any = { locals: { jsonWebToken: mockJsonWebToken } };

        const request: any = {}
        const next = jest.fn();

        const middleware = getJsonWebTokenDoesNotExistResponseMiddleware(mockJsonWebTokenValidationErrorObject, ErrorStatusCodes.missingJsonWebToken);
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith()
    });

    test("checks that when jsonWebToken is undefined an error response is sent", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response: any = { locals: {}, status };
        const request: any = {}
        const next = jest.fn();

        const middleware = getJsonWebTokenDoesNotExistResponseMiddleware(mockJsonWebTokenValidationErrorObject, ErrorStatusCodes.missingJsonWebToken);
        middleware(request, response, next)

        expect.assertions(3);
        expect(status).toBeCalledWith(401)
        expect(send).toBeCalledWith(mockJsonWebTokenValidationErrorObject)
        expect(next).not.toBeCalled()
    })

    test("should call next with an error on failure", () => {

        const status = jest.fn(() => ({ send }));
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const response: any = { locals: {}, status };

        const request: any = {}
        const next = jest.fn();

        const middleware = getJsonWebTokenDoesNotExistResponseMiddleware(mockJsonWebTokenValidationErrorObject, ErrorStatusCodes.missingJsonWebToken);
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
    })



});

describe('decodeJsonWebTokenMiddleware', () => {

    const ERROR_MESSAGE = 'error'

    test('that response.locals.token is set', async () => {
        const tokenMock = '1234';
        const verifyMock = jest.fn(() => true);
        const jwtSecretMock = 'abc#*'
        const decodedJsonWebToken: DecodedJsonWebToken = {
            minimumUserData: {
                _id: '1234',
                userName: 'tester'
            }
        }
        const locals: VerifyJsonWebTokenResponseLocals = {
            jsonWebToken: tokenMock,
            decodedJsonWebToken
        }
        const response: any = { locals };
        const request: any = {};
        const next = jest.fn();

        const middleware = getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
        middleware(request, response, next);

        expect.assertions(3);
        expect(verifyMock).toBeCalledWith(tokenMock, jwtSecretMock);
        expect(locals.decodedJsonWebToken).toBeDefined();
        expect(next).toBeCalled();
    });

    test('that response.locals.jsonWebTokenError is defined', async () => {
        expect.assertions(2);
        const verifyMock = jest.fn(() => {

            throw new Error(ERROR_MESSAGE);
        });
        const tokenMock = '1234';
        const jwtSecretMock = '1234';

        const response: any = { locals: { jsonWebToken: tokenMock } };
        const request: any = {};
        const next = jest.fn();

        const middleware = getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
        await middleware(request, response, next);

        expect(next).toBeCalled();
        expect(response.locals.jsonWebTokenError).toEqual(new Error(ERROR_MESSAGE))
    });


    test("next should be called on failure", () => {

        const verifyMock = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const jwtSecretMock = '1234'
        const response: any = {}
        const request: any = {}
        const next = jest.fn();

        const middleware = getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `jsonWebToken` of 'undefined' or 'null'."))
    })

});

describe(`jsonWebTokenErrorResponseMiddleware`, () => {

    const errorMessage = 'Failure'
    const errorStatusCode = 401

    test("should send jsonWebToken error if it is defined in response.locals", () => {

        const jsonWebTokenError = {
            auth: false,
            name: "TokenExpiredError",
            message: "jwt expired",
            expiredAt: "2019-01-16T06:15:39.000Z"
        }

        const send = jest.fn()
        const status = jest.fn(() => ({ send }))
        const response: any = { locals: { jsonWebTokenError }, status };

        const request: any = {}
        const next = jest.fn();

        const jsonWebTokenErrorResponse: AuthResponseObject = {
            message: errorMessage,
            auth: false
        }


        const middleware = getJsonWebTokenErrorResponseMiddleware(
            errorMessage,
            errorStatusCode);
        middleware(request, response, next)

        expect.assertions(4);
        expect(response.locals.jsonWebTokenError).toBeDefined()
        expect(next).not.toBeCalled()
        expect(status).toBeCalledWith(errorStatusCode)
        expect(send).toBeCalledWith(jsonWebTokenErrorResponse)
    });

    test("should call next with no paramaters when jsonWebTokenError is not defined.", () => {
        const response: any = { locals: {} };
        const request: any = {}
        const next = jest.fn();

        const middleware = getJsonWebTokenErrorResponseMiddleware(
            errorMessage,
            errorStatusCode)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalled()
    })


    test("should call next with an error on failure", () => {

        const request: any = {}
        const response: any = {}
        const next = jest.fn();

        const middleware = getJsonWebTokenErrorResponseMiddleware(
            errorMessage,
            errorStatusCode)
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `jsonWebTokenError` of 'undefined' or 'null'."))
    })


});

describe(`verifyJsonWebTokenMiddlewares`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
        expect.assertions(4);
        expect(verifyJsonWebTokenMiddlewares[0]).toBe(retreiveJsonWebTokenMiddleware)
        expect(verifyJsonWebTokenMiddlewares[1]).toBe(jsonWebTokenDoesNotExistResponseMiddleware)
        expect(verifyJsonWebTokenMiddlewares[2]).toBe(decodeJsonWebTokenMiddleware)
        expect(verifyJsonWebTokenMiddlewares[3]).toBe(jsonWebTokenErrorResponseMiddleware)
    });
});