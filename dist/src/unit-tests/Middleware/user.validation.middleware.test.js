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
const user_validation_middleware_1 = require("../../../src/Middleware/user.validation.middleware");
const userDatabaseHelper_1 = require("../../../src/DatabaseHelpers/userDatabaseHelper");
const className = 'UserMiddleware';
const classMethods = {
    injectDependencies: 'injectDependencies',
    doesEmailExist: 'doesEmailExist',
    doesUserNameExist: 'doesUserNameExist',
    emailExistsValidation: 'emailExistsValidation',
    userNameExistsValidation: 'userNameExistsValidation'
};
const mockEmail = 'mockedemail@gmail.com';
const mockUserName = 'mock-username';
describe(`${className} - ${classMethods.injectDependencies}`, () => {
    it("should update response.body to contain the validation functions for dependency injection", () => __awaiter(this, void 0, void 0, function* () {
        const response = { locals: {} };
        const middleware = user_validation_middleware_1.UserValidationMiddleware.injectDependencies;
        middleware(null, response, err => {
            expect.assertions(2);
            expect(response.locals.doesUserEmailExist).toBe(userDatabaseHelper_1.UserDatabaseHelper.doesUserEmailExist);
            expect(response.locals.doesUserNameExist).toBe(userDatabaseHelper_1.UserDatabaseHelper.doesUserNameExist);
        });
    }));
});
describe(`${className} - ${classMethods.doesEmailExist}`, () => {
    it("should set response.locals.emailExists to true when email exists", () => __awaiter(this, void 0, void 0, function* () {
        const mockedDoesUserEmailExistsDatabaseCall = jest.fn(() => Promise.resolve(true));
        const request = { body: { email: mockEmail } };
        const response = { locals: { doesUserEmailExist: mockedDoesUserEmailExistsDatabaseCall } };
        const middleware = yield user_validation_middleware_1.UserValidationMiddleware.doesEmailExist;
        middleware(request, response, err => {
            expect.assertions(2);
            expect(mockedDoesUserEmailExistsDatabaseCall).toBeCalledWith(mockEmail);
            expect(response.locals.emailExists).toBe(true);
        });
    }));
    it("should set response.locals.emailExists to false when email does not exist", () => __awaiter(this, void 0, void 0, function* () {
        const mockedDoesEmailExistsDatabaseCall = jest.fn(() => Promise.resolve(false));
        const request = { body: { email: mockEmail } };
        const response = { locals: { doesUserEmailExist: mockedDoesEmailExistsDatabaseCall } };
        const middleware = yield user_validation_middleware_1.UserValidationMiddleware.doesEmailExist;
        middleware(request, response, err => {
            expect.assertions(2);
            expect(mockedDoesEmailExistsDatabaseCall).toBeCalledWith(mockEmail);
            expect(response.locals.emailExists).toBe(false);
        });
    }));
});
describe(`${className} - ${classMethods.doesUserNameExist}`, () => {
    it("should set response.locals.userNameExists to true when userName exists", () => __awaiter(this, void 0, void 0, function* () {
        const mockedDoesUserNameExistsDatabaseCall = jest.fn(() => Promise.resolve(true));
        const request = { body: { userName: mockUserName } };
        const response = { locals: { doesUserNameExist: mockedDoesUserNameExistsDatabaseCall } };
        const middleware = yield user_validation_middleware_1.UserValidationMiddleware.doesUserNameExist;
        middleware(request, response, err => {
            expect.assertions(2);
            expect(mockedDoesUserNameExistsDatabaseCall).toBeCalledWith(mockUserName);
            expect(response.locals.userNameExists).toBe(true);
        });
    }));
    it("should set response.locals.userNameExists to false when userName does not exist", () => __awaiter(this, void 0, void 0, function* () {
        const mockedDoesUserNameExistsDatabaseCall = jest.fn(() => Promise.resolve(false));
        const response = { locals: { doesUserNameExist: mockedDoesUserNameExistsDatabaseCall } };
        const request = { body: { userName: mockUserName } };
        const middleware = yield user_validation_middleware_1.UserValidationMiddleware.doesUserNameExist;
        middleware(request, response, err => {
            expect.assertions(2);
            expect(mockedDoesUserNameExistsDatabaseCall).toBeCalledWith(mockUserName);
            expect(response.locals.userNameExists).toBe(false);
        });
    }));
});
//# sourceMappingURL=user.validation.middleware.test.js.map