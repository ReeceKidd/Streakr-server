import { Request, Response, NextFunction } from 'express'
import {
  loginMiddlewares,
  loginRequestValidationMiddleware,
  retreiveUserWithEmailMiddleware,
  getRetreiveUserWithEmailMiddleware,
  userExistsValidationMiddleware,
  getUserExistsValidationMiddleware,
  compareRequestPasswordToUserHashedPasswordMiddleware,
  getCompareRequestPasswordToUserHashedPasswordMiddleware,
  passwordsMatchValidationMiddleware,
  getPasswordsMatchValidationMiddleware,
  setMinimumUserDataMiddleware,
  setJsonWebTokenMiddleware,
  getSetJsonWebTokenMiddleware,
  loginSuccessfulMiddleware,
  getLoginSuccessfulMiddleware,
  getSetJsonWebTokenExpiryInfoMiddleware,
  setJsonWebTokenExpiryInfoMiddleware
} from './loginMiddlewares'
import { ResponseCodes } from '../../Server/responseCodes';

describe(`loginRequestValidationMiddlware`, () => {

  const mockEmail = 'mock@gmail.com'
  const mockPassword = '12345678'

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
    expect(send).toBeCalledWith({ "message": "child \"email\" fails because [\"email\" is required]" });
    expect(next).not.toBeCalled();
  });

  test("check that correct response is sent when email is incorrect", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const incorrectEmail = '1234'

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
    expect(send).toBeCalledWith({ "message": "child \"email\" fails because [\"email\" must be a valid email]" });
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
    expect(send).toBeCalledWith({ "message": "child \"password\" fails because [\"password\" is required]" });
    expect(next).not.toBeCalled();
  });

  test("check that correct response is sent when password is too short", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const incorrectPassword = '123'

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
    expect(send).toBeCalledWith({ "message": "child \"password\" fails because [\"password\" length must be at least 6 characters long]" });
    expect(next).not.toBeCalled();
  });

  test("check that not allowed parameter is caught", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const notAllowed = '123'

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
    expect(send).toBeCalledWith({ "message": "\"notAllowed\" is not allowed" });
    expect(next).not.toBeCalled();
  });


});

describe(`retreiveUserWithEmailMiddleware`, () => {
  const mockEmail = "test@gmail.com";
  const ERROR_MESSAGE = "error";


  test("should define response.locals.user when user is found", async () => {
    const findOne = jest.fn(() => Promise.resolve(true));
    const UserModel = {
      findOne
    }
    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getRetreiveUserWithEmailMiddleware(UserModel);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findOne).toBeCalledWith({ email: mockEmail });
    expect(response.locals.user).toBe(true);
    expect(next).toBeCalled();
  });

  test("should not define response.locals.user when user doesn't exist", async () => {
    const findOne = jest.fn(() => Promise.resolve(false));
    const UserModel = {
      findOne
    }
    const request: any = { body: { email: mockEmail } };
    const response: any = { locals: {} };
    const next = jest.fn();

    const middleware = getRetreiveUserWithEmailMiddleware(UserModel);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findOne).toBeCalledWith({ email: mockEmail });
    expect(response.locals.emailExists).toBe(undefined);
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

    const middleware = getRetreiveUserWithEmailMiddleware(UserModel);

    await middleware(request, response, next);

    expect.assertions(3);
    expect(findOne).toBeCalledWith({ email: mockEmail });
    expect(response.locals.emailExists).toBe(undefined);
    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});

describe(`userExistsValidationMiddleware`, () => {
  const mockErrorMessage = 'User does not exist'

  test("check that error response is returned correctly when user wasn't found", async () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request = {};
    const response: any = {
      locals: {},
      status
    };
    const next = jest.fn();

    const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(2);
    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({ message: mockErrorMessage });
  });

  test("check that next is called when user is defined on response.locals", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request = {};
    const response: any = {
      locals: { user: true },
      status
    };
    const next = jest.fn();

    const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(3);
    expect(status).not.toHaveBeenCalled();
    expect(send).not.toBeCalled();
    expect(next).toBeCalled();
  });

  test("check that next is called with err on send failure", () => {
    const errorMessage = 'error'
    const send = jest.fn(() => { throw new Error(errorMessage) });
    const status = jest.fn(() => ({ send }));
    const generateAlreadyExistsMessage = jest.fn();

    const request = {};
    const response: any = {
      locals: { user: false },
      status
    };
    const next = jest.fn();

    const middleware = getUserExistsValidationMiddleware(mockErrorMessage);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(errorMessage));
  });
});

