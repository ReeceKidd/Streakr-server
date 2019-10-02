import {
  getAllFriendRequestsMiddlewares,
  getFriendRequestsQueryValidationMiddleware,
  getFindFriendRequestsMiddleware,
  findFriendRequestsMiddleware,
  sendFriendRequestsMiddleware
} from "./getAllFriendRequestsMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("getFriendRequestsValidationMiddleware", () => {
  const query = {
    requesterId: "requesterId",
    requesteeId: "requesteeId",
    status: "status"
  };

  test("valid request passes", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getFriendRequestsQueryValidationMiddleware(request, response, next);

    expect(next).toBeCalledWith();
  });

  test("sends requesterId cannot be a number error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: { requesterId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getFriendRequestsQueryValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "requesterId" fails because ["requesterId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends requesteeId cannot be a number error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: { requesteeId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getFriendRequestsQueryValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "requesteeId" fails because ["requesteeId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends status cannot be a number error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      query: { status: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getFriendRequestsQueryValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "status" fails because ["status" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("findFriendRequestsMiddleware", () => {
  test("queries database with just requesterId and sets response.locals.friendRequests", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const friendRequestModel = {
      find
    };
    const requesterId = "1234";
    const request: any = { query: { requesterId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindFriendRequestsMiddleware(
      friendRequestModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ requesterId });
    expect(response.locals.friendRequests).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just requesteeId and sets response.locals.friendRequests", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const friendRequestModel = {
      find
    };
    const requesteeId = "requesteeId";
    const request: any = { query: { requesteeId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindFriendRequestsMiddleware(
      friendRequestModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ requesteeId });
    expect(response.locals.friendRequests).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("queries database with just status and sets response.locals.friendRequests", async () => {
    expect.assertions(3);
    const find = jest.fn(() => Promise.resolve(true));
    const friendRequestModel = {
      find
    };
    const status = "pending";
    const request: any = { query: { status } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getFindFriendRequestsMiddleware(
      friendRequestModel as any
    );

    await middleware(request, response, next);

    expect(find).toBeCalledWith({ status });
    expect(response.locals.friendRequests).toEqual(true);
    expect(next).toBeCalledWith();
  });

  test("calls next with FindFriendRequestsMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const friendRequestModel = {};
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getFindFriendRequestsMiddleware(
      friendRequestModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.FindFriendRequestsMiddleware, expect.any(Error))
    );
  });
});

describe("sendFriendRequestsMiddleware", () => {
  test("sends friendRequests in response", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const friendRequests = [
      {
        requesteeId: "requesteeId",
        requesterId: "requesterId",
        status: "pending"
      }
    ];
    const response: any = { locals: { friendRequests }, status };
    const next = jest.fn();

    sendFriendRequestsMiddleware(request, response, next);

    expect.assertions(3);
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.success);
    expect(send).toBeCalledWith(friendRequests);
  });

  test("calls next with SendFriendRequestsMiddleware on middleware failure", () => {
    expect.assertions(1);
    const response: any = {};
    const request: any = {};
    const next = jest.fn();

    sendFriendRequestsMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendFriendRequestsMiddleware, expect.any(Error))
    );
  });
});

describe(`getAllFriendRequestsMiddlewares`, () => {
  test("are in the correct order", async () => {
    expect.assertions(4);

    expect(getAllFriendRequestsMiddlewares.length).toEqual(3);
    expect(getAllFriendRequestsMiddlewares[0]).toBe(
      getFriendRequestsQueryValidationMiddleware
    );
    expect(getAllFriendRequestsMiddlewares[1]).toBe(
      findFriendRequestsMiddleware
    );
    expect(getAllFriendRequestsMiddlewares[2]).toBe(
      sendFriendRequestsMiddleware
    );
  });
});
