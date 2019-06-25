import {
  loginMiddlewares,
  loginRequestValidationMiddleware,
  retreiveUserWithEmailMiddleware,
  getRetreiveUserWithEmailMiddleware,
  compareRequestPasswordToUserHashedPasswordMiddleware,
  getCompareRequestPasswordToUserHashedPasswordMiddleware,
  setMinimumUserDataMiddleware,
  setJsonWebTokenMiddleware,
  getSetJsonWebTokenMiddleware,
  loginSuccessfulMiddleware,
  getLoginSuccessfulMiddleware,
  getSetJsonWebTokenExpiryInfoMiddleware,
  setJsonWebTokenExpiryInfoMiddleware
} from "./loginMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe(`loginRequestValidationMiddlware`, () => {
  const mockEmail = "mock@gmail.com";
  const mockPassword = "12345678";

  test("check that valid request passes", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request: any = {
      body: { email: mockEmail, password: mockPassword }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    loginRequestValidationMiddleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalled();
  });

  test("check that correct response is sent when email is missing", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request: any = {
      body: { password: mockPassword }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    loginRequestValidationMiddleware(request, response, next);

    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
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
      body: { email: incorrectEmail, password: mockPassword }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    loginRequestValidationMiddleware(request, response, next);

    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "email" fails because ["email" must be a valid email]'
    });
    expect(next).not.toBeCalled();
  });

  test("check that correct response is sent when password is missing", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request: any = {
      body: { email: mockEmail }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    loginRequestValidationMiddleware(request, response, next);

    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
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
      body: { email: mockEmail, password: incorrectPassword }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    loginRequestValidationMiddleware(request, response, next);

    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
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
      body: { notAllowed, email: mockEmail, password: mockPassword }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    loginRequestValidationMiddleware(request, response, next);

    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({ message: '"notAllowed" is not allowed' });
    expect(next).not.toBeCalled();
  });
});

describe(`retreiveUserWithEmailMiddleware`, () => {
  test("should define response.locals.user when user is found", async () => {
    const findOne = jest.fn(() => Promise.resolve(true));
    const UserModel = {
      findOne
    };
    const request: any = { body: { email: "mock@gmail.com" } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getRetreiveUserWithEmailMiddleware(UserModel as any);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findOne).toBeCalledWith({ email: "mock@gmail.com" });
    expect(response.locals.user).toBe(true);
    expect(next).toBeCalled();
  });

  test("throws error when user doesn't exist", async () => {
    expect.assertions(2);
    const findOne = jest.fn(() => Promise.resolve(false));
    const UserModel = {
      findOne
    };
    const request: any = { body: { email: "mock@gmail.com" } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getRetreiveUserWithEmailMiddleware(UserModel as any);

    await middleware(request, response, next);
    expect(findOne).toBeCalledWith({ email: "mock@gmail.com" });
    expect(next).toBeCalledWith(new CustomError(ErrorType.UserDoesNotExist));
  });

  test("calls next() with RetreiveUserWithEmailMiddlewareError if middleware fails", async () => {
    expect.assertions(1);
    const findOne = jest.fn(() => Promise.reject("error"));
    const UserModel = {
      findOne
    };
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveUserWithEmailMiddleware(UserModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.RetreiveUserWithEmailMiddlewareError,
        expect.any(Error)
      )
    );
  });
});

