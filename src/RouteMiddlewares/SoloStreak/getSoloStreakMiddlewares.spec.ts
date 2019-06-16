import {
  getSoloStreakMiddlewares,
  retreiveSoloStreakMiddleware,
  getRetreiveSoloStreakMiddleware,
  sendSoloStreakMiddleware,
  getSoloStreakParamsValidationMiddleware,
  getSendSoloStreakMiddleware,
  getSendSoloStreakDoesNotExistErrorMessageMiddleware,
  sendSoloStreakDoesNotExistErrorMessageMiddleware
} from "./getSoloStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";

describe(`getSoloStreakParamsValidationMiddleware`, () => {
  const soloStreakId = "12345678";

  test("that next() is called when correct params are supplied", () => {
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

  test("that correct response is sent when soloStreakId is missing", () => {
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

  test("that error response is sent when soloStreakId is not a string", () => {
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
  test("that response.locals.soloStreak is defined and next() is called", async () => {
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

  test("that on error next() is called with error", async () => {
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
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("sendSoloStreakDoesNotExistErrorResponse", () => {
  test("that correct error response is sent whem soloStreak is not defined", () => {
    expect.assertions(3);
    const doesNotExistErrorResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { locals: {}, status };
    const next = jest.fn();
    const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      doesNotExistErrorResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(status).toBeCalledWith(doesNotExistErrorResponseCode);
    expect(send).toBeCalledWith({
      message: localisedSoloStreakDoesNotExistMessage
    });
    expect(next).not.toBeCalled();
  });

  test("that next is called when soloStreak is defined", () => {
    expect.assertions(1);
    const doesNotExistErrorResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const soloStreak = true;
    const response: any = { locals: { soloStreak }, status };
    const next = jest.fn();
    const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      doesNotExistErrorResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const doesNotExistErrorResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      doesNotExistErrorResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError(
        "Cannot destructure property `soloStreak` of 'undefined' or 'null'."
      )
    );
  });
});

describe("sendSoloStreakMiddleware", () => {
  test("that soloStreak is sent correctly", () => {
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
    expect(send).toBeCalledWith({ ...soloStreak });
  });

  test("that on error next is called with error", async () => {
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
      new TypeError(
        "Cannot destructure property `soloStreak` of 'undefined' or 'null'."
      )
    );
  });
});

describe("getSoloStreakMiddlewares", () => {
  test("that getSoloStreakMiddlewares are defined in the correct order", () => {
    expect.assertions(5);
    expect(getSoloStreakMiddlewares.length).toEqual(4);
    expect(getSoloStreakMiddlewares[0]).toEqual(
      getSoloStreakParamsValidationMiddleware
    );
    expect(getSoloStreakMiddlewares[1]).toEqual(retreiveSoloStreakMiddleware);
    expect(getSoloStreakMiddlewares[2]).toEqual(
      sendSoloStreakDoesNotExistErrorMessageMiddleware
    );
    expect(getSoloStreakMiddlewares[3]).toEqual(sendSoloStreakMiddleware);
  });
});
