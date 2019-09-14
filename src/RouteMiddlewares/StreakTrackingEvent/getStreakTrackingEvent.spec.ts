import {
  getStreakTrackingEventMiddlewares,
  retreiveStreakTrackingEventMiddleware,
  getRetreiveStreakTrackingEventMiddleware,
  sendStreakTrackingEventMiddleware,
  getStreakTrackingEventParamsValidationMiddleware,
  getSendStreakTrackingEventMiddleware
} from "./getStreakTrackingEventMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { ErrorType, CustomError } from "../../customError";

describe(`getStreakTrackingEventParamsValidationMiddleware`, () => {
  const streakTrackingEventId = "12345678";

  test("calls next() when correct params are supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { streakTrackingEventId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getStreakTrackingEventParamsValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends error response when streakTrackingEventId is missing", () => {
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

    getStreakTrackingEventParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "streakTrackingEventId" fails because ["streakTrackingEventId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends error response when streakTrackingEventId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { streakTrackingEventId: 1234 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getStreakTrackingEventParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "streakTrackingEventId" fails because ["streakTrackingEventId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("retreiveStreakTrackingEventMiddleware", () => {
  test("sets response.locals.streakTrackingEvent", async () => {
    expect.assertions(3);
    const lean = jest.fn(() => Promise.resolve(true));
    const findOne = jest.fn(() => ({ lean }));
    const streakTrackingEventModel = {
      findOne
    };
    const streakTrackingEventId = "abcd";
    const request: any = { params: { streakTrackingEventId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveStreakTrackingEventMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ _id: streakTrackingEventId });
    expect(response.locals.streakTrackingEvent).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws GetStreakTrackingEventNoStreakTrackingEventFound when solo streak is not found", async () => {
    expect.assertions(1);
    const lean = jest.fn(() => Promise.resolve(false));
    const findOne = jest.fn(() => ({ lean }));
    const streakTrackingEventModel = {
      findOne
    };
    const streakTrackingEventId = "abcd";
    const request: any = { params: { streakTrackingEventId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveStreakTrackingEventMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.GetStreakTrackingEventNoStreakTrackingEventFound
      )
    );
  });

  test("calls next with RetreiveStreakTrackingEventMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const errorMessage = "error";
    const lean = jest.fn(() => Promise.reject(errorMessage));
    const findOne = jest.fn(() => ({ lean }));
    const streakTrackingEventModel = {
      findOne
    };
    const streakTrackingEventId = "abcd";
    const request: any = { params: { streakTrackingEventId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveStreakTrackingEventMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.RetreiveStreakTrackingEventMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("sendStreakTrackingEventMiddleware", () => {
  test("sends streakTrackingEvent", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const streakTrackingEvent = { _id: "abc" };
    const request: any = {};
    const response: any = { locals: { streakTrackingEvent }, status };
    const next = jest.fn();
    const resourceCreatedCode = 401;
    const middleware = getSendStreakTrackingEventMiddleware(
      resourceCreatedCode
    );

    middleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(resourceCreatedCode);
    expect(send).toBeCalledWith(streakTrackingEvent);
  });

  test("calls next with SendStreakTrackingEventMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const error = "error";
    const send = jest.fn(() => Promise.reject(error));
    const status = jest.fn(() => ({ send }));
    const response: any = { status };
    const next = jest.fn();
    const resourceCreatedResponseCode = 401;
    const middleware = getSendStreakTrackingEventMiddleware(
      resourceCreatedResponseCode
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendStreakTrackingEventMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("getStreakTrackingEventMiddlewares", () => {
  test("that getStreakTrackingEventMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(getStreakTrackingEventMiddlewares.length).toEqual(3);
    expect(getStreakTrackingEventMiddlewares[0]).toEqual(
      getStreakTrackingEventParamsValidationMiddleware
    );
    expect(getStreakTrackingEventMiddlewares[1]).toEqual(
      retreiveStreakTrackingEventMiddleware
    );
    expect(getStreakTrackingEventMiddlewares[2]).toEqual(
      sendStreakTrackingEventMiddleware
    );
  });
});
