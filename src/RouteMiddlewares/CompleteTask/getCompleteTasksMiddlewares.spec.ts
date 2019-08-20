import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  completeTaskQueryValidationMiddleware,
  getRetreiveCompleteTasksMiddleware,
  sendCompleteTasksResponseMiddleware,
  getCompleteTasksMiddlewares,
  retreiveCompleteTasksMiddleware
} from "./getCompleteTasksMiddlewares";

describe("completeTaskQueryValidationMiddleware", () => {
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

    completeTaskQueryValidationMiddleware(request, response, next);

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

    completeTaskQueryValidationMiddleware(request, response, next);

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

    completeTaskQueryValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({
      message: '"unsupportedQuery" is not allowed'
    });
    expect(next).not.toBeCalled();
  });
});

describe("getCompleteTaskMiddleware", () => {
  test("sets response.locals.completeTasks", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const completeTaskModel = {
      find
    };
    const userId = "userId";
    const streakId = "streakId";
    const request: any = { query: { userId, streakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveCompleteTasksMiddleware(
      completeTaskModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ userId, streakId });
    expect(response.locals.completeTasks).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with GetCompleteTasksMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const completeTaskId = "abc123";
    const error = "error";
    const findByIdAndDelete = jest.fn(() => Promise.reject(error));
    const completeTaskModel = {};
    const request: any = { params: { completeTaskId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveCompleteTasksMiddleware(
      completeTaskModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.GetCompleteTasksMiddleware, expect.any(Error))
    );
  });
});

describe("sendCompleteTaskDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(3);

    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const completeTasks = true;
    const response: any = { status, locals: { completeTasks } };
    const next = jest.fn();

    sendCompleteTasksResponseMiddleware(request, response, next);

    expect(status).toBeCalledWith(200);
    expect(send).toBeCalledWith({ completeTasks });
    expect(next).not.toBeCalled();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const successfulDeletionResponseCode = 204;
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    sendCompleteTasksResponseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendCompleteTasksResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("getCompleteTaskMiddlewares", () => {
  test("that getCompleteTaskMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(getCompleteTasksMiddlewares.length).toEqual(3);
    expect(getCompleteTasksMiddlewares[0]).toEqual(
      completeTaskQueryValidationMiddleware
    );
    expect(getCompleteTasksMiddlewares[1]).toEqual(
      retreiveCompleteTasksMiddleware
    );
    expect(getCompleteTasksMiddlewares[2]).toEqual(
      sendCompleteTasksResponseMiddleware
    );
  });
});
