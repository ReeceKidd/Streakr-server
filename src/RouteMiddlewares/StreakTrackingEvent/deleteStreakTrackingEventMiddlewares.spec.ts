import {
  deleteStreakTrackingEventMiddlewares,
  streakTrackingEventParamsValidationMiddleware,
  deleteStreakTrackingEventMiddleware,
  getDeleteStreakTrackingEventMiddleware,
  sendStreakTrackingEventDeletedResponseMiddleware,
  getSendStreakTrackingEventDeletedResponseMiddleware
} from "./deleteStreakTrackingEventMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("streakTrackingEventParamsValidationMiddleware", () => {
  test("sends streakTrackingEventId is not defined error", () => {
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

    streakTrackingEventParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "streakTrackingEventId" fails because ["streakTrackingEventId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends streakTrackingEventId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { streakTrackingEventId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    streakTrackingEventParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "streakTrackingEventId" fails because ["streakTrackingEventId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("deleteStreakTrackingEventMiddleware", () => {
  test("sets response.locals.deletedStreakTrackingEvent", async () => {
    expect.assertions(3);
    const streakTrackingEventId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
    const streakTrackingEventModel = {
      findByIdAndDelete
    };
    const request: any = { params: { streakTrackingEventId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteStreakTrackingEventMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(findByIdAndDelete).toBeCalledWith(streakTrackingEventId);
    expect(response.locals.deletedStreakTrackingEvent).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoStreakTrackingEventToDeleteFound error when no solo streak is found", async () => {
    expect.assertions(1);
    const streakTrackingEventId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
    const streakTrackingEventModel = {
      findByIdAndDelete
    };
    const request: any = { params: { streakTrackingEventId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteStreakTrackingEventMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.NoStreakTrackingEventToDeleteFound)
    );
  });

  test("calls next with DeleteStreakTrackingEventMiddleware error on failure", async () => {
    expect.assertions(1);
    const streakTrackingEventId = "abc123";
    const error = "error";
    const findByIdAndDelete = jest.fn(() => Promise.reject(error));
    const streakTrackingEventModel = {
      findByIdAndDelete
    };
    const request: any = { params: { streakTrackingEventId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteStreakTrackingEventMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.DeleteStreakTrackingEventMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("sendStreakTrackingEventDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();
    const middleware = getSendStreakTrackingEventDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(status).toBeCalledWith(successfulDeletionResponseCode);
    expect(next).not.toBeCalled();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const successfulDeletionResponseCode = 204;
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSendStreakTrackingEventDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendStreakTrackingEventDeletedResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteStreakTrackingEventMiddlewares", () => {
  test("that deleteStreakTrackingEventMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(deleteStreakTrackingEventMiddlewares.length).toEqual(3);
    expect(deleteStreakTrackingEventMiddlewares[0]).toEqual(
      streakTrackingEventParamsValidationMiddleware
    );
    expect(deleteStreakTrackingEventMiddlewares[1]).toEqual(
      deleteStreakTrackingEventMiddleware
    );
    expect(deleteStreakTrackingEventMiddlewares[2]).toEqual(
      sendStreakTrackingEventDeletedResponseMiddleware
    );
  });
});
