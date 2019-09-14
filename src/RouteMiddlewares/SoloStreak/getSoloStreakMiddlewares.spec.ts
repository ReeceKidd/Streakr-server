import {
  getSoloStreakMiddlewares,
  retreiveSoloStreakMiddleware,
  getRetreiveSoloStreakMiddleware,
  sendSoloStreakMiddleware,
  getSoloStreakParamsValidationMiddleware,
  getSendSoloStreakMiddleware
} from "./getSoloStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { ErrorType, CustomError } from "../../customError";

describe(`getSoloStreakParamsValidationMiddleware`, () => {
  const soloStreakId = "12345678";

  test("calls next() when correct params are supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { soloStreakId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getSoloStreakParamsValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends error response when soloStreakId is missing", () => {
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

    getSoloStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "soloStreakId" fails because ["soloStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends error response when soloStreakId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { soloStreakId: 1234 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getSoloStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "soloStreakId" fails because ["soloStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("retreiveSoloStreakMiddleware", () => {
  test("sets response.locals.soloStreak", async () => {
    expect.assertions(3);
    const lean = jest.fn(() => Promise.resolve(true));
    const findOne = jest.fn(() => ({ lean }));
    const soloStreakModel = {
      findOne
    };
    const soloStreakId = "abcd";
    const request: any = { params: { soloStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveSoloStreakMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ _id: soloStreakId });
    expect(response.locals.soloStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws GetSoloStreakNoSoloStreakFound when solo streak is not found", async () => {
    expect.assertions(1);
    const lean = jest.fn(() => Promise.resolve(false));
    const findOne = jest.fn(() => ({ lean }));
    const soloStreakModel = {
      findOne
    };
    const soloStreakId = "abcd";
    const request: any = { params: { soloStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveSoloStreakMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.GetSoloStreakNoSoloStreakFound)
    );
  });

  test("calls next with RetreiveSoloStreakMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const errorMessage = "error";
    const lean = jest.fn(() => Promise.reject(errorMessage));
    const findOne = jest.fn(() => ({ lean }));
    const soloStreakModel = {
      findOne
    };
    const soloStreakId = "abcd";
    const request: any = { params: { soloStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveSoloStreakMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.RetreiveSoloStreakMiddleware, expect.any(Error))
    );
  });
});

describe("sendSoloStreakMiddleware", () => {
  test("sends soloStreak", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const soloStreak = { _id: "abc" };
    const request: any = {};
    const response: any = { locals: { soloStreak }, status };
    const next = jest.fn();
    const resourceCreatedCode = 401;
    const middleware = getSendSoloStreakMiddleware(resourceCreatedCode);

    middleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(resourceCreatedCode);
    expect(send).toBeCalledWith(soloStreak);
  });

  test("calls next with SendSoloStreakMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const error = "error";
    const send = jest.fn(() => Promise.reject(error));
    const status = jest.fn(() => ({ send }));
    const response: any = { status };
    const next = jest.fn();
    const resourceCreatedResponseCode = 401;
    const middleware = getSendSoloStreakMiddleware(resourceCreatedResponseCode);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendSoloStreakMiddleware, expect.any(Error))
    );
  });
});

describe("getSoloStreakMiddlewares", () => {
  test("that getSoloStreakMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(getSoloStreakMiddlewares.length).toEqual(3);
    expect(getSoloStreakMiddlewares[0]).toEqual(
      getSoloStreakParamsValidationMiddleware
    );
    expect(getSoloStreakMiddlewares[1]).toEqual(retreiveSoloStreakMiddleware);
    expect(getSoloStreakMiddlewares[2]).toEqual(sendSoloStreakMiddleware);
  });
});
