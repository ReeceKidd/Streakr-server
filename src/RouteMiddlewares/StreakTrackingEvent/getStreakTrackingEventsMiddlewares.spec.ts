import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  streakTrackingEventQueryValidationMiddleware,
  getRetreiveStreakTrackingEventsMiddleware,
  sendStreakTrackingEventsResponseMiddleware,
  getStreakTrackingEventsMiddlewares,
  retreiveStreakTrackingEventsMiddleware
} from "./getStreakTrackingEventsMiddlewares";

describe("streakTrackingEventQueryValidationMiddleware", () => {
  test("allows type as a query paramater", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: {
        type: "type"
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    streakTrackingEventQueryValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("allows userId as a query paramater", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: {
        userId: "userId"
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    streakTrackingEventQueryValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("allows streakId as a query paramater", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: {
        streakId: "userId"
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    streakTrackingEventQueryValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends unsupported query error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: {
        unsupportedQuery: "unsupportedQuery"
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    streakTrackingEventQueryValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({
      message: '"unsupportedQuery" is not allowed'
    });
    expect(next).not.toBeCalled();
  });
});

describe("getRetreiveStreakTrackingEventsMiddleware", () => {
  test("queries streakTrackingEvent model and sets response.locals.streakTrackingEvents with just userId", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const streakTrackingEventModel = {
      find
    };
    const userId = "userId";
    const request: any = { query: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveStreakTrackingEventsMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ userId });
    expect(response.locals.streakTrackingEvents).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("queries streakTrackingEvent model and sets response.locals.streakTrackingEvents with just streakId", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const streakTrackingEventModel = {
      find
    };
    const streakId = "streakId";
    const request: any = { query: { streakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveStreakTrackingEventsMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ streakId });
    expect(response.locals.streakTrackingEvents).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("queries streakTrackingEvent model and sets response.locals.streakTrackingEvents with both a userId and streakId", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const streakTrackingEventModel = {
      find
    };
    const userId = "userId";
    const streakId = "streakId";
    const request: any = { query: { userId, streakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveStreakTrackingEventsMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ userId, streakId });
    expect(response.locals.streakTrackingEvents).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("queries streakTrackingEvent model and sets response.locals.streakTrackingEvents with no query paramaters", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const streakTrackingEventModel = {
      find
    };
    const request: any = { query: {} };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveStreakTrackingEventsMiddleware(
      streakTrackingEventModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({});
    expect(response.locals.streakTrackingEvents).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with GetStreakTrackingEventsMiddleware error on middleware failure", async () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = {};
    const next = jest.fn();

    const middleware = getRetreiveStreakTrackingEventsMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.GetStreakTrackingEventsMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("sendStreakTrackingEventDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(3);

    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const streakTrackingEvents = true;
    const response: any = { status, locals: { streakTrackingEvents } };
    const next = jest.fn();

    sendStreakTrackingEventsResponseMiddleware(request, response, next);

    expect(status).toBeCalledWith(200);
    expect(send).toBeCalledWith(streakTrackingEvents);
    expect(next).not.toBeCalled();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    sendStreakTrackingEventsResponseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendStreakTrackingEventsResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("getStreakTrackingEventMiddlewares", () => {
  test("that getStreakTrackingEventMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(getStreakTrackingEventsMiddlewares.length).toEqual(3);
    expect(getStreakTrackingEventsMiddlewares[0]).toEqual(
      streakTrackingEventQueryValidationMiddleware
    );
    expect(getStreakTrackingEventsMiddlewares[1]).toEqual(
      retreiveStreakTrackingEventsMiddleware
    );
    expect(getStreakTrackingEventsMiddlewares[2]).toEqual(
      sendStreakTrackingEventsResponseMiddleware
    );
  });
});
