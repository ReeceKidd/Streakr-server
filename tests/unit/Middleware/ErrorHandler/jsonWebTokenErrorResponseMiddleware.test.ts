import { jsonWebTokenErrorResponseMiddleware } from "../../../../src/Middleware/ErrorHandler/jsonWebTokenErrorResponseMiddleware";

describe(`jsonWebTokenErrorResponseMiddleware`, () => {
    test("should send jsonWebToken error if it is defined in response.locals", () => {

        const jsonWebTokenError = {
            name: "TokenExpiredError",
            message: "jwt expired",
            expiredAt: "2019-01-16T06:15:39.000Z"
        }
        const send = jest.fn()
        const response: any = { locals: { jsonWebTokenError }, send };

        const request: any = {}
        const next = jest.fn();

        jsonWebTokenErrorResponseMiddleware(request, response, next);

        expect.assertions(3);
        expect(response.locals.jsonWebTokenError).toBeDefined()
        expect(next).not.toBeCalled()
        expect(send).toBeCalledWith(jsonWebTokenError)
    });

    test("should call next wehn jsonWebTokenError is not defined.", () => {
        const response: any = { locals: {} };
        const request: any = {}
        const next = jest.fn();

        jsonWebTokenErrorResponseMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled()
    })


    test("should call next with an error on failure", () => {

        const request: any = {}
        const response: any = {}
        const next = jest.fn();

        jsonWebTokenErrorResponseMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("Cannot destructure property `jsonWebTokenError` of 'undefined' or 'null'."))
    })


});