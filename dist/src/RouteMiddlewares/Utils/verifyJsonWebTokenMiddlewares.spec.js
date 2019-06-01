"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyJsonWebTokenMiddlewares_1 = require("./verifyJsonWebTokenMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
const headers_1 = require("../../Server/headers");
describe("retreiveJsonWebTokenMiddleware", () => {
    test("should set response.locals.jsonWebToken", () => {
        const jsonWebTokenHeaderNameMock = 123;
        const response = { locals: {} };
        const request = { headers: { [headers_1.SupportedRequestHeaders.xAccessToken]: jsonWebTokenHeaderNameMock } };
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getRetreiveJsonWebTokenMiddleware(headers_1.SupportedRequestHeaders.xAccessToken);
        middleware(request, response, next);
        expect.assertions(2);
        expect(response.locals.jsonWebToken).toBeDefined();
        expect(next).toBeCalled();
    });
    test("should call next with an error on failure", () => {
        const response = { locals: {} };
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getRetreiveJsonWebTokenMiddleware(headers_1.SupportedRequestHeaders.xAccessToken);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot read property 'x-access-token' of undefined"));
    });
});
describe(`jsonWebTokenDoesNotExistResponseMiddleware`, () => {
    const ERROR_MESSAGE = "Error";
    const mockJsonWebTokenValidationErrorObject = {
        auth: false,
        message: ERROR_MESSAGE
    };
    const mockJsonWebToken = "1234";
    test("checks when response.locals.jsonWebToken is defined next function is called", () => {
        const response = { locals: { jsonWebToken: mockJsonWebToken } };
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getJsonWebTokenDoesNotExistResponseMiddleware(mockJsonWebTokenValidationErrorObject, responseCodes_1.ResponseCodes.unautohorized);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith();
    });
    test("checks that when jsonWebToken is undefined an error response is sent", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response = { locals: {}, status };
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getJsonWebTokenDoesNotExistResponseMiddleware(mockJsonWebTokenValidationErrorObject, responseCodes_1.ResponseCodes.unautohorized);
        middleware(request, response, next);
        expect.assertions(3);
        expect(status).toBeCalledWith(401);
        expect(send).toBeCalledWith(mockJsonWebTokenValidationErrorObject);
        expect(next).not.toBeCalled();
    });
    test("should call next with an error on failure", () => {
        const status = jest.fn(() => ({ send }));
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const response = { locals: {}, status };
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getJsonWebTokenDoesNotExistResponseMiddleware(mockJsonWebTokenValidationErrorObject, responseCodes_1.ResponseCodes.unautohorized);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
    });
});
describe("decodeJsonWebTokenMiddleware", () => {
    const ERROR_MESSAGE = "error";
    test("that response.locals.token is set", () => __awaiter(this, void 0, void 0, function* () {
        const tokenMock = "1234";
        const verifyMock = jest.fn(() => true);
        const jwtSecretMock = "abc#*";
        const decodedJsonWebToken = {
            minimumUserData: {
                _id: "1234",
                userName: "tester"
            }
        };
        const locals = {
            jsonWebToken: tokenMock,
            decodedJsonWebToken
        };
        const response = { locals };
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
        middleware(request, response, next);
        expect.assertions(3);
        expect(verifyMock).toBeCalledWith(tokenMock, jwtSecretMock);
        expect(locals.decodedJsonWebToken).toBeDefined();
        expect(next).toBeCalled();
    }));
    test("that response.locals.jsonWebTokenError is defined", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const verifyMock = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const tokenMock = "1234";
        const jwtSecretMock = "1234";
        const response = { locals: { jsonWebToken: tokenMock } };
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
        yield middleware(request, response, next);
        expect(next).toBeCalled();
        expect(response.locals.jsonWebTokenError).toEqual(new Error(ERROR_MESSAGE));
    }));
    test("next should be called on failure", () => {
        const verifyMock = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const jwtSecretMock = "1234";
        const response = {};
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getDecodeJsonWebTokenMiddleware(verifyMock, jwtSecretMock);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `jsonWebToken` of 'undefined' or 'null'."));
    });
});
describe(`jsonWebTokenErrorResponseMiddleware`, () => {
    const errorMessage = "Failure";
    const errorStatusCode = 401;
    test("should send jsonWebToken error if it is defined in response.locals", () => {
        const jsonWebTokenError = {
            auth: false,
            name: "TokenExpiredError",
            message: "jwt expired",
            expiredAt: "2019-01-16T06:15:39.000Z"
        };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response = { locals: { jsonWebTokenError }, status };
        const request = {};
        const next = jest.fn();
        const jsonWebTokenErrorResponse = {
            message: errorMessage,
            auth: false
        };
        const middleware = verifyJsonWebTokenMiddlewares_1.getJsonWebTokenErrorResponseMiddleware(errorMessage, errorStatusCode);
        middleware(request, response, next);
        expect.assertions(4);
        expect(response.locals.jsonWebTokenError).toBeDefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(errorStatusCode);
        expect(send).toBeCalledWith(jsonWebTokenErrorResponse);
    });
    test("should call next with no paramaters when jsonWebTokenError is not defined.", () => {
        const response = { locals: {} };
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getJsonWebTokenErrorResponseMiddleware(errorMessage, errorStatusCode);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalled();
    });
    test("should call next with an error on failure", () => {
        const request = {};
        const response = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewares_1.getJsonWebTokenErrorResponseMiddleware(errorMessage, errorStatusCode);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `jsonWebTokenError` of 'undefined' or 'null'."));
    });
});
describe(`verifyJsonWebTokenMiddlewares`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
        expect.assertions(6);
        expect(verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares.length).toEqual(5);
        expect(verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares[0]).toBe(verifyJsonWebTokenMiddlewares_1.retreiveJsonWebTokenMiddleware);
        expect(verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares[1]).toBe(verifyJsonWebTokenMiddlewares_1.jsonWebTokenDoesNotExistResponseMiddleware);
        expect(verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares[2]).toBe(verifyJsonWebTokenMiddlewares_1.decodeJsonWebTokenMiddleware);
        expect(verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares[3]).toBe(verifyJsonWebTokenMiddlewares_1.jsonWebTokenErrorResponseMiddleware);
        expect(verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares[4]).toBe(verifyJsonWebTokenMiddlewares_1.setMinimumUserDataOnResponseLocals);
    });
});
//# sourceMappingURL=verifyJsonWebTokenMiddlewares.spec.js.map