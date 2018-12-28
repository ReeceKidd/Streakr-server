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
const getHashPasswordMiddleware_1 = require("../../../../src/Middleware/Password/getHashPasswordMiddleware");
const middlewareName = "getHashPasswordMiddleware";
const ERROR_MESSAGE = "error";
describe(`${middlewareName}`, () => {
    it("should set response.locals.hashedPassword", () => __awaiter(this, void 0, void 0, function* () {
        const mockedPassword = "password";
        const hashedPassword = "12$4354";
        const saltMock = 10;
        const hash = jest.fn(() => {
            return Promise.resolve(hashedPassword);
        });
        const middleware = getHashPasswordMiddleware_1.getHashPasswordMiddleware(hash, saltMock);
        const response = { locals: {} };
        const request = { body: { password: mockedPassword } };
        const next = jest.fn();
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(hash).toBeCalledWith(mockedPassword, saltMock);
        expect(response.locals.hashedPassword).toBe(hashedPassword);
        expect(next).toBeCalled();
    }));
    it("should call next() with err paramater if hash password call fails", () => __awaiter(this, void 0, void 0, function* () {
        const mockedPassword = "password";
        const hashedPassword = "12$4354";
        const saltMock = 10;
        const hash = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE);
        });
        const middleware = getHashPasswordMiddleware_1.getHashPasswordMiddleware(hash, saltMock);
        const response = { locals: {} };
        const request = { body: { password: mockedPassword } };
        const next = jest.fn();
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(hash).toBeCalledWith(mockedPassword, saltMock);
        expect(response.locals.hashedPassword).not.toBeDefined();
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
//# sourceMappingURL=getHashPasswordMiddleware.test.js.map