describe(`compareRequestPasswordToUserHashedPasswordMiddleware`, () => {
  test("sets response.locals.passwordMatchesHash to true when the request password matches the user hash", async () => {
    const compare = jest.fn(() => {
      return Promise.resolve(true);
    });

    const middleware = getCompareRequestPasswordToUserHashedPasswordMiddleware(
      compare
    );
    const response: any = { locals: { user: { password: "1234" } } };
    const request: any = { body: { password: "1234" } };
    const next = jest.fn();

    await middleware(request, response, next);

    expect.assertions(2);
    expect(compare).toBeCalledWith("1234", "1234");
    expect(next).toBeCalled();
  });

  test("calls next with PasswordDoesNotMatchHash error when the password doesn't match the hash", async () => {
    const compare = jest.fn(() => {
      return Promise.resolve(false);
    });

    const middleware = getCompareRequestPasswordToUserHashedPasswordMiddleware(
      compare
    );
    const response: any = { locals: { user: { password: "abcd" } } };
    const request: any = { body: { password: "1234" } };
    const next = jest.fn();

    await middleware(request, response, next);

    expect.assertions(3);
    expect(compare).toBeCalledWith("1234", "abcd");
    expect(response.locals.passwordMatchesHash).toBe(undefined);
    expect(next).toBeCalledWith(
      new CustomError(ErrorType.PasswordDoesNotMatchHash)
    );
  });

  test("calls next() with CompareRequestPasswordToUserHashedPasswordMiddleware error if middleware fails", async () => {
    expect.assertions(1);
    const compare = jest.fn(() => {
      return Promise.resolve(true);
    });

    const middleware = getCompareRequestPasswordToUserHashedPasswordMiddleware(
      compare
    );
    const response: any = { locals: { user: { password: "abcd" } } };
    const request: any = {};
    const next = jest.fn();

    await middleware(request, response, next);

    expect(next).toHaveBeenCalledWith(
      new CustomError(
        ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`setMinimumUserDataMiddleware`, () => {
  test("should set response.locals.minimumUserData", () => {
    const mockUserName = "abc";
    const mockId = "12345678";

    const mockUser = { userName: mockUserName, _id: mockId };
    const response: any = { locals: { user: mockUser } };

    const request: any = {};
    const next = jest.fn();

    setMinimumUserDataMiddleware(request, response, next);

    expect.assertions(4);
    expect(response.locals.minimumUserData).toBeDefined();
    expect(response.locals.minimumUserData._id).toBeDefined();
    expect(response.locals.minimumUserData.userName).toBeDefined();
    expect(next).toBeCalled();
  });

  test("calls next() with SetMinimumUserDataMiddleware error if middleware fails", async () => {
    expect.assertions(1);

    const response: any = {};
    const request: any = {};
    const next = jest.fn();

    setMinimumUserDataMiddleware(request, response, next);

    expect(next).toHaveBeenCalledWith(
      new CustomError(ErrorType.SetMinimumUserDataMiddleware, expect.any(Error))
    );
  });
});

describe("setJsonWebTokenExpiryInfoMiddleware", () => {
  test("response.locals.expiry should be populated with next called", () => {
    expect.assertions(3);
    const expiresIn = 233993;
    const unitOfTime = "seconds";
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getSetJsonWebTokenExpiryInfoMiddleware(
      expiresIn,
      unitOfTime
    );
    middleware(request, response, next);
    expect(response.locals.expiry.expiresIn).toEqual(expiresIn);
    expect(response.locals.expiry.unitOfTime).toEqual(unitOfTime);
    expect(next).toBeCalledWith();
  });

  test("calls next with SetJsonWebTokenExpiryInfoMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const expiresIn = 233993;
    const unitOfTime = "seconds";
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSetJsonWebTokenExpiryInfoMiddleware(
      expiresIn,
      unitOfTime
    );
    middleware(request, response, next);

    expect(next).toHaveBeenCalledWith(
      new CustomError(
        ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("setJsonWebTokenMiddleware", () => {
  const ERROR_MESSAGE = "error";

  test("should set response.locals.token", () => {
    const minimumUserData = { userName: "user" };
    const expiry = { expiresIn: 123 };
    const signTokenMock = jest.fn(() => true);
    const jwtSecretMock = "1234";
    const response: any = { locals: { minimumUserData, expiry } };
    const request: any = {};
    const next = jest.fn();

    const middleware = getSetJsonWebTokenMiddleware(
      signTokenMock,
      jwtSecretMock
    );
    middleware(request, response, next);

    expect.assertions(3);
    expect(signTokenMock).toBeCalledWith({ minimumUserData }, jwtSecretMock, {
      expiresIn: expiry.expiresIn
    });
    expect(response.locals.jsonWebToken).toBeDefined();
    expect(next).toBeCalled();
  });

  test("calls next SetJsonWebTokenMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const signTokenMock = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const expiry = { expiresIn: 123 };
    const minimumUserData = { userName: "user" };
    const jwtSecretMock = "1234";

    const response: any = { locals: { minimumUserData, expiry } };
    const request: any = {};
    const next = jest.fn();

    const middleware = getSetJsonWebTokenMiddleware(
      signTokenMock,
      jwtSecretMock
    );
    middleware(request, response, next);

    expect(next).toHaveBeenCalledWith(
      new CustomError(
        ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`loginSuccessfulMiddleware`, () => {
  const ERROR_MESSAGE = "error";
  const loginSuccessMessage = "success";

  test("should send login success message", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const mockToken = "1234";
    const response: any = { locals: { jsonWebToken: mockToken }, status };

    const request: any = {};
    const next = jest.fn();

    const middleware = getLoginSuccessfulMiddleware(loginSuccessMessage);
    middleware(request, response, next);

    expect.assertions(3);
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.success);
    expect(send).toBeCalledWith({
      message: loginSuccessMessage,
      jsonWebToken: mockToken
    });
  });

  test("should call next with LoginSuccessfullMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const mockToken = "1234";
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { status, locals: { jsonWebToken: mockToken } };

    const request: any = {};
    const next = jest.fn();

    const middleware = getLoginSuccessfulMiddleware(loginSuccessMessage);
    middleware(request, response, next);

    expect(next).toHaveBeenCalledWith(
      new CustomError(
        ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`loginMiddlewares`, () => {
  test("that login middlewares are defined in the correct order", async () => {
    expect.assertions(7);
    expect(loginMiddlewares[0]).toBe(loginRequestValidationMiddleware);
    expect(loginMiddlewares[1]).toBe(retreiveUserWithEmailMiddleware);
    expect(loginMiddlewares[2]).toBe(
      compareRequestPasswordToUserHashedPasswordMiddleware
    );
    expect(loginMiddlewares[3]).toBe(setMinimumUserDataMiddleware);
    expect(loginMiddlewares[4]).toBe(setJsonWebTokenExpiryInfoMiddleware);
    expect(loginMiddlewares[5]).toBe(setJsonWebTokenMiddleware);
    expect(loginMiddlewares[6]).toBe(loginSuccessfulMiddleware);
  });
});
