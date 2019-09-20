import {
  getAllGroupMemberStreaksMiddlewares,
  getGroupMemberStreaksQueryValidationMiddleware,
  getFindGroupMemberStreaksMiddleware,
  findGroupMemberStreaksMiddleware,
  sendGroupMemberStreaksMiddleware
} from "./getAllGroupMemberStreaksMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("getGroupMemberStreaksValidationMiddleware", () => {
  test("passes valid request", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: { userId: "1234" }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getGroupMemberStreaksQueryValidationMiddleware(request, response, next);

    expect(next).toBeCalledWith();
  });

  test("sends userId cannot be a number error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: { userId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getGroupMemberStreaksQueryValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("findGroupMemberStreaksMiddleware", () => {
  test("queries database with just userId and sets response.locals.groupMemberStreaks", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const groupMemberStreakModel = {
      find
    };
    const userId = "1234";
    const request: any = { query: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindGroupMemberStreaksMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ userId });
    expect(response.locals.groupMemberStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just timezone and sets response.locals.groupMemberStreaks", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const groupMemberStreakModel = {
      find
    };
    const timezone = "Europe/London";
    const request: any = { query: { timezone } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindGroupMemberStreaksMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ timezone });
    expect(response.locals.groupMemberStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just completedToday as a boolean and sets response.locals.groupMemberStreaks", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const groupMemberStreakModel = {
      find
    };
    const completedToday = "true";
    const request: any = { query: { completedToday } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindGroupMemberStreaksMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ completedToday: true });
    expect(response.locals.groupMemberStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just active as a boolean and sets response.locals.groupMemberStreaks", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const groupMemberStreakModel = {
      find
    };
    const active = "true";
    const request: any = { query: { active } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindGroupMemberStreaksMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ active: true });
    expect(response.locals.groupMemberStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("calls next with FindGroupMemberStreaksMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const ERROR_MESSAGE = "error";
    const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
    const groupMemberStreakModel = {
      find
    };
    const request: any = { query: { userId: "1234" } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindGroupMemberStreaksMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.FindGroupMemberStreaksMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("sendGroupMemberStreaksMiddleware", () => {
  test("sends groupMemberStreaks in response", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const groupMemberStreaks = [
      {
        name: "30 minutes reading",
        description: "Read for 30 minutes everyday",
        userId: "1234"
      }
    ];
    const response: any = { locals: { groupMemberStreaks }, status };
    const next = jest.fn();

    sendGroupMemberStreaksMiddleware(request, response, next);

    expect.assertions(3);
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.success);
    expect(send).toBeCalledWith(groupMemberStreaks);
  });

  test("calls next with SendGroupMemberStreaksMiddleware on middleware failure", () => {
    expect.assertions(1);
    const ERROR_MESSAGE = "sendGroupMemberStreaks error";
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: {}, status };
    const request: any = {};
    const next = jest.fn();

    sendGroupMemberStreaksMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendGroupMemberStreaksMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`getAllGroupMemberStreaksMiddlewares`, () => {
  test("that getGroupMemberStreaksMiddlewares are defined in the correct order", async () => {
    expect.assertions(3);

    expect(getAllGroupMemberStreaksMiddlewares[0]).toBe(
      getGroupMemberStreaksQueryValidationMiddleware
    );
    expect(getAllGroupMemberStreaksMiddlewares[1]).toBe(
      findGroupMemberStreaksMiddleware
    );
    expect(getAllGroupMemberStreaksMiddlewares[2]).toBe(
      sendGroupMemberStreaksMiddleware
    );
  });
});
