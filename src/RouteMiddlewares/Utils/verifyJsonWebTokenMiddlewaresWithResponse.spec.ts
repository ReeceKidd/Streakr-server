import { verifyJsonWebTokenMiddlewaresWithResponse } from "./verifyJsonWebTokenMiddlewaresWithResponse";
import { verifyJsonWebTokenMiddlewares } from "./verifyJsonWebTokenMiddlewares";
import { jsonWebTokenVerificationSuccessfulMiddleware } from "./verifyJsonWebTokenMiddlewaresWithResponse";

import { getJsonWebTokenVerificationSuccessfulMiddleware } from "./verifyJsonWebTokenMiddlewaresWithResponse";
import {
  DecodedJsonWebToken,
  VerifyJsonWebTokenResponseLocals
} from "./verifyJsonWebTokenMiddlewares";
import { CustomError, ErrorType } from "../../customError";

describe(`jsonWebTokenVerificationSuccessfulMiddleware`, () => {
  const ERROR_MESSAGE = "error";
  const loginSuccessMessage = "success";

  test("sends login response with decodedJsonWebToken, message and auth flag", () => {
    expect.assertions(2);
    const send = jest.fn();
    const mockToken: DecodedJsonWebToken = {
      minimumUserData: {
        _id: "1234",
        userName: "mock username"
      }
    };
    const verifyJsonWebTokenLocals: VerifyJsonWebTokenResponseLocals = {
      decodedJsonWebToken: mockToken
    };
    const response: any = { locals: verifyJsonWebTokenLocals, send };

    const request: any = {};
    const next = jest.fn();

    const successfulResponse = {
      auth: true,
      message: loginSuccessMessage,
      decodedJsonWebToken: mockToken
    };

    const middleware = getJsonWebTokenVerificationSuccessfulMiddleware(
      loginSuccessMessage
    );
    middleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(send).toBeCalledWith(successfulResponse);
  });

  test("calls next with JsonWebTokenVerificationSuccessMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const mockToken = "1234";
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const response: any = { send, locals: { jsonWebToken: mockToken } };

    const request: any = {};
    const next = jest.fn();

    const middleware = getJsonWebTokenVerificationSuccessfulMiddleware(
      loginSuccessMessage
    );
    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.JsonWebTokenVerificationSuccessfulMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`verifyJsonWebTokenMiddlewaresWithResponse`, () => {
  test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
    expect.assertions(2);
    expect(verifyJsonWebTokenMiddlewaresWithResponse[0]).toBe(
      verifyJsonWebTokenMiddlewares
    );
    expect(verifyJsonWebTokenMiddlewaresWithResponse[1]).toBe(
      jsonWebTokenVerificationSuccessfulMiddleware
    );
  });
});
