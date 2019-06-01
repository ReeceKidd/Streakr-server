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
const registerUserMiddlewares_1 = require("./registerUserMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
describe(`userRegistrationValidationMiddlware`, () => {
    const mockUserName = "mockUserName";
    const mockEmail = "mock@gmail.com";
    const mockPassword = "12345678";
    test("check that valid request passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userName: mockUserName, email: mockEmail, password: mockPassword }
        };
        const response = {
            status
        };
        const next = jest.fn();
        registerUserMiddlewares_1.userRegistrationValidationMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalled();
    });
    test("check that correct response is sent when userName is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { email: mockEmail, password: mockPassword }
        };
        const response = {
            status
        };
        const next = jest.fn();
        registerUserMiddlewares_1.userRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "userName" fails because ["userName" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("check that correct response is sent when email is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userName: mockUserName, password: mockPassword }
        };
        const response = {
            status
        };
        const next = jest.fn();
        registerUserMiddlewares_1.userRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "email" fails because ["email" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("check that correct response is sent when email is incorrect", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const incorrectEmail = "1234";
        const request = {
            body: {
                userName: mockUserName,
                email: incorrectEmail,
                password: mockPassword
            }
        };
        const response = {
            status
        };
        const next = jest.fn();
        registerUserMiddlewares_1.userRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "email" fails because ["email" must be a valid email]'
        });
        expect(next).not.toBeCalled();
    });
    test("check that correct response is sent when password is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const request = {
            body: { userName: mockUserName, email: mockEmail }
        };
        const response = {
            status
        };
        const next = jest.fn();
        registerUserMiddlewares_1.userRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "password" fails because ["password" is required]'
        });
        expect(next).not.toBeCalled();
    });
    test("check that correct response is sent when password is too short", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const incorrectPassword = "123";
        const request = {
            body: {
                userName: mockUserName,
                email: mockEmail,
                password: incorrectPassword
            }
        };
        const response = {
            status
        };
        const next = jest.fn();
        registerUserMiddlewares_1.userRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.unprocessableEntity);
        expect(send).toBeCalledWith({
            message: 'child "password" fails because ["password" length must be at least 6 characters long]'
        });
        expect(next).not.toBeCalled();
    });
    test("check that not allowed parameter is caught", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const notAllowed = "123";
        const request = {
            body: {
                notAllowed,
                userName: mockUserName,
                email: mockEmail,
                password: mockPassword
            }
        };
        const response = {
            status
        };
        const next = jest.fn();
        registerUserMiddlewares_1.userRegistrationValidationMiddleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.badRequest);
        expect(send).toBeCalledWith({ message: '"notAllowed" is not allowed' });
        expect(next).not.toBeCalled();
    });
});
describe(`doesUserEmailExistMiddleware`, () => {
    const mockEmail = "test@gmail.com";
    const ERROR_MESSAGE = "error";
    test("should set emailExists to true when user is found", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        };
        const request = { body: { email: mockEmail } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getDoesUserEmailExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExists).toBe(true);
        expect(next).toBeCalledWith();
    }));
    test("should set emailExists to false when user doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne
        };
        const request = { body: { email: mockEmail } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getDoesUserEmailExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExistsw).toBe(undefined);
        expect(next).toBeCalledWith();
    }));
    test("should call next() with err paramater if database call fails", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        };
        const request = { body: { email: mockEmail } };
        const response = { locals: {} };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getDoesUserEmailExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExists).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe(`emailExistsValidationMiddleware `, () => {
    const mockEmail = "test@gmail.com";
    const emailKey = "email";
    const subject = "subject";
    test("check that error response is returned correctly when email already exists", () => __awaiter(this, void 0, void 0, function* () {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { email: mockEmail }
        };
        const response = {
            locals: { emailExists: true },
            status
        };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, subject, emailKey);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.badRequest);
        expect(send).toBeCalled();
        expect(generateAlreadyExistsMessage).toBeCalledWith(subject, emailKey, mockEmail);
    }));
    test("check that next is called when email doesn't exist", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { email: mockEmail }
        };
        const response = {
            locals: { emailExists: false },
            status
        };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, subject, emailKey);
        middleware(request, response, next);
        expect.assertions(4);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(generateAlreadyExistsMessage).not.toBeCalled();
        expect(next).toBeCalled();
    });
    test("check that when error is thrown next is called with err", () => {
        const errorMessage = "error";
        const send = jest.fn(() => { throw new Error(errorMessage); });
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { email: mockEmail }
        };
        const response = {
            locals: { emailExists: true },
            status
        };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, subject, emailKey);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});
