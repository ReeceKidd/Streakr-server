"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSendFormattedUserMiddleware_1 = require("../../../../src/Middleware/User/getSendFormattedUserMiddleware");
const middlewareName = "getSendFormattedUserMiddleware";
const ERROR_MESSAGE = "error";
describe(`${middlewareName}`, () => {
    it("should should send user in response with password undefined", () => {
        const mockUserName = 'abc';
        const mockEmail = 'email@gmail.com';
        const mockPassword = '12345678';
        const savedUser = { userName: mockUserName, email: mockEmail, password: mockPassword };
        const send = jest.fn();
        const response = { locals: { savedUser }, send };
        const request = {};
        const next = jest.fn();
        getSendFormattedUserMiddleware_1.getSendFormattedUserMiddleware(request, response, next);
        expect.assertions(3);
        expect(response.locals.savedUser.password).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(send).toBeCalledWith({ userName: mockUserName, email: mockEmail });
    });
    it("should call next with an error on failure", () => {
        const mockUserName = 'abc';
        const mockEmail = 'email@gmail.com';
        const mockPassword = '12345678';
        const savedUser = { userName: mockUserName, email: mockEmail, password: mockPassword };
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const response = { locals: { savedUser }, send };
        const request = {};
        const next = jest.fn();
        getSendFormattedUserMiddleware_1.getSendFormattedUserMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
    });
});
//# sourceMappingURL=getSendFormattedUserMiddleware.test.js.map