"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const verifyJsonWebTokenMiddlewaresWithResponse_1 = require("./verifyJsonWebTokenMiddlewaresWithResponse");
const verifyJsonWebTokenMiddlewares_1 = require("./verifyJsonWebTokenMiddlewares");
const verifyJsonWebTokenMiddlewaresWithResponse_2 = require("./verifyJsonWebTokenMiddlewaresWithResponse");
const verifyJsonWebTokenMiddlewaresWithResponse_3 = require("./verifyJsonWebTokenMiddlewaresWithResponse");
describe(`jsonWebTokenVerificationSuccessfulMiddleware`, () => {
    const ERROR_MESSAGE = "error";
    const loginSuccessMessage = "success";
    test("should send login success message", () => {
        const send = jest.fn();
        const mockToken = {
            minimumUserData: {
                _id: "1234",
                userName: "mock username"
            }
        };
        const verifyJsonWebTokenLocals = {
            decodedJsonWebToken: mockToken
        };
        const response = { locals: verifyJsonWebTokenLocals, send };
        const request = {};
        const next = jest.fn();
        const successfulResponse = {
            auth: true, message: loginSuccessMessage, decodedJsonWebToken: mockToken
        };
        const middleware = verifyJsonWebTokenMiddlewaresWithResponse_3.getJsonWebTokenVerificationSuccessfulMiddleware(loginSuccessMessage);
        middleware(request, response, next);
        expect.assertions(2);
        expect(next).not.toBeCalled();
        expect(send).toBeCalledWith(successfulResponse);
    });
    test("should call next with an error on failure", () => {
        const mockToken = "1234";
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const response = { send, locals: { jsonWebToken: mockToken } };
        const request = {};
        const next = jest.fn();
        const middleware = verifyJsonWebTokenMiddlewaresWithResponse_3.getJsonWebTokenVerificationSuccessfulMiddleware(loginSuccessMessage);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
    });
});
describe(`verifyJsonWebTokenMiddlewaresWithResponse`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
        expect.assertions(2);
        expect(verifyJsonWebTokenMiddlewaresWithResponse_1.verifyJsonWebTokenMiddlewaresWithResponse[0]).toBe(verifyJsonWebTokenMiddlewares_1.verifyJsonWebTokenMiddlewares);
        expect(verifyJsonWebTokenMiddlewaresWithResponse_1.verifyJsonWebTokenMiddlewaresWithResponse[1]).toBe(verifyJsonWebTokenMiddlewaresWithResponse_2.jsonWebTokenVerificationSuccessfulMiddleware);
    });
});
//# sourceMappingURL=verifyJsonWebTokenMiddlewaresWithResponse.spec.js.map