describe("setUserNameToLowercaseMiddleware", () => {
    const mockUsername = "Testname";
    const mockLowerCaseUsername = "testname";
    test("it should set userName to lowercase version of itself", () => {
        const request = { body: { userName: mockUsername } };
        const response = { locals: {} };
        const next = jest.fn();
        registerUserMiddlewares_1.setUserNameToLowercaseMiddleware(request, response, next);
        expect.assertions(2);
        expect(response.locals.lowerCaseUserName).toBe(mockLowerCaseUsername);
        expect(next).toBeCalledWith();
    });
    test("it should call next with err on failure", () => {
        const request = { body: { userName: { toLowerCase: () => { throw new Error(); } } } };
        const response = {};
        const next = jest.fn();
        registerUserMiddlewares_1.setUserNameToLowercaseMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error());
    });
});
describe(`doesUserNameExistMiddleware`, () => {
    const mockUserName = "testname";
    const ERROR_MESSAGE = "error";
    test("should set userNameExists to true when userExists", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        };
        const request = {};
        const response = { locals: { lowerCaseUserName: mockUserName } };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getDoesUserNameExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(true);
        expect(next).toBeCalledWith();
    }));
    test("should set userNameExists to false when user doesn't exist", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne
        };
        const request = {};
        const response = { locals: { lowerCaseUserName: mockUserName } };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getDoesUserNameExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(undefined);
        expect(next).toBeCalledWith();
    }));
    test("should call next() with err paramater if database call fails", () => __awaiter(this, void 0, void 0, function* () {
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        };
        const request = { body: {} };
        const response = { locals: { lowerCaseUserName: mockUserName } };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getDoesUserNameExistMiddleware(UserModel);
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe(`userNameExistsValidationMiddleware`, () => {
    const mockUserName = "testName";
    const userNameKey = "userName";
    const subject = "subject";
    test("check that error response is returned correctly when userName already exists", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {};
        const response = {
            locals: { userNameExists: true, lowerCaseUserName: mockUserName },
            status
        };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);
        middleware(request, response, next);
        expect.assertions(4);
        expect(status).toHaveBeenCalledWith(responseCodes_1.ResponseCodes.badRequest);
        expect(send).toBeCalled();
        expect(generateAlreadyExistsMessage).toBeCalledWith(subject, userNameKey, mockUserName);
        expect(next).not.toBeCalled();
    });
    test("check that next is called when userName doesn't exist", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {};
        const response = {
            locals: { userNameExists: false, lowerCaseUserName: mockUserName },
            status
        };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);
        middleware(request, response, next);
        expect.assertions(4);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(generateAlreadyExistsMessage).not.toBeCalled();
        expect(next).toBeCalled();
    });
    test("check that when error is thrown next is called with err", () => {
        const errorMessage = "error";
        const send = jest.fn(() => { throw new Error(errorMessage); });
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {};
        const response = {
            locals: { userNameExists: true, lowerCaseUserName: mockUserName },
            status
        };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});
