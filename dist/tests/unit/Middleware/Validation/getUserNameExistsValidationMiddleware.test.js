"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getUserNameExistsValidationMiddleware_1 = require("../../../../src/Middleware/Validation/getUserNameExistsValidationMiddleware");
const middlewareName = "getUserNameExistsValidationMiddleware";
const mockUserName = "testName";
const userNameKey = 'userName';
describe(`${middlewareName}`, () => {
    it("check that error response is returned correctly when userName already exists", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { userName: mockUserName }
        };
        const response = {
            locals: { userNameExists: true },
            status
        };
        const next = jest.fn();
        const middleware = getUserNameExistsValidationMiddleware_1.getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, userNameKey);
        middleware(request, response, next);
        expect.assertions(4);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalled();
        expect(generateAlreadyExistsMessage).toBeCalledWith(userNameKey, mockUserName);
        expect(next).not.toBeCalled();
    });
    it("check that next is called when userName doesn't exist", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { userName: mockUserName }
        };
        const response = {
            locals: { userNameExists: false },
            status
        };
        const next = jest.fn();
        const middleware = getUserNameExistsValidationMiddleware_1.getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, userNameKey);
        middleware(request, response, next);
        expect.assertions(4);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(generateAlreadyExistsMessage).not.toBeCalled();
        expect(next).toBeCalled();
    });
    it("check that when error is thrown next is called with err", () => {
        const errorMessage = 'error';
        const send = jest.fn(() => { throw new Error(errorMessage); });
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { userName: mockUserName }
        };
        const response = {
            locals: { userNameExists: true },
            status
        };
        const next = jest.fn();
        const middleware = getUserNameExistsValidationMiddleware_1.getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, userNameKey);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});
//# sourceMappingURL=getUserNameExistsValidationMiddleware.test.js.map