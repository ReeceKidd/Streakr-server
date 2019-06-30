import { Request, Response, NextFunction } from "express";

import {
  registerUserMiddlewares,
  userRegistrationValidationMiddleware,
  doesUserEmailExistMiddleware,
  getDoesUserEmailExistMiddleware,
  doesUsernameExistMiddleware,
  getDoesUsernameExistMiddleware,
  hashPasswordMiddleware,
  getHashPasswordMiddleware,
  createUserFromRequestMiddleware,
  getCreateUserFromRequestMiddleware,
  saveUserToDatabaseMiddleware,
  sendFormattedUserMiddleware,
  setUsernameToLowercaseMiddleware
} from "./registerUserMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

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

  test("sends correct correct response when userName is missing", () => {
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
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userName" fails because ["userName" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when email is missing", () => {
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
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "email" fails because ["email" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when email is incorrect", () => {
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
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "email" fails because ["email" must be a valid email]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when password is missing", () => {
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
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "password" fails because ["password" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when password is too short", () => {
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
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "password" fails because ["password" length must be at least 6 characters long]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when invalid paramater is sent", () => {
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
    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({ message: '"notAllowed" is not allowed' });
    expect(next).not.toBeCalled();
  });
});

describe(`doesUserEmailExistMiddleware`, () => {
  const mockEmail = "test@gmail.com";
  const ERROR_MESSAGE = "error";

  test("calls next() if user does not exist", async () => {
    expect.assertions(2);
    const findOne = jest.fn(() => Promise.resolve(false));
    const UserModel = {
      findOne
    };
    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getDoesUserEmailExistMiddleware(UserModel as any);

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ email: mockEmail });
    expect(next).toBeCalledWith();
  });

  test("throws UserEmailAlreadyExists if user is found", async () => {
    expect.assertions(1);

    const findOne = jest.fn(() => Promise.resolve(true));
    const UserModel = {
      findOne
    };
    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getDoesUserEmailExistMiddleware(UserModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.UserEmailAlreadyExists)
    );
  });

  test("calls next with DoesUserEmailExistMiddleware error on middleware failure", async () => {
    expect.assertions(1);

    const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
    const UserModel = {
      findOne
    };
    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getDoesUserEmailExistMiddleware(UserModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DoesUserEmailExistMiddleware, expect.any(Error))
    );
  });
});

