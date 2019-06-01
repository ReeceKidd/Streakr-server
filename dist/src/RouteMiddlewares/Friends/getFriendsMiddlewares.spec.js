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
const getFriendsMiddlewares_1 = require("./getFriendsMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
describe(`getFriendsValidationMiddleware`, () => {
    test("check that valid request passes", () => {
        expect.assertions(1);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            params: { userId: "1234" }
        };
        const response = {
            status
        };
        const next = jest.fn();
        getFriendsMiddlewares_1.getFriendsValidationMiddleware(request, response, next);
        expect(next).toBeCalledWith();
    });
    test("check that request with no params fails", () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            params: {}
        };
        const response = {
            status
        };
        const next = jest.fn();
        getFriendsMiddlewares_1.getFriendsValidationMiddleware(request, response, next);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("check that userId cannot be a number", () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            params: { userId: 123 }
        };
        const response = {
            status
        };
        const next = jest.fn();
        getFriendsMiddlewares_1.getFriendsValidationMiddleware(request, response, next);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userId" fails because ["userId" must be a string]'
        });
        expect(next).not.toBeCalled();
    });
});
describe(`retreiveUserMiddleware`, () => {
    const mockUserId = "abcdefghij123";
    const ERROR_MESSAGE = "error";
    test("should define response.locals.user when user is found", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        };
        const request = {
            params: {
                userId: mockUserId
            }
        };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getFriendsMiddlewares_1.getRetreiveUserMiddleware(UserModel);
        yield middleware(request, response, next);
        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(true);
        expect(next).toBeCalledWith();
    }));
    test("should send error response when user doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const findOne = jest.fn(() => Promise.resolve(undefined));
        const UserModel = {
            findOne
        };
        const nonExistantUserId = "xcv";
        const request = {
            params: {
                userId: nonExistantUserId
            }
        };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getFriendsMiddlewares_1.getRetreiveUserMiddleware(UserModel);
        yield middleware(request, response, next);
        expect(findOne).toBeCalledWith({ _id: nonExistantUserId });
        expect(response.locals.user).toBe(undefined);
        expect(next).toBeCalledWith();
    }));
    test("should call next() with err paramater if database call fails", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        };
        const request = {
            params: {
                userId: mockUserId
            }
        };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = getFriendsMiddlewares_1.getRetreiveUserMiddleware(UserModel);
        yield middleware(request, response, next);
        expect(findOne).toBeCalledWith({ _id: mockUserId });
        expect(response.locals.user).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe(`userExistsValidationMiddleware`, () => {
    const mockErrorMessage = "User does not exist";
    test("check that error response is returned correctly when user wasn't found", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            locals: {},
            status
        };
        const next = jest.fn();
        const middleware = getFriendsMiddlewares_1.getUserExistsValidationMiddleware(mockErrorMessage);
        middleware(request, response, next);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.badRequest);
        expect(send).toBeCalledWith({ message: mockErrorMessage });
    }));
    test("check that next is called when user is defined on response.locals", () => {
        expect.assertions(3);
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            locals: { user: true },
            status
        };
        const next = jest.fn();
        const middleware = getFriendsMiddlewares_1.getUserExistsValidationMiddleware(mockErrorMessage);
        middleware(request, response, next);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(next).toBeCalledWith();
    });
    test("check that next is called with err on send failure", () => {
        expect.assertions(1);
        const errorMessage = "error";
        const send = jest.fn(() => { throw new Error(errorMessage); });
        const status = jest.fn(() => ({ send }));
        const request = {};
        const response = {
            locals: { user: false },
            status
        };
        const next = jest.fn();
        const middleware = getFriendsMiddlewares_1.getUserExistsValidationMiddleware(mockErrorMessage);
        middleware(request, response, next);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});
