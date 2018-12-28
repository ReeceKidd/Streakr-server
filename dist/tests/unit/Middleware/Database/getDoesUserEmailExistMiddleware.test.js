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
const getDoesUserEmailExistMiddleware_1 = require("../../../../src/Middleware/Database/getDoesUserEmailExistMiddleware");
const middlewareName = "getDoesUserEmailExistMiddleware";
const mockEmail = "test@gmail.com";
const ERROR_MESSAGE = "error";
describe(`${middlewareName}`, () => {
    it("should set emailExists to true when user is found", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        };
        const request = { body: { email: mockEmail } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserEmailExistMiddleware_1.getDoesUserEmailExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExists).toBe(true);
        expect(next).toBeCalledWith();
    }));
    it("should set emailExists to false when user doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne
        };
        const request = { body: { email: mockEmail } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserEmailExistMiddleware_1.getDoesUserEmailExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExistsw).toBe(undefined);
        expect(next).toBeCalledWith();
    }));
    it("should call next() with err paramater if database call fails", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        };
        const request = { body: { email: mockEmail } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserEmailExistMiddleware_1.getDoesUserEmailExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExists).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
//# sourceMappingURL=getDoesUserEmailExistMiddleware.test.js.map