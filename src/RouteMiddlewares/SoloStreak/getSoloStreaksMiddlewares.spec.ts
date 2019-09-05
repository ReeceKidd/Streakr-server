import {
  getSoloStreaksMiddlewares,
  getSoloStreaksQueryValidationMiddleware,
  getFindSoloStreaksMiddleware,
  findSoloStreaksMiddleware,
  sendSoloStreaksMiddleware
} from "./getSoloStreaksMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("getSoloStreaksValidationMiddleware", () => {
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

    getSoloStreaksQueryValidationMiddleware(request, response, next);

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

    getSoloStreaksQueryValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("findSoloStreaksMiddleware", () => {
  test("queries database with just userId and sets response.locals.soloStreaks", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = {
      find
    };
    const userId = "1234";
    const request: any = { query: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindSoloStreaksMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ userId });
    expect(response.locals.soloStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just timezone and sets response.locals.soloStreaks", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = {
      find
    };
    const timezone = "Europe/London";
    const request: any = { query: { timezone } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindSoloStreaksMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ timezone });
    expect(response.locals.soloStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just completedToday as a boolean and sets response.locals.soloStreaks", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = {
      find
    };
    const completedToday = "true";
    const request: any = { query: { completedToday } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindSoloStreaksMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ completedToday: true });
    expect(response.locals.soloStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just active as a boolean and sets response.locals.soloStreaks", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = {
      find
    };
    const active = "true";
    const request: any = { query: { active } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindSoloStreaksMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ active: true });
    expect(response.locals.soloStreaks).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("calls next with FindSoloStreaksMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const ERROR_MESSAGE = "error";
    const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
    const soloStreakModel = {
      find
    };
    const request: any = { query: { userId: "1234" } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindSoloStreaksMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.FindSoloStreaksMiddleware, expect.any(Error))
    );
  });
});

describe("sendSoloStreaksMiddleware", () => {
  test("sends soloStreaks in response", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const soloStreaks = [
      {
        name: "30 minutes reading",
        description: "Read for 30 minutes everyday",
        userId: "1234"
      }
    ];
    const response: any = { locals: { soloStreaks }, status };
    const next = jest.fn();

    sendSoloStreaksMiddleware(request, response, next);

    expect.assertions(3);
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.success);
    expect(send).toBeCalledWith({ soloStreaks });
  });

  test("calls next with SendSoloStreaksMiddleware on middleware failure", () => {
    expect.assertions(1);
    const ERROR_MESSAGE = "sendSoloStreaks error";
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: {}, status };
    const request: any = {};
    const next = jest.fn();

    sendSoloStreaksMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendSoloStreaksMiddleware, expect.any(Error))
    );
  });
});

describe(`getSoloStreaksMiddlewares`, () => {
  test("that getSoloStreaksMiddlewares are defined in the correct order", async () => {
    expect.assertions(3);

    expect(getSoloStreaksMiddlewares[0]).toBe(
      getSoloStreaksQueryValidationMiddleware
    );
    expect(getSoloStreaksMiddlewares[1]).toBe(findSoloStreaksMiddleware);
    expect(getSoloStreaksMiddlewares[2]).toBe(sendSoloStreaksMiddleware);
  });
});
