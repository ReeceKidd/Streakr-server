import { Request, Response, NextFunction } from "express";

import {
    registerUserMiddlewares,
    userRegistrationValidationMiddleware,
    doesUserEmailExistMiddleware,
    getDoesUserEmailExistMiddleware,
    emailExistsValidationMiddleware,
    getEmailExistsValidationMiddleware,
    doesUserNameExistMiddleware,
    getDoesUserNameExistMiddleware,
    userNameExistsValidationMiddleware,
    getUserNameExistsValidationMiddleware,
    hashPasswordMiddleware,
    getHashPasswordMiddleware,
    createUserFromRequestMiddleware,
    getCreateUserFromRequestMiddleware,
    saveUserToDatabaseMiddleware,
    sendFormattedUserMiddleware,
    setUserNameToLowercaseMiddleware
} from './registerUserMiddlewares'


describe(`userRegistrationValidationMiddlware`, () => {

    const mockUserName = "mockUserName";
    const mockEmail = "mock@gmail.com";
    const mockPassword = "12345678";

    test("check that valid request passes", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userName: mockUserName, email: mockEmail, password: mockPassword }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalled();
    });

    test("check that correct response is sent when userName is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { email: mockEmail, password: mockPassword }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "userName" fails because ["userName" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("check that correct response is sent when email is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userName: mockUserName, password: mockPassword }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "email" fails because ["email" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("check that correct response is sent when email is incorrect", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const incorrectEmail = "1234";

        const request: any = {
            body: {
                userName: mockUserName,
                email: incorrectEmail,
                password: mockPassword
            }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "email" fails because ["email" must be a valid email]'
        });
        expect(next).not.toBeCalled();
    });

    test("check that correct response is sent when password is missing", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const request: any = {
            body: { userName: mockUserName, email: mockEmail }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message: 'child "password" fails because ["password" is required]'
        });
        expect(next).not.toBeCalled();
    });

    test("check that correct response is sent when password is too short", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const incorrectPassword = "123";

        const request: any = {
            body: {
                userName: mockUserName,
                email: mockEmail,
                password: incorrectPassword
            }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(422);
        expect(send).toBeCalledWith({
            message:
                'child "password" fails because ["password" length must be at least 6 characters long]'
        });
        expect(next).not.toBeCalled();
    });

    test("check that not allowed parameter is caught", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));

        const notAllowed = "123";

        const request: any = {
            body: {
                notAllowed,
                userName: mockUserName,
                email: mockEmail,
                password: mockPassword
            }
        };
        const response: any = {
            status
        };
        const next = jest.fn();

        userRegistrationValidationMiddleware(request, response, next);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalledWith({ message: '"notAllowed" is not allowed' });
        expect(next).not.toBeCalled();
    });
});

describe(`doesUserEmailExistMiddleware`, () => {

    const mockEmail = "test@gmail.com";
    const ERROR_MESSAGE = "error";

    test("should set emailExists to true when user is found", async () => {
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        }
        const request: any = { body: { email: mockEmail } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getDoesUserEmailExistMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExists).toBe(true);
        expect(next).toBeCalledWith();
    });

    test("should set emailExists to false when user doesn't exist", async () => {
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne
        }
        const request: any = { body: { email: mockEmail } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getDoesUserEmailExistMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExistsw).toBe(undefined);
        expect(next).toBeCalledWith();
    });

    test("should call next() with err paramater if database call fails", async () => {
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        }
        const request: any = { body: { email: mockEmail } };
        const response: any = { locals: {} };
        const next = jest.fn();

        const middleware = getDoesUserEmailExistMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ email: mockEmail });
        expect(response.locals.emailExists).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    });
});

describe(`emailExistsValidationMiddleware `, () => {

    const mockEmail = "test@gmail.com";
    const emailKey = 'email'
    const subject = 'subject'
    test("check that error response is returned correctly when email already exists", async () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();
        const request = {
            body: { email: mockEmail }
        };
        const response: any = {
            locals: { emailExists: true },
            status
        };
        const next = jest.fn();

        const middleware = getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, subject, emailKey);

        await middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(3);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalled();
        expect(generateAlreadyExistsMessage).toBeCalledWith(subject, emailKey, mockEmail);
    });

    test("check that next is called when email doesn't exist", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();

        const request = {
            body: { email: mockEmail }
        };
        const response: any = {
            locals: { emailExists: false },
            status
        };
        const next = jest.fn();

        const middleware = getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, subject, emailKey);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(4);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(generateAlreadyExistsMessage).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test("check that when error is thrown next is called with err", () => {
        const errorMessage = 'error'
        const send = jest.fn(() => { throw new Error(errorMessage) });
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();

        const request = {
            body: { email: mockEmail }
        };
        const response: any = {
            locals: { emailExists: true },
            status
        };
        const next = jest.fn();

        const middleware = getEmailExistsValidationMiddleware(generateAlreadyExistsMessage, subject, emailKey);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});