describe("setUsernameToLowercaseMiddleware", () => {
  const mockUsername = "Testname";
  const mockLowerCaseUsername = "testname";

  test("sets userName to lowercase version of itself", () => {
    expect.assertions(2);

    const request: any = { body: { userName: mockUsername } };
    const response: any = { locals: {} };
    const next = jest.fn();

    setUsernameToLowercaseMiddleware(request, response, next);

    expect(response.locals.lowerCaseUserName).toBe(mockLowerCaseUsername);
    expect(next).toBeCalledWith();
  });

  test("calls next with SetUsernameToLowercaseMiddleware error on middleware failure", () => {
    const request: any = {
      body: {
        userName: {
          toLowerCase: () => {
            throw new Error();
          }
        }
      }
    };
    const response: any = {};
    const next = jest.fn();

    setUsernameToLowercaseMiddleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SetUsernameToLowercaseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`doesUsernameExistMiddleware`, () => {
  const mockUserName = "testname";
  const ERROR_MESSAGE = "error";

  test("calls next() when user does not exist", async () => {
    expect.assertions(2);

    const findOne = jest.fn(() => Promise.resolve(false));
    const UserModel = {
      findOne
    };
    const request: any = {};
    const response: any = { locals: { lowerCaseUserName: mockUserName } };
    const next = jest.fn();

    const middleware = getDoesUsernameExistMiddleware(UserModel as any);

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ userName: mockUserName });
    expect(next).toBeCalledWith();
  });

  test("throws UsernameAlreadyExists error when user already exists", async () => {
    expect.assertions(2);

    const findOne = jest.fn(() => Promise.resolve(true));
    const UserModel = {
      findOne
    };
    const request: any = {};
    const response: any = { locals: { lowerCaseUserName: mockUserName } };
    const next = jest.fn();

    const middleware = getDoesUsernameExistMiddleware(UserModel as any);

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ userName: mockUserName });
    expect(next).toBeCalledWith(
      new CustomError(ErrorType.UsernameAlreadyExists, expect.any(Error))
    );
  });

  test("calls next with DoesUsernameAlreadyExistMiddleware error on middleware failure", async () => {
    expect.assertions(1);

    const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
    const UserModel = {
      findOne
    };
    const request: any = { body: {} };
    const response: any = { locals: { lowerCaseUserName: mockUserName } };
    const next = jest.fn();

    const middleware = getDoesUsernameExistMiddleware(UserModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.DoesUsernameAlreadyExistMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`hashPasswordMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  test("sets response.locals.hashedPassword", async () => {
    expect.assertions(3);

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

    expect(hash).toBeCalledWith(mockedPassword, saltMock);
    expect(response.locals.hashedPassword).toBe(hashedPassword);
    expect(next).toBeCalledWith();
  });

  test("calls next with HashPasswordMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const mockedPassword = "password";
    const saltMock = 10;
    const hash = jest.fn(() => {
      return Promise.reject(ERROR_MESSAGE);
    });

    const middleware = getHashPasswordMiddleware(hash, saltMock);
    const response: any = { locals: {} };
    const request: any = { body: { password: mockedPassword } };
    const next = jest.fn();

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.HashPasswordMiddleware, expect.any(Error))
    );
  });
});

describe(`createUserFromRequestMiddleware`, () => {
  test("sets response.locals.newUser", async () => {
    expect.assertions(1);

    const hashedPassword = "12$4354";
    const userName = "user";
    const email = "user@gmail.com";

    class User {
      userName: string;
      email: string;
      password: string;

      constructor({ userName, email, password }: any) {
        this.userName = userName;
        this.email = email;
        this.password = password;
      }
    }

    const response: any = {
      locals: { hashedPassword, lowerCaseUserName: userName }
    };
    const request: any = { body: { email } };
    const next = jest.fn();

    const middleware = getCreateUserFromRequestMiddleware(User as any);

    await middleware(request, response, next);

    const newUser = new User({ userName, email, password: hashedPassword });
    expect(response.locals.newUser).toEqual(newUser);
  });

  test("calls next with CreateUserFromRequestMiddleware on middleware failure", () => {
    const user = { userName: "userName", email: "username@gmail.com" };

    const response: any = { locals: { user } };
    const request: any = { body: {} };
    const next = jest.fn();

    const middleware = getCreateUserFromRequestMiddleware({} as any);

    middleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateUserFromRequestMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`saveUserToDatabaseMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  test("sets response.locals.savedUser", async () => {
    expect.assertions(3);

    const save = jest.fn(() => {
      return Promise.resolve(true);
    });
    const mockUser = {
      userName: "User",
      email: "user@gmail.com",
      password: "password",
      save
    };

    const response: any = { locals: { newUser: mockUser } };
    const request: any = {};
    const next = jest.fn();

    await saveUserToDatabaseMiddleware(request, response, next);

    expect(save).toBeCalledWith();
    expect(response.locals.savedUser).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with SaveUserToDatabaseMiddleware error on middleware failure.", async () => {
    const save = jest.fn(() => {
      return Promise.reject(ERROR_MESSAGE);
    });

    const request: any = {};
    const response: any = { locals: { newUser: { save } } };
    const next = jest.fn();

    await saveUserToDatabaseMiddleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SaveUserToDatabaseMiddleware, expect.any(Error))
    );
  });
});

describe(`sendFormattedUserMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  test("sends user with undefined password in response", () => {
    expect.assertions(4);

    const mockUserName = "abc";
    const mockEmail = "email@gmail.com";
    const mockPassword = "12345678";

    const savedUser = {
      userName: mockUserName,
      email: mockEmail,
      password: mockPassword
    };
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { savedUser }, status };

    const request: any = {};
    const next = jest.fn();

    sendFormattedUserMiddleware(request, response, next);

    expect(response.locals.savedUser.password).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith({ userName: mockUserName, email: mockEmail });
  });

  test("calls next with SendFormattedUserMiddleware error on middleware failure", () => {
    expect.assertions(1);

    const mockUserName = "abc";
    const mockEmail = "email@gmail.com";
    const mockPassword = "12345678";

    const savedUser = {
      userName: mockUserName,
      email: mockEmail,
      password: mockPassword
    };
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { savedUser }, status };

    const request: any = {};
    const next = jest.fn();

    sendFormattedUserMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendFormattedUserMiddleware)
    );
  });
});

describe(`verifyJsonWebTokenMiddlewaresWithResponse`, () => {
  test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
    expect.assertions(9);
    expect(registerUserMiddlewares.length).toEqual(8);
    expect(registerUserMiddlewares[0]).toBe(
      userRegistrationValidationMiddleware
    );
    expect(registerUserMiddlewares[1]).toBe(doesUserEmailExistMiddleware);
    expect(registerUserMiddlewares[2]).toBe(setUsernameToLowercaseMiddleware);
    expect(registerUserMiddlewares[3]).toBe(doesUsernameExistMiddleware);
    expect(registerUserMiddlewares[4]).toBe(hashPasswordMiddleware);
    expect(registerUserMiddlewares[5]).toBe(createUserFromRequestMiddleware);
    expect(registerUserMiddlewares[6]).toBe(saveUserToDatabaseMiddleware);
    expect(registerUserMiddlewares[7]).toBe(sendFormattedUserMiddleware);
  });
});
