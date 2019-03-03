import { jsonWebTokenVerificationRequestValidationMiddleware } from './jsonWebTokenVerificationRequestValidationMiddleware'

describe(`jsonWebTokenVerificationRequestValidationMiddleware`, () => {

    test("check that valid request passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: {}
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        jsonWebTokenVerificationRequestValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled();
    });

    test("check that not allowed body parameter is caught", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const notAllowed = '123'

        const request: any = {
            body: { notAllowed }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        jsonWebTokenVerificationRequestValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({ "message": "\"notAllowed\" is not allowed" });
        expect(next).not.toBeCalled();
    });


});