describe(`compareRequestPasswordToUserHashedPasswordMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  const mockedPassword = "password";
  const mockedHash = '1234'

  test("should set response.locals.passwordMatchesHash to true when the request password matches the user hash", async () => {

    const compare = jest.fn(() => {
      return Promise.resolve(true);
    });

    const middleware = getCompareRequestPasswordToUserHashedPasswordMiddleware(compare);
    const response: any = { locals: { user: { password: mockedHash } } };
    const request: any = { body: { password: mockedPassword } };
    const next = jest.fn();

    await middleware(request, response, next);

    expect.assertions(3);
    expect(compare).toBeCalledWith(mockedPassword, mockedHash);
    expect(response.locals.passwordMatchesHash).toBe(true);
    expect(next).toBeCalled();
  });

  test("should set response.locals.passwordMatchesHash to false when the request password does not match the user hash", async () => {
    const compare = jest.fn(() => {
      return Promise.resolve(false);
    });

    const middleware = getCompareRequestPasswordToUserHashedPasswordMiddleware(compare);
    const response: any = { locals: { user: { password: mockedHash } } };
    const request: any = { body: { password: mockedPassword } };
    const next = jest.fn();

    await middleware(request, response, next);

    expect.assertions(3);
    expect(compare).toBeCalledWith(mockedPassword, mockedHash);
    expect(response.locals.passwordMatchesHash).toBe(false);
    expect(next).toBeCalled();
  })

  test("should call next() with err paramater if compare fails", async () => {

    const compare = jest.fn(() => {
      return Promise.reject(ERROR_MESSAGE);
    });


    const middleware = getCompareRequestPasswordToUserHashedPasswordMiddleware(compare);
    const response: any = { locals: { user: { password: mockedHash } } };
    const request: any = { body: { password: mockedPassword } };
    const next = jest.fn();

    await middleware(request, response, next);

    expect.assertions(3);
    expect(compare).toBeCalledWith(mockedPassword, mockedHash);
    expect(response.locals.passwordMatchesHash).not.toBeDefined();
    expect(next).toBeCalledWith(ERROR_MESSAGE);
  });
});

describe(`passwordsMatchValidationMiddleware`, () => {

  const loginError = 'login details are incorrect'
  const errorMessage = 'error'


  test("check that error response is returned correctly when passwords don't match", async () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request = {};
    const response: any = {
      locals: { passwordMatchesHash: false },
      status
    };
    const next = jest.fn();

    const middleware = getPasswordsMatchValidationMiddleware(loginError);

    await middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(2);
    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({ message: loginError });
  });

  test("check that next is called when passwordMatchesHash is true", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request = {};
    const response: any = {
      locals: { passwordMatchesHash: true },
      status
    };
    const next = jest.fn();

    const middleware = getPasswordsMatchValidationMiddleware(loginError);

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(3);
    expect(status).not.toHaveBeenCalled();
    expect(send).not.toBeCalled();
    expect(next).toBeCalled();
  });

  test("check that when error is thrown next is called with err", () => {
    const send = jest.fn(() => { throw new Error(errorMessage) });
    const status = jest.fn(() => ({ send }));


    const request = {};
    const response: any = {
      locals: { passwordMatchesHash: false },
      status
    };
    const next = jest.fn();

    const middleware = getPasswordsMatchValidationMiddleware(loginError)

    middleware(request as Request, response as Response, next as NextFunction);

    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(errorMessage));
  });
});

describe(`setMinimumUserDataMiddleware`, () => {
  test("should set response.locals.minimumUserData", () => {

    const mockUserName = 'abc'
    const mockId = '12345678'

    const mockUser = { userName: mockUserName, _id: mockId }
    const response: any = { locals: { user: mockUser } };

    const request: any = {}
    const next = jest.fn();

    setMinimumUserDataMiddleware(request, response, next);

    expect.assertions(4);
    expect(response.locals.minimumUserData).toBeDefined()
    expect(response.locals.minimumUserData._id).toBeDefined()
    expect(response.locals.minimumUserData.userName).toBeDefined()
    expect(next).toBeCalled()
  });

  test("should call next with an error on failure because response.locals.user is not defined", () => {

    const response: any = { locals: {} };

    const request: any = {}
    const next = jest.fn();

    setMinimumUserDataMiddleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(new TypeError(`Cannot read property '_id' of undefined`))
  })


});

describe('setJsonWebTokenExpiryInfoMiddleware', () => {

  test('response.locals.expiry should be populated with next called', () => {
    expect.assertions(3)
    const expiresIn = 233993
    const unitOfTime = 'seconds'
    const request: any = {}
    const response: any = { locals: {} }
    const next = jest.fn()
    const middleware = getSetJsonWebTokenExpiryInfoMiddleware(expiresIn, unitOfTime)
    middleware(request, response, next)
    expect(response.locals.expiry.expiresIn).toEqual(expiresIn)
    expect(response.locals.expiry.unitOfTime).toEqual(unitOfTime)
    expect(next).toBeCalledWith()
  })

  test('that on error next is called with error', () => {
    expect.assertions(1)
    const expiresIn = 233993
    const unitOfTime = 'seconds'
    const request: any = {}
    const response: any = {}
    const next = jest.fn()
    const middleware = getSetJsonWebTokenExpiryInfoMiddleware(expiresIn, unitOfTime)
    middleware(request, response, next)
    expect(next).toBeCalledWith(new TypeError("Cannot set property 'expiry' of undefined"))
  })

})

describe('setJsonWebTokenMiddleware', () => {

  const ERROR_MESSAGE = 'error';
  test('should set response.locals.token', () => {
    const minimumUserData = { userName: 'user' };
    const expiry = { expiresIn: 123 }
    const signTokenMock = jest.fn(() => true);
    const jwtSecretMock = '1234';
    const response: any = { locals: { minimumUserData, expiry } };
    const request: any = {};
    const next = jest.fn();

    const middleware = getSetJsonWebTokenMiddleware(signTokenMock, jwtSecretMock);
    middleware(request, response, next);

    expect.assertions(3);
    expect(signTokenMock).toBeCalledWith({ minimumUserData }, jwtSecretMock, { expiresIn: expiry.expiresIn });
    expect(response.locals.jsonWebToken).toBeDefined();
    expect(next).toBeCalled();
  });

  test('should call next with an error on failure', () => {

    const signTokenMock = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const expiry = { expiresIn: 123 }
    const minimumUserData = { userName: 'user' };
    const jwtSecretMock = '1234';

    const response: any = { locals: { minimumUserData, expiry } };
    const request: any = {};
    const next = jest.fn();

    const middleware = getSetJsonWebTokenMiddleware(signTokenMock, jwtSecretMock);
    middleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
  });

});

describe(`loginSuccessfulMiddleware`, () => {

  const ERROR_MESSAGE = "error";
  const loginSuccessMessage = 'success'

  test("should send login success message", () => {

    const send = jest.fn()
    const status = jest.fn(() => ({ send }))
    const mockToken = '1234'
    const response: any = { locals: { jsonWebToken: mockToken }, status };

    const request: any = {}
    const next = jest.fn();


    const middleware = getLoginSuccessfulMiddleware(loginSuccessMessage);
    middleware(request, response, next)

    expect.assertions(3);
    expect(next).not.toBeCalled()
    expect(status).toBeCalledWith(ResponseCodes.success)
    expect(send).toBeCalledWith({ message: loginSuccessMessage, jsonWebToken: mockToken })
  });

  test("should call next with an error on failure", () => {

    const mockToken = '1234'
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE)
    })
    const status = jest.fn(() => ({ send }))
    const response: any = { status, locals: { jsonWebToken: mockToken } };

    const request: any = {}
    const next = jest.fn();

    const middleware = getLoginSuccessfulMiddleware(loginSuccessMessage);
    middleware(request, response, next)

    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(ERROR_MESSAGE))
  })

});

describe(`loginMiddlewares`, () => {
  test("that login middlewares are defined in the correct order", async () => {
    expect.assertions(9);
    expect(loginMiddlewares[0]).toBe(loginRequestValidationMiddleware)
    expect(loginMiddlewares[1]).toBe(retreiveUserWithEmailMiddleware)
    expect(loginMiddlewares[2]).toBe(userExistsValidationMiddleware)
    expect(loginMiddlewares[3]).toBe(compareRequestPasswordToUserHashedPasswordMiddleware)
    expect(loginMiddlewares[4]).toBe(passwordsMatchValidationMiddleware)
    expect(loginMiddlewares[5]).toBe(setMinimumUserDataMiddleware)
    expect(loginMiddlewares[6]).toBe(setJsonWebTokenExpiryInfoMiddleware)
    expect(loginMiddlewares[7]).toBe(setJsonWebTokenMiddleware)
    expect(loginMiddlewares[8]).toBe(loginSuccessfulMiddleware)
  });

});