describe("getRetreiveFriendsMiddleware", () => {
    test("check that friends are retreived correctly", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(3);
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        };
        const request = {};
        const response = { locals: { user: { friends: ["123", "124", "125"] } } };
        const next = jest.fn();
        const middleware = getFriendsMiddlewares_1.getRetreiveFriendsMiddleware(UserModel);
        yield middleware(request, response, next);
        expect(findOne).toBeCalledTimes(3);
        expect(response.locals.friends).toEqual([true, true, true]);
        expect(next).toBeCalledWith();
    }));
    test("checks that next is called with error if database call fails", () => __awaiter(this, void 0, void 0, function* () {
        expect.assertions(2);
        const ERROR_MESSAGE = "error";
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        };
        const request = {};
        const response = { locals: { user: { friends: ["123", "124", "125"] } } };
        const next = jest.fn();
        const middleware = getFriendsMiddlewares_1.getRetreiveFriendsMiddleware(UserModel);
        yield middleware(request, response, next);
        expect(response.locals.friends).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe(`formatFriendsMiddleware`, () => {
    test("checks that response.locals.formattedFriends contains a correctly formatted user", () => {
        expect.assertions(2);
        const mockFriend = {
            _id: "1234",
            userName: "test",
            email: "test@test.com",
            password: "12345678",
            role: "Admin",
            preferredLanguage: "English"
        };
        const request = {};
        const response = { locals: { friends: [mockFriend] } };
        const next = jest.fn();
        getFriendsMiddlewares_1.formatFriendsMiddleware(request, response, next);
        expect(response.locals.formattedFriends[0]).toEqual({
            userName: mockFriend.userName
        });
        expect(next).toBeCalledWith();
    });
    test("checks that errors are passed into the next middleware", () => {
        expect.assertions(2);
        const request = {};
        const response = { locals: {} };
        const next = jest.fn();
        getFriendsMiddlewares_1.formatFriendsMiddleware(request, response, next);
        expect(response.locals.formattedFriends).toBe(undefined);
        expect(next).toBeCalledWith(new TypeError(`Cannot read property 'map' of undefined`));
    });
});
describe("sendFormattedFriendsMiddleware", () => {
    test("should send formattedFriends in response", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const formattedFriends = ["friend"];
        const response = { locals: { formattedFriends }, status };
        const next = jest.fn();
        getFriendsMiddlewares_1.sendFormattedFriendsMiddleware(request, response, next);
        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.success);
        expect(send).toBeCalledWith({ friends: formattedFriends });
    });
    test("should call next with an error on failure", () => {
        const ERROR_MESSAGE = "sendFormattedFriendsMiddleware error";
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response = { locals: {}, status };
        const request = {};
        const next = jest.fn();
        getFriendsMiddlewares_1.sendFormattedFriendsMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
    });
});
describe(`getFriendsMiddlewares`, () => {
    test("that getFriendsMiddlewares are defined in the correct order", () => {
        expect.assertions(6);
        expect(getFriendsMiddlewares_1.getFriendsMiddlewares[0]).toBe(getFriendsMiddlewares_1.getFriendsValidationMiddleware);
        expect(getFriendsMiddlewares_1.getFriendsMiddlewares[1]).toBe(getFriendsMiddlewares_1.retreiveUserMiddleware);
        expect(getFriendsMiddlewares_1.getFriendsMiddlewares[2]).toBe(getFriendsMiddlewares_1.userExistsValidationMiddleware);
        expect(getFriendsMiddlewares_1.getFriendsMiddlewares[3]).toBe(getFriendsMiddlewares_1.retreiveFriendsMiddleware);
        expect(getFriendsMiddlewares_1.getFriendsMiddlewares[4]).toBe(getFriendsMiddlewares_1.formatFriendsMiddleware);
        expect(getFriendsMiddlewares_1.getFriendsMiddlewares[5]).toBe(getFriendsMiddlewares_1.sendFormattedFriendsMiddleware);
    });
});
//# sourceMappingURL=getFriendsMiddlewares.spec.js.map