describe('setUserNameToLowercaseMiddleware', () => {
    const mockUsername = "Testname";
    const mockLowerCaseUsername = "testname";

    test("it should set userName to lowercase version of itself", () => {
        const request: any = { body: { userName: mockUsername } }
        const response: any = { locals: {} }
        const next = jest.fn()

        setUserNameToLowercaseMiddleware(request, response, next)

        expect.assertions(2)
        expect(response.locals.lowerCaseUserName).toBe(mockLowerCaseUsername)
        expect(next).toBeCalledWith()
    })

    test("it should call next with err on failure", () => {
        const request: any = { body: { userName: { toLowerCase: () => { throw new Error() } } } }
        const response: any = {}
        const next = jest.fn()

        setUserNameToLowercaseMiddleware(request, response, next)

        expect.assertions(1)
        expect(next).toBeCalledWith(new Error())
    })
})


describe(`doesUserNameExistMiddleware`, () => {

    const mockUserName = "testname";
    const ERROR_MESSAGE = "error";

    test("should set userNameExists to true when userExists", async () => {
        const findOne = jest.fn(() => Promise.resolve(true));
        const UserModel = {
            findOne
        }
        const request: any = {};
        const response: any = { locals: { lowerCaseUserName: mockUserName } };
        const next = jest.fn();

        const middleware = getDoesUserNameExistMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(true);
        expect(next).toBeCalledWith();
    });

    test("should set userNameExists to false when user doesn't exist", async () => {
        const findOne = jest.fn(() => Promise.resolve(false));
        const UserModel = {
            findOne
        }
        const request: any = {};
        const response: any = { locals: { lowerCaseUserName: mockUserName } };
        const next = jest.fn();

        const middleware = getDoesUserNameExistMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(undefined);
        expect(next).toBeCalledWith();
    });

    test("should call next() with err paramater if database call fails", async () => {
        const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
        const UserModel = {
            findOne
        }
        const request: any = { body: {} };
        const response: any = { locals: { lowerCaseUserName: mockUserName } };
        const next = jest.fn();

        const middleware = getDoesUserNameExistMiddleware(UserModel);

        await middleware(request, response, next);

        expect.assertions(3);
        expect(findOne).toBeCalledWith({ userName: mockUserName });
        expect(response.locals.userNameExists).toBe(undefined);
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    });
});

describe(`userNameExistsValidationMiddleware`, () => {

    const mockUserName = "testName";
    const userNameKey = 'userName'
    const subject = 'subject'

    test("check that error response is returned correctly when userName already exists", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();

        const request = {
        };
        const response: any = {
            locals: { userNameExists: true, lowerCaseUserName: mockUserName },
            status
        };
        const next = jest.fn();

        const middleware = getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(4);
        expect(status).toHaveBeenCalledWith(400);
        expect(send).toBeCalled();
        expect(generateAlreadyExistsMessage).toBeCalledWith(subject, userNameKey, mockUserName);
        expect(next).not.toBeCalled();
    });

    test("check that next is called when userName doesn't exist", () => {
        const send = jest.fn();
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();

        const request = {

        };
        const response: any = {
            locals: { userNameExists: false, lowerCaseUserName: mockUserName },
            status
        };
        const next = jest.fn();

        const middleware = getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(4);
        expect(status).not.toHaveBeenCalled();
        expect(send).not.toBeCalled();
        expect(generateAlreadyExistsMessage).not.toBeCalled();
        expect(next).toBeCalled();
    });

    test("check that when error is thrown next is called with err", () => {
        const errorMessage = 'error'
        const send = jest.fn(() => { throw new Error(errorMessage) });
        const status = jest.fn(() => ({ send }));
        const generateAlreadyExistsMessage = jest.fn();

        const request = {
        };
        const response: any = {
            locals: { userNameExists: true, lowerCaseUserName: mockUserName },
            status
        };
        const next = jest.fn();

        const middleware = getUserNameExistsValidationMiddleware(generateAlreadyExistsMessage, subject, userNameKey);

        middleware(request as Request, response as Response, next as NextFunction);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(errorMessage));
    });
});

describe(`hashPasswordMiddleware`, () => {
    const ERROR_MESSAGE = "error";

    test("should set response.locals.hashedPassword", async () => {
        const mockedPassword = "password";
        const hashedPassword = "12$4354";
        const saltMock = 10;
        const hash = jest.fn(() => {
            return Promise.resolve(hashedPassword);
        });

        const middleware = getHashPasswordMiddleware(hash, saltMock);
        const response: any = { locals: {} };
        const request: any = { body: { password: mockedPassword } };
        const next = jest.fn();

        await middleware(request, response, next);

        expect.assertions(3);
        expect(hash).toBeCalledWith(mockedPassword, saltMock);
        expect(response.locals.hashedPassword).toBe(hashedPassword);
        expect(next).toBeCalled();
    });

    test("should call next() with err paramater if hash password call fails", async () => {
        const mockedPassword = "password";
        const hashedPassword = "12$4354";
        const saltMock = 10;
        const hash = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE);
        });


        const middleware = getHashPasswordMiddleware(hash, saltMock);
        const response: any = { locals: {} };
        const request: any = { body: { password: mockedPassword } };
        const next = jest.fn();

        await middleware(request, response, next);

        expect.assertions(3);
        expect(hash).toBeCalledWith(mockedPassword, saltMock);
        expect(response.locals.hashedPassword).not.toBeDefined();
        expect(next).toBeCalledWith(ERROR_MESSAGE);
    });
});