describe(`hashPasswordMiddleware`, () => {
    const ERROR_MESSAGE = "error";
    test("should set response.locals.hashedPassword", () => __awaiter(this, void 0, void 0, function* () {
        const mockedPassword = "password";
        const hashedPassword = "12$4354";
        const saltMock = 10;
        const hash = jest.fn(() => {
            return Promise.resolve(hashedPassword);
        });
        const middleware = registerUserMiddlewares_1.getHashPasswordMiddleware(hash, saltMock);
        const response = { locals: {} };
        const request = { body: { password: mockedPassword } };
        const next = jest.fn();
        yield middleware(request, response, next);
        expect.assertions(3);
        expect(hash).toBeCalledWith(mockedPassword, saltMock);
        expect(response.locals.hashedPassword).toBe(hashedPassword);
        expect(next).toBeCalled();
    }));
    test("should call next() with err paramater if hash password call fails", () => __awaiter(this, void 0, void 0, function* () {
        const mockedPassword = "password";
        const hashedPassword = "12$4354";
        const saltMock = 10;
        const hash = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE);
        });
        const middleware = registerUserMiddlewares_1.getHashPasswordMiddleware(hash, saltMock);
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
describe(`createUserFromRequestMiddleware`, () => {
    test("should define response.locals.newUser", () => __awaiter(this, void 0, void 0, function* () {
        const hashedPassword = "12$4354";
        const userName = "user";
        const email = "user@gmail.com";
        class User {
            constructor({ userName, email, password }) {
                this.userName = userName;
                this.email = email;
                this.password = password;
            }
        }
        const response = { locals: { hashedPassword, lowerCaseUserName: userName } };
        const request = { body: { email } };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getCreateUserFromRequestMiddleware(User);
        yield middleware(request, response, next);
        expect.assertions(1);
        const newUser = new User({ userName, email, password: hashedPassword });
        expect(response.locals.newUser).toEqual(newUser);
    }));
    test("should call next with error message on error", () => {
        const user = { userName: "userName", email: "username@gmail.com" };
        const response = { locals: { user } };
        const request = { body: {} };
        const next = jest.fn();
        const middleware = registerUserMiddlewares_1.getCreateUserFromRequestMiddleware({});
        middleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("user is not a constructor"));
    });
});
describe(`saveUserToDatabaseMiddleware`, () => {
    const ERROR_MESSAGE = "error";
    test("should set response.locals.savedUser", () => __awaiter(this, void 0, void 0, function* () {
        const save = jest.fn(() => {
            return Promise.resolve(mockUser);
        });
        const mockUser = {
            userName: "User",
            email: "user@gmail.com",
            password: "password",
            save
        };
        const response = { locals: { newUser: mockUser } };
        const request = {};
        const next = jest.fn();
        yield registerUserMiddlewares_1.saveUserToDatabaseMiddleware(request, response, next);
        expect.assertions(3);
        expect(save).toBeCalled();
        expect(response.locals.savedUser).toBeDefined();
        expect(next).toBeCalled();
    }));
    test("should call next() with err paramater if save call fails", () => __awaiter(this, void 0, void 0, function* () {
        const save = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE);
        });
        const request = {};
        const response = { locals: { newUser: { save } } };
        const next = jest.fn();
        yield registerUserMiddlewares_1.saveUserToDatabaseMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe(`sendFormattedUserMiddleware`, () => {
    const ERROR_MESSAGE = "error";
    test("should send user in response with password undefined", () => {
        const mockUserName = "abc";
        const mockEmail = "email@gmail.com";
        const mockPassword = "12345678";
        const savedUser = { userName: mockUserName, email: mockEmail, password: mockPassword };
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const response = { locals: { savedUser }, status };
        const request = {};
        const next = jest.fn();
        registerUserMiddlewares_1.sendFormattedUserMiddleware(request, response, next);
        expect.assertions(4);
        expect(response.locals.savedUser.password).toBeUndefined();
        expect(next).not.toBeCalled();
        expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.created);
        expect(send).toBeCalledWith({ userName: mockUserName, email: mockEmail });
    });
    test("should call next with an error on failure", () => {
        const mockUserName = "abc";
        const mockEmail = "email@gmail.com";
        const mockPassword = "12345678";
        const savedUser = { userName: mockUserName, email: mockEmail, password: mockPassword };
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE);
        });
        const status = jest.fn(() => ({ send }));
        const response = { locals: { savedUser }, status };
        const request = {};
        const next = jest.fn();
        registerUserMiddlewares_1.sendFormattedUserMiddleware(request, response, next);
        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
    });
});
describe(`verifyJsonWebTokenMiddlewaresWithResponse`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
        expect.assertions(10);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[0]).toBe(registerUserMiddlewares_1.userRegistrationValidationMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[1]).toBe(registerUserMiddlewares_1.doesUserEmailExistMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[2]).toBe(registerUserMiddlewares_1.emailExistsValidationMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[3]).toBe(registerUserMiddlewares_1.setUserNameToLowercaseMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[4]).toBe(registerUserMiddlewares_1.doesUserNameExistMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[5]).toBe(registerUserMiddlewares_1.userNameExistsValidationMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[6]).toBe(registerUserMiddlewares_1.hashPasswordMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[7]).toBe(registerUserMiddlewares_1.createUserFromRequestMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[8]).toBe(registerUserMiddlewares_1.saveUserToDatabaseMiddleware);
        expect(registerUserMiddlewares_1.registerUserMiddlewares[9]).toBe(registerUserMiddlewares_1.sendFormattedUserMiddleware);
    });
});
//# sourceMappingURL=registerUserMiddlewares.spec.js.map