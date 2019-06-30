import {
  verifyJsonWebTokenMiddlewares,
  retreiveJsonWebTokenMiddleware,
  getRetreiveJsonWebTokenMiddleware,
  decodeJsonWebTokenMiddleware,
  getDecodeJsonWebTokenMiddleware,
  DecodedJsonWebToken
} from "./verifyJsonWebTokenMiddlewares";
import { SupportedRequestHeaders } from "../../Server/headers";
import { CustomError, ErrorType } from "../../customError";

describe("retreiveJsonWebTokenMiddleware", () => {
  test("sets response.locals.jsonWebToken", () => {
    expect.assertions(2);

    const jsonWebTokenHeaderNameMock = 123;

    const response: any = { locals: {} };
    const request: any = {
      headers: {
        [SupportedRequestHeaders.xAccessToken]: jsonWebTokenHeaderNameMock
      }
    };
    const next = jest.fn();

    const middleware = getRetreiveJsonWebTokenMiddleware(
      SupportedRequestHeaders.xAccessToken
    );
    middleware(request, response, next);

    expect(response.locals.jsonWebToken).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws MissingAccessTokenHeader when x-access-token isn't defined", () => {
    expect.assertions(1);

    const response: any = { locals: {} };
    const request: any = { headers: {} };
    const next = jest.fn();

    const middleware = getRetreiveJsonWebTokenMiddleware(
      SupportedRequestHeaders.xAccessToken
    );
    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.MissingAccessTokenHeader, expect.any(Error))
    );
  });

  test("calls next with RetreiveJsonWebTokenMiddleware error on middleware failure", () => {
    const response: any = { locals: {} };
    const request: any = {};
    const next = jest.fn();

    const middleware = getRetreiveJsonWebTokenMiddleware(
      SupportedRequestHeaders.xAccessToken
    );
    middleware(request, response, next);

    expect.assertions(1);
    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.RetreiveJsonWebTokenMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("decodeJsonWebTokenMiddleware", () => {
  const ERROR_MESSAGE = "error";

  test("sets response.locals.minimumUserData", async () => {
    const tokenMock = "1234";
    const jwtSecretMock = "abc#*";
    const decodedJsonWebToken: DecodedJsonWebToken = {
      minimumUserData: {
        _id: "1234",
        userName: "tester"
      }
    };
    const locals = {
      jsonWebToken: tokenMock,
      decodedJsonWebToken
    };
    const verifyMock = jest.fn(() => decodedJsonWebToken);
    const response: any = { locals };
    const request: any = {};
    const next = jest.fn();

    const middleware = getDecodeJsonWebTokenMiddleware(
      verifyMock,
      jwtSecretMock
    );
    middleware(request, response, next);

    expect.assertions(3);
    expect(verifyMock).toBeCalledWith(tokenMock, jwtSecretMock);
    expect(response.locals.minimumUserData).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with VerifyJsonWebTokenError when verify fails", async () => {
    expect.assertions(1);
    const verifyMock = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const tokenMock = "1234";
    const jwtSecretMock = "1234";

    const response: any = { locals: { jsonWebToken: tokenMock } };
    const request: any = {};
    const next = jest.fn();

    const middleware = getDecodeJsonWebTokenMiddleware(
      verifyMock,
      jwtSecretMock
    );
    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.VerifyJsonWebTokenError, expect.any(Error))
    );
  });

  test("calls next with DecodeJsonWebTokenMiddleware on middleware failure", () => {
    expect.assertions(1);

    const verifyMock = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const jwtSecretMock = "1234";
    const response: any = {};
    const request: any = {};
    const next = jest.fn();

    const middleware = getDecodeJsonWebTokenMiddleware(
      verifyMock,
      jwtSecretMock
    );
    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DecodeJsonWebTokenMiddleware, expect.any(Error))
    );
  });
});

describe(`verifyJsonWebTokenMiddlewares`, () => {
  test("that verfiyJsonWebToken middlewares are defined in the correct order", () => {
    expect.assertions(3);
    expect(verifyJsonWebTokenMiddlewares.length).toEqual(2);
    expect(verifyJsonWebTokenMiddlewares[0]).toBe(
      retreiveJsonWebTokenMiddleware
    );
    expect(verifyJsonWebTokenMiddlewares[1]).toBe(decodeJsonWebTokenMiddleware);
  });
});
