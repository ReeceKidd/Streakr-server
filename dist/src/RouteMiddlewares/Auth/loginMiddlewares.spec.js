"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const loginMiddlewares_1 = require("./loginMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
const customError_1 = require("../../customError");
describe(`loginRequestValidationMiddlware`, () => {
  const mockEmail = "mock@gmail.com";
  const mockPassword = "12345678";
  test("check that valid request passes", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { email: mockEmail, password: mockPassword }
    };
    const response = {
      status
    };
    const next = jest.fn();
    loginMiddlewares_1.loginRequestValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(1);
    expect(next).toBeCalled();
  });
  test("check that correct response is sent when email is missing", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { password: mockPassword }
    };
    const response = {
      status
    };
    const next = jest.fn();
    loginMiddlewares_1.loginRequestValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
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
      body: { email: incorrectEmail, password: mockPassword }
    };
    const response = {
      status
    };
    const next = jest.fn();
    loginMiddlewares_1.loginRequestValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "email" fails because ["email" must be a valid email]'
    });
    expect(next).not.toBeCalled();
  });
  test("check that correct response is sent when password is missing", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { email: mockEmail }
    };
    const response = {
      status
    };
    const next = jest.fn();
    loginMiddlewares_1.loginRequestValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
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
      body: { email: mockEmail, password: incorrectPassword }
    };
    const response = {
      status
    };
    const next = jest.fn();
    loginMiddlewares_1.loginRequestValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
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
    const request = {
      body: { notAllowed, email: mockEmail, password: mockPassword }
    };
    const response = {
      status
    };
    const next = jest.fn();
    loginMiddlewares_1.loginRequestValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.badRequest
    );
    expect(send).toBeCalledWith({ message: '"notAllowed" is not allowed' });
    expect(next).not.toBeCalled();
  });
});
describe(`retreiveUserWithEmailMiddleware`, () => {
  test("should define response.locals.user when user is found", () =>
    __awaiter(this, void 0, void 0, function*() {
      const findOne = jest.fn(() => Promise.resolve(true));
      const UserModel = {
        findOne
      };
      const request = { body: { email: "mock@gmail.com" } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = loginMiddlewares_1.getRetreiveUserWithEmailMiddleware(
        UserModel
      );
      yield middleware(request, response, next);
      expect.assertions(3);
      expect(findOne).toBeCalledWith({ email: "mock@gmail.com" });
      expect(response.locals.user).toBe(true);
      expect(next).toBeCalled();
    }));
  test("throws error when user doesn't exist", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(2);
      const findOne = jest.fn(() => Promise.resolve(false));
      const UserModel = {
        findOne
      };
      const request = { body: { email: "mock@gmail.com" } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = loginMiddlewares_1.getRetreiveUserWithEmailMiddleware(
        UserModel
      );
      yield middleware(request, response, next);
      expect(findOne).toBeCalledWith({ email: "mock@gmail.com" });
      expect(next).toBeCalledWith(
        new customError_1.CustomError(customError_1.ErrorType.UserDoesNotExist)
      );
    }));
  test("calls next() with RetreiveUserWithEmailMiddlewareError if middleware fails", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const findOne = jest.fn(() => Promise.reject("error"));
      const UserModel = {
        findOne
      };
      const request = {};
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = loginMiddlewares_1.getRetreiveUserWithEmailMiddleware(
        UserModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.RetreiveUserWithEmailMiddlewareError,
          expect.any(Error)
        )
      );
    }));
});
describe(`compareRequestPasswordToUserHashedPasswordMiddleware`, () => {
  test("sets response.locals.passwordMatchesHash to true when the request password matches the user hash", () =>
    __awaiter(this, void 0, void 0, function*() {
      const compare = jest.fn(() => {
        return Promise.resolve(true);
      });
      const middleware = loginMiddlewares_1.getCompareRequestPasswordToUserHashedPasswordMiddleware(
        compare
      );
      const response = { locals: { user: { password: "1234" } } };
      const request = { body: { password: "1234" } };
      const next = jest.fn();
      yield middleware(request, response, next);
      expect.assertions(2);
      expect(compare).toBeCalledWith("1234", "1234");
      expect(next).toBeCalled();
    }));
  test("calls next with PasswordDoesNotMatchHash error when the password doesn't match the hash", () =>
    __awaiter(this, void 0, void 0, function*() {
      const compare = jest.fn(() => {
        return Promise.resolve(false);
      });
      const middleware = loginMiddlewares_1.getCompareRequestPasswordToUserHashedPasswordMiddleware(
        compare
      );
      const response = { locals: { user: { password: "abcd" } } };
      const request = { body: { password: "1234" } };
      const next = jest.fn();
      yield middleware(request, response, next);
      expect.assertions(3);
      expect(compare).toBeCalledWith("1234", "abcd");
      expect(response.locals.passwordMatchesHash).toBe(undefined);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.PasswordDoesNotMatchHash
        )
      );
    }));
  test("calls next() with CompareRequestPasswordToUserHashedPasswordMiddleware error if middleware fails", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const compare = jest.fn(() => {
        return Promise.resolve(true);
      });
      const middleware = loginMiddlewares_1.getCompareRequestPasswordToUserHashedPasswordMiddleware(
        compare
      );
      const response = { locals: { user: { password: "abcd" } } };
      const request = {};
      const next = jest.fn();
      yield middleware(request, response, next);
      expect(next).toHaveBeenCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware,
          expect.any(Error)
        )
      );
    }));
});
describe(`setMinimumUserDataMiddleware`, () => {
  test("should set response.locals.minimumUserData", () => {
    const mockUserName = "abc";
    const mockId = "12345678";
    const mockUser = { userName: mockUserName, _id: mockId };
    const response = { locals: { user: mockUser } };
    const request = {};
    const next = jest.fn();
    loginMiddlewares_1.setMinimumUserDataMiddleware(request, response, next);
    expect.assertions(4);
    expect(response.locals.minimumUserData).toBeDefined();
    expect(response.locals.minimumUserData._id).toBeDefined();
    expect(response.locals.minimumUserData.userName).toBeDefined();
    expect(next).toBeCalled();
  });
  test("calls next() with SetMinimumUserDataMiddleware error if middleware fails", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const response = {};
      const request = {};
      const next = jest.fn();
      loginMiddlewares_1.setMinimumUserDataMiddleware(request, response, next);
      expect(next).toHaveBeenCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.SetMinimumUserDataMiddleware,
          expect.any(Error)
        )
      );
    }));
});
describe("setJsonWebTokenExpiryInfoMiddleware", () => {
  test("response.locals.expiry should be populated with next called", () => {
    expect.assertions(3);
    const expiresIn = 233993;
    const unitOfTime = "seconds";
    const request = {};
    const response = { locals: {} };
    const next = jest.fn();
    const middleware = loginMiddlewares_1.getSetJsonWebTokenExpiryInfoMiddleware(
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
    const request = {};
    const response = {};
    const next = jest.fn();
    const middleware = loginMiddlewares_1.getSetJsonWebTokenExpiryInfoMiddleware(
      expiresIn,
      unitOfTime
    );
    middleware(request, response, next);
    expect(next).toHaveBeenCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware,
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
    const response = { locals: { minimumUserData, expiry } };
    const request = {};
    const next = jest.fn();
    const middleware = loginMiddlewares_1.getSetJsonWebTokenMiddleware(
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
    const response = { locals: { minimumUserData, expiry } };
    const request = {};
    const next = jest.fn();
    const middleware = loginMiddlewares_1.getSetJsonWebTokenMiddleware(
      signTokenMock,
      jwtSecretMock
    );
    middleware(request, response, next);
    expect(next).toHaveBeenCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware,
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
    const response = { locals: { jsonWebToken: mockToken }, status };
    const request = {};
    const next = jest.fn();
    const middleware = loginMiddlewares_1.getLoginSuccessfulMiddleware(
      loginSuccessMessage
    );
    middleware(request, response, next);
    expect.assertions(3);
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.success);
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
    const response = { status, locals: { jsonWebToken: mockToken } };
    const request = {};
    const next = jest.fn();
    const middleware = loginMiddlewares_1.getLoginSuccessfulMiddleware(
      loginSuccessMessage
    );
    middleware(request, response, next);
    expect(next).toHaveBeenCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.CompareRequestPasswordToUserHashedPasswordMiddleware,
        expect.any(Error)
      )
    );
  });
});
describe(`loginMiddlewares`, () => {
  test("that login middlewares are defined in the correct order", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(7);
      expect(loginMiddlewares_1.loginMiddlewares[0]).toBe(
        loginMiddlewares_1.loginRequestValidationMiddleware
      );
      expect(loginMiddlewares_1.loginMiddlewares[1]).toBe(
        loginMiddlewares_1.retreiveUserWithEmailMiddleware
      );
      expect(loginMiddlewares_1.loginMiddlewares[2]).toBe(
        loginMiddlewares_1.compareRequestPasswordToUserHashedPasswordMiddleware
      );
      expect(loginMiddlewares_1.loginMiddlewares[3]).toBe(
        loginMiddlewares_1.setMinimumUserDataMiddleware
      );
      expect(loginMiddlewares_1.loginMiddlewares[4]).toBe(
        loginMiddlewares_1.setJsonWebTokenExpiryInfoMiddleware
      );
      expect(loginMiddlewares_1.loginMiddlewares[5]).toBe(
        loginMiddlewares_1.setJsonWebTokenMiddleware
      );
      expect(loginMiddlewares_1.loginMiddlewares[6]).toBe(
        loginMiddlewares_1.loginSuccessfulMiddleware
      );
    }));
});
//# sourceMappingURL=loginMiddlewares.spec.js.map