describe(`createUserFromRequestMiddleware`, () => {
    test("should define response.locals.newUser", async () => {
        const hashedPassword = "12$4354";
        const userName = 'user'
        const email = 'user@gmail.com'

        class User {
            userName: string;
            email: string;
            password: string;

            constructor({ userName, email, password }) {
                this.userName = userName;
                this.email = email;
                this.password = password
            }
        }

        const response: any = { locals: { hashedPassword, lowerCaseUserName: userName } };
        const request: any = { body: { email } };
        const next = jest.fn();

        const middleware = getCreateUserFromRequestMiddleware(User)

        await middleware(request, response, next);

        expect.assertions(1);
        const newUser = new User({ userName, email, password: hashedPassword })
        expect(response.locals.newUser).toEqual(newUser)
    });

    test('should call next with error message on error', () => {

        const user = { userName: 'userName', email: 'username@gmail.com' };

        const response: any = { locals: { user } };
        const request: any = { body: {} };
        const next = jest.fn();

        const middleware = getCreateUserFromRequestMiddleware({})

        middleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new TypeError("user is not a constructor"))
    })

});

describe(`saveUserToDatabaseMiddleware`, () => {

    const ERROR_MESSAGE = "error";

    test("should set response.locals.savedUser", async () => {
        const save = jest.fn(() => {
            return Promise.resolve(mockUser)
        });
        const mockUser = {
            userName: 'User',
            email: 'user@gmail.com',
            password: 'password',
            save
        }

        const response: any = { locals: { newUser: mockUser } };
        const request: any = {}
        const next = jest.fn();

        await saveUserToDatabaseMiddleware(request, response, next);

        expect.assertions(3);
        expect(save).toBeCalled();
        expect(response.locals.savedUser).toBeDefined()
        expect(next).toBeCalled();
    });

    test("should call next() with err paramater if save call fails", async () => {
        const save = jest.fn(() => {
            return Promise.reject(ERROR_MESSAGE)
        });

        const request: any = {};
        const response: any = { locals: { newUser: { save } } };
        const next = jest.fn();

        await saveUserToDatabaseMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(ERROR_MESSAGE);

    });

});

describe(`sendFormattedUserMiddleware`, () => {

    const ERROR_MESSAGE = "error";

    test("should send user in response with password undefined", () => {

        const mockUserName = 'abc'
        const mockEmail = 'email@gmail.com'
        const mockPassword = '12345678'

        const savedUser = { userName: mockUserName, email: mockEmail, password: mockPassword }
        const send = jest.fn()
        const response: any = { locals: { savedUser }, send };

        const request: any = {}
        const next = jest.fn();

        sendFormattedUserMiddleware(request, response, next);

        expect.assertions(3);
        expect(response.locals.savedUser.password).toBeUndefined()
        expect(next).not.toBeCalled()
        expect(send).toBeCalledWith({ userName: mockUserName, email: mockEmail })
    });

    test("should call next with an error on failure", () => {
        const mockUserName = 'abc'
        const mockEmail = 'email@gmail.com'
        const mockPassword = '12345678'

        const savedUser = { userName: mockUserName, email: mockEmail, password: mockPassword }
        const send = jest.fn(() => {
            throw new Error(ERROR_MESSAGE)
        })
        const response: any = { locals: { savedUser }, send };

        const request: any = {}
        const next = jest.fn();

        sendFormattedUserMiddleware(request, response, next);

        expect.assertions(1);
        expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
    })


});

describe(`verifyJsonWebTokenMiddlewaresWithResponse`, () => {
    test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
        expect.assertions(10);
        expect(registerUserMiddlewares[0]).toBe(userRegistrationValidationMiddleware)
        expect(registerUserMiddlewares[1]).toBe(doesUserEmailExistMiddleware)
        expect(registerUserMiddlewares[2]).toBe(emailExistsValidationMiddleware)
        expect(registerUserMiddlewares[3]).toBe(setUserNameToLowercaseMiddleware)
        expect(registerUserMiddlewares[4]).toBe(doesUserNameExistMiddleware)
        expect(registerUserMiddlewares[5]).toBe(userNameExistsValidationMiddleware)
        expect(registerUserMiddlewares[6]).toBe(hashPasswordMiddleware)
        expect(registerUserMiddlewares[7]).toBe(createUserFromRequestMiddleware)
        expect(registerUserMiddlewares[8]).toBe(saveUserToDatabaseMiddleware)
        expect(registerUserMiddlewares[9]).toBe(sendFormattedUserMiddleware)
    });
});