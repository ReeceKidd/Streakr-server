import {
  userParamsValidationMiddleware,
  getRetreiveUserMiddleware,
  sendRetreiveUserResponseMiddleware,
  getUserMiddlewares,
  retreiveUserMiddleware
} from "./getUserMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { ErrorType, CustomError } from "../../customError";

describe(`userParamsValidationMiddleware`, () => {
  const userId = "5d43f0c2f4499975cb312b72";

  test("calls next() when correct params are supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { userId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    userParamsValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends error response when userId is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: {}
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    userParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends error response when userId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { userId: 1234 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    userParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends error response when userId is not 24 characters in length", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { userId: "1234567" }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    userParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "userId" fails because ["userId" length must be 24 characters long]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("retreiveUserMiddleware", () => {
  test("sets response.locals.user", async () => {
    expect.assertions(3);
    const lean = jest.fn(() => Promise.resolve(true));
    const findById = jest.fn(() => ({ lean }));
    const userModel = {
      findById
    };
    const userId = "abcd";
    const request: any = { params: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveUserMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(findById).toBeCalledWith(userId);
    expect(response.locals.user).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoUserFound when user is not found", async () => {
    expect.assertions(1);
    const findById = jest.fn(() => Promise.resolve(false));
    const userModel = {
      findById
    };
    const userId = "abcd";
    const request: any = { params: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveUserMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(new CustomError(ErrorType.NoUserFound));
  });

  test("calls next with GetRetreiveUserMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const errorMessage = "error";
    const lean = jest.fn(() => Promise.reject(errorMessage));
    const findOne = jest.fn(() => ({ lean }));
    const userModel = {
      findOne
    };
    const userId = "abcd";
    const request: any = { params: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveUserMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.RetreiveUserMiddleware, expect.any(Error))
    );
  });
});

describe("sendRetreiveUserResponseMiddleware", () => {
  test("sends user", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const user = { _id: "abc" };
    const request: any = {};
    const response: any = { locals: { user }, status };
    const next = jest.fn();

    sendRetreiveUserResponseMiddleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(200);
    expect(send).toBeCalledWith({ user });
  });

  test("calls next with SendRetreiveUserResponseMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const error = "error";
    const send = jest.fn(() => Promise.reject(error));
    const status = jest.fn(() => ({ send }));
    const response: any = { status };
    const next = jest.fn();

    await sendRetreiveUserResponseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendRetreiveUserResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("getUserMiddlewares", () => {
  test("are defined in the correct order", () => {
    expect.assertions(4);

    expect(getUserMiddlewares.length).toEqual(3);
    expect(getUserMiddlewares[0]).toEqual(userParamsValidationMiddleware);
    expect(getUserMiddlewares[1]).toEqual(retreiveUserMiddleware);
    expect(getUserMiddlewares[2]).toEqual(sendRetreiveUserResponseMiddleware);
  });
});
