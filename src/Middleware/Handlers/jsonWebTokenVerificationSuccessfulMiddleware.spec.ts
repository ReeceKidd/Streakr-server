import { getJsonWebTokenVerificationSuccessfulMiddleware, SuccessfulJsonWebTokenVerificationResponse } from "./jsonWebTokenVerificationSuccessfulMiddleware";
import { DecodedJsonWebToken } from "../Auth/decodeJsonWebTokenMiddleware";
import { VerifyJsonWebTokenResponseLocals } from "../Validation/Auth/jsonWebTokenVerificationRequestValidationMiddleware";

const ERROR_MESSAGE = "error";
const loginSuccessMessage = 'success'

describe(`jsonWebTokenVerificationSuccessfulMiddleware`, () => {
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

        const successfulResponse: SuccessfulJsonWebTokenVerificationResponse = {
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