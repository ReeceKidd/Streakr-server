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
const getUsersMiddlewares_1 = require("./getUsersMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
describe(`getUsersValidationMiddleware`, () => {
    const mockSearchQuery = "searchQuery";
    test("check that valid request passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: { searchQuery: mockSearchQuery }
        };
        const response = {
            status
        };
        const next = jest.fn();
        getUsersMiddlewares_1.retreiveUsersValidationMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith();
    });
    test("check that correct response is sent when searchQuery is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            query: {}
        };
        const response = {
            status
        };
        const next = jest.fn();
        getUsersMiddlewares_1.retreiveUsersValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("check that correct response is sent when searchQuery length is too short", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const shortSearchQuery = "";
        const request = {
            query: { searchQuery: shortSearchQuery }
        };
        const response = {
            status
        };
        const next = jest.fn();
        getUsersMiddlewares_1.retreiveUsersValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.badRequest);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" is not allowed to be empty]'
        });
        expect(next).not.toBeCalled();
    });
    test(`check that correct response is sent when searchQuery length is longer than ${getUsersMiddlewares_1.maximumSearchQueryLength}`, () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const longSearchQuery = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
        const request = {
            query: { searchQuery: longSearchQuery }
        };
        const response = {
            status
        };
        const next = jest.fn();
        getUsersMiddlewares_1.retreiveUsersValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" length must be less than or equal to 64 characters long]'
        });
        expect(next).not.toBeCalled();
    });
    test(`check that correct response is sent when searchQuery is not a string`, () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const numberSearchQuery = 123;
        const request = {
            query: { searchQuery: numberSearchQuery }
        };
        const response = {
            status
        };
        const next = jest.fn();
        getUsersMiddlewares_1.retreiveUsersValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "searchQuery" fails because ["searchQuery" must be a string]'
        });
        expect(next).not.toBeCalled();
    });
});
describe("setSearchQueryToLowerCaseMiddleware", () => {
    const mockSearchQuery = "Search";
    const mockLowerCaseSearchQuery = "search";
    test("it should set userName to lowercase version of itself", () => {
        const request = { query: { searchQuery: mockSearchQuery } };
        const response = { locals: {} };
        const next = jest.fn();
        getUsersMiddlewares_1.setSearchQueryToLowercaseMiddleware(request, response, next);
        expect.assertions(2);
        expect(response.locals.lowerCaseSearchQuery).toBe(mockLowerCaseSearchQuery);
        expect(next).toBeCalledWith();
    });
    test("it should call next with err on failure", () => {
        const request = { query: { searchQuery: { toLowerCase: () => { throw new Error(); } } } };
        const response = {};
        const next = jest.fn();
        getUsersMiddlewares_1.setSearchQueryToLowercaseMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error());
    });
});
describe("getUsersByUsernameRegexSearchMiddleware", () => {
    test("that response.locals.users is populated and next is called", () => __awaiter(this, void 0, void 0, function* () {
        const mockSearchQuery = "searchQuery";
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const find = jest.fn(() => Promise.resolve(true));
        const userModel = { find };
        const request = {};
        const response = {
            status, locals: { lowerCaseSearchQuery: mockSearchQuery }
        };
        const next = jest.fn();
        const middleware = getUsersMiddlewares_1.getRetreiveUsersByUsernameRegexSearchMiddleware(userModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(find).toBeCalledWith({ userName: { $regex: mockSearchQuery } });
        expect(response.locals.users).toBeDefined();
        expect(next).toBeCalledWith();
    }));
    test("that next is called with err on failure", () => __awaiter(this, void 0, void 0, function* () {
        const errorMessage = "error";
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const find = jest.fn(() => Promise.reject(errorMessage));
        const userModel = { find };
        const request = {};
        const response = {
            status, locals: {}
        };
        const next = jest.fn();
        const middleware = getUsersMiddlewares_1.getRetreiveUsersByUsernameRegexSearchMiddleware(userModel);
        yield middleware(request, response, next);
        expect.assertions(2);
        expect(response.locals.users).not.toBeDefined();
        expect(next).toBeCalledWith(errorMessage);
    }));
});
describe("formatUsersMiddleware", () => {
    test("checks that response.locals.formattedUsers contains a correctly formatted user", () => {
        expect.assertions(2);
        const mockUser = {
            toObject: jest.fn(() => {
                return {
                    _id: "1234",
                    userName: "test",
                    email: "test@test.com",
                    password: "12345678",
                    role: "Admin",
                    preferredLanguage: "English"
                };
            })
        };
        const request = {};
        const response = { locals: { users: [mockUser] } };
        const next = jest.fn();
        getUsersMiddlewares_1.formatUsersMiddleware(request, response, next);
        const formattedUser = Object.assign({}, mockUser.toObject(), { password: undefined });
        expect(response.locals.formattedUsers[0]).toEqual(Object.assign({}, formattedUser));
        expect(next).toBeCalledWith();
    });
    test("checks that errors are passed into the next middleware", () => {
        expect.assertions(2);
        const request = {};
        const response = { locals: {} };
        const next = jest.fn();
        getUsersMiddlewares_1.formatUsersMiddleware(request, response, next);
        expect(response.locals.formattedUsers).toBe(undefined);
        expect(next).toBeCalledWith(new TypeError(`Cannot read property 'map' of undefined`));
    });
});
describe("sendUsersMiddleware", () => {
    test("should send formattedUsers in response", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {};
        const formattedUsers = ["user"];
        const response = { locals: { formattedUsers }, status };
        const next = jest.fn();
        getUsersMiddlewares_1.sendFormattedUsersMiddleware(request, response, next);
        send;
        expect.assertions(3);
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.success);
        expect(send).toBeCalledWith({ users: formattedUsers });
    });
    test("should call next with an error on failure", () => {
        const ERROR_MESSAGE = "sendFormattedUsersMiddleware error";
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response = { locals: {}, status };
        const request = {};
        const next = jest.fn();
        getUsersMiddlewares_1.sendFormattedUsersMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
    });
});
describe(`getUsersMiddlewares`, () => {
    test("that getUsersMiddlewares are defined in the correct order", () => {
        expect.assertions(5);
        expect(getUsersMiddlewares_1.getUsersMiddlewares[0]).toBe(getUsersMiddlewares_1.retreiveUsersValidationMiddleware);
        expect(getUsersMiddlewares_1.getUsersMiddlewares[1]).toBe(getUsersMiddlewares_1.setSearchQueryToLowercaseMiddleware);
        expect(getUsersMiddlewares_1.getUsersMiddlewares[2]).toBe(getUsersMiddlewares_1.retreiveUsersByUsernameRegexSearchMiddleware);
        expect(getUsersMiddlewares_1.getUsersMiddlewares[3]).toBe(getUsersMiddlewares_1.formatUsersMiddleware);
        expect(getUsersMiddlewares_1.getUsersMiddlewares[4]).toBe(getUsersMiddlewares_1.sendFormattedUsersMiddleware);
    });
});
//# sourceMappingURL=getUsersMiddlewares.spec.js.map