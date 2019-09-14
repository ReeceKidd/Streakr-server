import {
  getUsersMiddlewares,
  getUsersValidationMiddleware,
  maximumSearchQueryLength,
  getRetreiveUsersByLowercaseUsernameRegexSearchMiddleware,
  sendFormattedUsersMiddleware,
  retreiveUsersByLowercaseUsernameRegexSearchMiddleware
} from "./getUsersMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe(`getUsersValidationMiddleware`, () => {
  const mockSearchQuery = "searchQuery";

  test("valid request passes", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: { searchQuery: mockSearchQuery }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getUsersValidationMiddleware(request, response, next);

    expect(next).toBeCalledWith();
  });

  test("sends correct response when searchQuery length is too short", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const shortSearchQuery = "";
    const request: any = {
      query: { searchQuery: shortSearchQuery }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getUsersValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({
      message:
        'child "searchQuery" fails because ["searchQuery" is not allowed to be empty]'
    });
    expect(next).not.toBeCalled();
  });

  test(`sends correct response when searchQuery length is longer than ${maximumSearchQueryLength}`, () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const longSearchQuery =
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    const request: any = {
      query: { searchQuery: longSearchQuery }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getUsersValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "searchQuery" fails because ["searchQuery" length must be less than or equal to 64 characters long]'
    });
    expect(next).not.toBeCalled();
  });

  test(`sends correct response when searchQuery is not a string`, () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const numberSearchQuery = 123;
    const request: any = {
      query: { searchQuery: numberSearchQuery }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getUsersValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "searchQuery" fails because ["searchQuery" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("getRetreiveUsersByLowercaseUsernameRegexSearchMiddleware", () => {
  test("retrieves users with searchQuery and sets response.locals.users", async () => {
    expect.assertions(3);
    const searchQuery = "searchQuery";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const find = jest.fn(() => Promise.resolve(true));
    const userModel = { find };
    const request: any = { query: { searchQuery } };
    const response: any = {
      locals: {},
      status
    };
    const next = jest.fn();
    const middleware = getRetreiveUsersByLowercaseUsernameRegexSearchMiddleware(
      userModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({
      username: { $regex: searchQuery.toLowerCase() }
    });
    expect(response.locals.users).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("retrieves users without searchQuery and sets response.locals.users", async () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const find = jest.fn(() => Promise.resolve(true));
    const userModel = { find };
    const request: any = { query: {} };
    const response: any = {
      locals: {},
      status
    };
    const next = jest.fn();
    const middleware = getRetreiveUsersByLowercaseUsernameRegexSearchMiddleware(
      userModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({});
    expect(response.locals.users).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with RetreiveUsersByUsernameRegexSearchMiddleware error on middleware failure", async () => {
    expect.assertions(2);
    const errorMessage = "error";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const find = jest.fn(() => Promise.reject(errorMessage));
    const userModel = { find };
    const request: any = {};
    const response: any = {
      status,
      locals: {}
    };
    const next = jest.fn();
    const middleware = getRetreiveUsersByLowercaseUsernameRegexSearchMiddleware(
      userModel as any
    );

    await middleware(request, response, next);

    expect(response.locals.users).not.toBeDefined();
    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.RetreiveUsersByLowercaseUsernameRegexSearchMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("sendUsersMiddleware", () => {
  test("sends users in response", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const users = ["user"];
    const response: any = { locals: { users }, status };
    const next = jest.fn();

    sendFormattedUsersMiddleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.success);
    expect(send).toBeCalledWith(users);
  });

  test("calls next with SendUsersMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const ERROR_MESSAGE = "sendFormattedUsersMiddleware error";
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: {}, status };
    const request: any = {};
    const next = jest.fn();

    sendFormattedUsersMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendUsersMiddleware, expect.any(Error))
    );
  });
});

describe(`getUsersMiddlewares`, () => {
  test("that getUsersMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(getUsersMiddlewares.length).toEqual(3);
    expect(getUsersMiddlewares[0]).toBe(getUsersValidationMiddleware);
    expect(getUsersMiddlewares[1]).toBe(
      retreiveUsersByLowercaseUsernameRegexSearchMiddleware
    );
    expect(getUsersMiddlewares[2]).toBe(sendFormattedUsersMiddleware);
  });
});
