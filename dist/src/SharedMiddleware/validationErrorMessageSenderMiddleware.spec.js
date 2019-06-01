"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validationErrorMessageSenderMiddleware_1 = require("./validationErrorMessageSenderMiddleware");
const responseCodes_1 = require("../Server/responseCodes");
describe(`validationErrorMessageSenderMiddleware`, () => {
    test("calls 'next' middleware if all params are correct ", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: { param: true }
        };
        const response = {
            status
        };
        const next = jest.fn();
        const middleware = validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next);
        middleware(undefined);
        expect.assertions(3);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(next).toBeCalled();
    });
    test("check that notAllowedParameter error is thrown when error message returns is not allowed", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: { param: true }
        };
        const response = {
            status
        };
        const next = jest.fn();
        const middleware = validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next);
        const paramNotAllowedError = '"param" is not allowed';
        middleware(new Error(paramNotAllowedError));
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.badRequest);
        expect(send).toBeCalledWith({ message: paramNotAllowedError });
        expect(next).not.toBeCalled();
    });
    test(`returns ${responseCodes_1.ResponseCodes.unprocessableEntity} if value of one of the parameters is missing`, () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: { param: true }
        };
        const response = {
            status
        };
        const next = jest.fn();
        const middleware = validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(request, response, next);
        const otherError = "other error";
        middleware(new Error("other error"));
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({ message: otherError });
        expect(next).not.toBeCalled();
    });
});
//# sourceMappingURL=validationErrorMessageSenderMiddleware.spec.js.map