import { verifyJsonWebTokenMiddlewaresWithResponse } from './verifyJsonWebTokenMiddlewaresWithResponse'
import { verifyJsonWebTokenMiddlewares } from './verifyJsonWebTokenMiddlewares';
import { jsonWebTokenVerificationSuccessfulMiddleware } from './verifyJsonWebTokenMiddlewaresWithResponse';

import { getJsonWebTokenVerificationSuccessfulMiddleware } from "./verifyJsonWebTokenMiddlewaresWithResponse";
import { DecodedJsonWebToken, VerifyJsonWebTokenResponseLocals } from './verifyJsonWebTokenMiddlewares'

describe(`jsonWebTokenVerificationSuccessfulMiddleware`, () => {

    const ERROR_MESSAGE = "error";
    const loginSuccessMessage = 'success'

    test("should send login success message", () => {

        const send = jest.fn()
        const mockToken: DecodedJsonWebToken = {
            minimumUserData: {
                _id: '1234',
                userName: 'mock username'
            }
        }
        const verifyJsonWebTokenLocals: VerifyJsonWebTokenResponseLocals = {
            decodedJsonWebToken: mockToken
        }
        const response: any = { locals: verifyJsonWebTokenLocals, send };

        const request: any = {}
        const next = jest.fn();

        const successfulResponse = {
            auth: true, message: loginSuccessMessage, decodedJsonWebToken: mockToken
        }


        const middleware = getJsonWebTokenVerificationSuccessfulMiddleware(loginSuccessMessage);
        middleware(request, response, next)

        expect.assertions(2);
        expect(next).not.toBeCalled()
        expect(send).toBeCalledWith(successfulResponse)
    });

    test("should call next with an error on failure", () => {

        const mockToken = '1234'
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const response: any = { send, locals: { jsonWebToken: mockToken } };

        const request: any = {}
        const next = jest.fn();

        const middleware = getJsonWebTokenVerificationSuccessfulMiddleware(loginSuccessMessage);
        middleware(request, response, next)

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
    })


});

describe(`verifyJsonWebTokenMiddlewaresWithResponse`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
        expect.assertions(2);
        expect(verifyJsonWebTokenMiddlewaresWithResponse[0]).toBe(verifyJsonWebTokenMiddlewares)
        expect(verifyJsonWebTokenMiddlewaresWithResponse[1]).toBe(jsonWebTokenVerificationSuccessfulMiddleware)
    });
});