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
const getDoesUserNameExistMiddleware_1 = require("../../../../src/Middleware/Database/getDoesUserNameExistMiddleware");
const middlewareName = "getDoesUserNameExistMiddleware";
const mockUserName = "testname";
const ERROR_MESSAGE = "error";
describe(`${middlewareName}`, () => {
    it("should set userNameExists to true when userExists", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        };
        const request = { body: { userName: mockUserName } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserNameExistMiddleware_1.getDoesUserNameExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(true);
        expect(next).toBeCalledWith();
    }));
    it("should set userNameExists to false when user doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne
        };
        const request = { body: { userName: mockUserName } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserNameExistMiddleware_1.getDoesUserNameExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(undefined);
        expect(next).toBeCalledWith();
    }));
    it("should call next() with err paramater if database call fails", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        };
        const request = { body: { userName: mockUserName } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getDoesUserNameExistMiddleware_1.getDoesUserNameExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
//# sourceMappingURL=getDoesUserNameExistMiddleware.test.js.map