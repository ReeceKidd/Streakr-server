import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  completeGroupMemberStreakTaskQueryValidationMiddleware,
  getRetreiveCompleteGroupMemberStreakTasksMiddleware,
  sendCompleteGroupMemberStreakTasksResponseMiddleware,
  getCompleteGroupMemberStreakTasksMiddlewares,
  retreiveCompleteGroupMemberStreakTasksMiddleware
} from "./getCompleteGroupMemberStreakTasksMiddlewares";

describe("completeGroupMemberStreakTaskQueryValidationMiddleware", () => {
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

    completeGroupMemberStreakTaskQueryValidationMiddleware(
      request,
      response,
      next
    );

    expect(next).toBeCalled();
  });

  test("allows groupStreakId as a query paramater", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: {
        groupStreakId: "groupStreakId"
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeGroupMemberStreakTaskQueryValidationMiddleware(
      request,
      response,
      next
    );

    expect(next).toBeCalled();
  });

  test("allows groupMemberStreakId as a query paramater", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: {
        groupMemberStreakId: "groupMemberStreakId"
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeGroupMemberStreakTaskQueryValidationMiddleware(
      request,
      response,
      next
    );

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

    completeGroupMemberStreakTaskQueryValidationMiddleware(
      request,
      response,
      next
    );

    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({
      message: '"unsupportedQuery" is not allowed'
    });
    expect(next).not.toBeCalled();
  });
});

describe("getRetreiveCompleteGroupMemberStreakTasksMiddleware", () => {
  test("queries completeGroupMemberStreakTask model and sets response.locals.completeGroupMemberStreakTasks with just userId", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const completeGroupMemberStreakTaskModel = {
      find
    };
    const userId = "userId";
    const request: any = { query: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
      completeGroupMemberStreakTaskModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ userId });
    expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("queries completeGroupMemberStreakTask model and sets response.locals.completeGroupMemberStreakTasks with just groupStreakId", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const completeGroupMemberStreakTaskModel = {
      find
    };
    const groupStreakId = "groupStreakId";
    const request: any = { query: { groupStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
      completeGroupMemberStreakTaskModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ groupStreakId });
    expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("queries completeGroupMemberStreakTask model and sets response.locals.completeGroupMemberStreakTasks with just groupMemberStreakId", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const completeGroupMemberStreakTaskModel = {
      find
    };
    const groupMemberStreakId = "groupMemberStreakId";
    const request: any = { query: { groupMemberStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
      completeGroupMemberStreakTaskModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ groupMemberStreakId });
    expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("queries completeGroupMemberStreakTask model and sets response.locals.completeGroupMemberStreakTasks with both a userId, groupStreakId, and groupMemberStreakId", async () => {
    expect.assertions(3);

    const find = jest.fn().mockResolvedValue(true);
    const completeGroupMemberStreakTaskModel = {
      find
    };
    const userId = "userId";
    const groupStreakId = "groupStreakId";
    const groupMemberStreakId = "groupMemberStreakId";
    const request: any = {
      query: { userId, groupStreakId, groupMemberStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
      completeGroupMemberStreakTaskModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ userId, groupStreakId, groupMemberStreakId });
    expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("queries completeGroupMemberStreakTask model and sets response.locals.completeGroupMemberStreakTasks with no query paramaters", async () => {
    expect.assertions(3);

    const find = jest.fn(() => Promise.resolve(true));
    const completeGroupMemberStreakTaskModel = {
      find
    };
    const request: any = { query: {} };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
      completeGroupMemberStreakTaskModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({});
    expect(response.locals.completeGroupMemberStreakTasks).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with GetCompleteGroupMemberStreakTasksMiddleware error on middleware failure", async () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = {};
    const next = jest.fn();

    const middleware = getRetreiveCompleteGroupMemberStreakTasksMiddleware(
      {} as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.GetCompleteGroupMemberStreakTasksMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("sendCompleteGroupMemberStreakTaskDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(3);

    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const completeGroupMemberStreakTasks = true;
    const response: any = {
      status,
      locals: { completeGroupMemberStreakTasks }
    };
    const next = jest.fn();

    sendCompleteGroupMemberStreakTasksResponseMiddleware(
      request,
      response,
      next
    );

    expect(status).toBeCalledWith(200);
    expect(send).toBeCalledWith({ completeGroupMemberStreakTasks });
    expect(next).not.toBeCalled();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    sendCompleteGroupMemberStreakTasksResponseMiddleware(
      request,
      response,
      next
    );

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendCompleteGroupMemberStreakTasksResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("getCompleteGroupMemberStreakTaskMiddlewares", () => {
  test("that getCompleteGroupMemberStreakTaskMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(getCompleteGroupMemberStreakTasksMiddlewares.length).toEqual(3);
    expect(getCompleteGroupMemberStreakTasksMiddlewares[0]).toEqual(
      completeGroupMemberStreakTaskQueryValidationMiddleware
    );
    expect(getCompleteGroupMemberStreakTasksMiddlewares[1]).toEqual(
      retreiveCompleteGroupMemberStreakTasksMiddleware
    );
    expect(getCompleteGroupMemberStreakTasksMiddlewares[2]).toEqual(
      sendCompleteGroupMemberStreakTasksResponseMiddleware
    );
  });
});
