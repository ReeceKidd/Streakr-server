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
const getSaveUserToDatabaseMiddleware_1 = require("../../../../src/Middleware/Database/getSaveUserToDatabaseMiddleware");
const middlewareName = "getSaveUserToDatabaseMiddleware ";
const ERROR_MESSAGE = "error";
describe(`${middlewareName}`, () => {
    it("should send response with saved user", () => __awaiter(this, void 0, void 0, function* () {
        const save = jest.fn(() => {
            return Promise.resolve(mockUser);
        });
        const mockUser = {
            userName: 'User',
            email: 'user@gmail.com',
            password: 'password',
            save
        };
        const response = { locals: { newUser: mockUser } };
        const request = {};
        const next = jest.fn();
        yield getSaveUserToDatabaseMiddleware_1.getSaveUserToDatabaseMiddleware(request, response, next);
        expect.assertions(3);
        expect(save).toBeCalled();
        expect(response.locals.savedUser).toBeDefined();
        expect(next).toBeCalled();
    }));
    it("should call next() with err paramater if save call fails", () => __awaiter(this, void 0, void 0, function* () {
        const save = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE);
        });
        const request = {};
        const response = { locals: { newUser: { save } } };
        const next = jest.fn();
        yield getSaveUserToDatabaseMiddleware_1.getSaveUserToDatabaseMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
//# sourceMappingURL=getSaveUserToDatabaseMiddleware.test.js.map