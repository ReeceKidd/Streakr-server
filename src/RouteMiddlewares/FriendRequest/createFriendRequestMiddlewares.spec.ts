import {
  createFriendRequestBodyValidationMiddleware,
  getRetreiveRequesterMiddleware,
  getRetreiveRequesteeMiddleware,
  requesteeIsAlreadyAFriendMiddleware,
  getSaveFriendRequestToDatabaseMiddleware,
  sendFriendRequestMiddleware,
  createFriendRequestMiddlewares,
  retreiveRequesterMiddleware,
  retreiveRequesteeMiddleware,
  saveFriendRequestToDatabaseMiddleware
} from "./createFriendRequestMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { FriendRequestStatus } from "@streakoid/streakoid-sdk/lib";

describe(`createFriendRequestBodyValidationMiddleware`, () => {
  const requesterId = "requesterId";
  const requesteeId = "requesteeId";

  const body = {
    requesterId,
    requesteeId
  };

  test("valid request passes validation", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createFriendRequestBodyValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends requesterId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, requesterId: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createFriendRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "requesterId" fails because ["requesterId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends requesteeId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, requesteeId: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createFriendRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "requesteeId" fails because ["requesteeId" is required]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("retreiveRequesterMiddleware", () => {
  test("sets response.locals.requester and calls next()", async () => {
    expect.assertions(4);
    const lean = jest.fn(() => true);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const requesterId = "abcdefg";
    const request: any = { body: { requesterId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveRequesterMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(response.locals.requester).toBeDefined();
    expect(findOne).toBeCalledWith({ _id: requesterId });
    expect(lean).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws RequesterDoesNotExistError when requester does not exist", async () => {
    expect.assertions(1);
    const requesterId = "abcd";
    const lean = jest.fn(() => false);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const request: any = { body: { requesterId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveRequesterMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.RequesterDoesNotExist)
    );
  });

  test("throws RetreiveRequesterMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const requesterId = "abcd";
    const findOne = jest.fn(() => ({}));
    const userModel = { findOne };
    const request: any = { body: { requesterId } };
    const response: any = { status, locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveRequesterMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.RetreiveRequesterMiddleware, expect.any(Error))
    );
  });
});

describe("retreiveRequesteeMiddleware", () => {
  test("sets response.locals.requestee and calls next()", async () => {
    expect.assertions(4);
    const lean = jest.fn(() => true);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const requesteeId = "abcdefg";
    const request: any = { body: { requesteeId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveRequesteeMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(response.locals.requestee).toBeDefined();
    expect(findOne).toBeCalledWith({ _id: requesteeId });
    expect(lean).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws RequesteeDoesNotExistError when requester does not exist", async () => {
    expect.assertions(1);
    const requesteeId = "abcd";
    const lean = jest.fn(() => false);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const request: any = { body: { requesteeId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveRequesteeMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.RequesteeDoesNotExist)
    );
  });

  test("throws RetreiveRequesteeMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const requesteeId = "abcd";
    const findOne = jest.fn(() => ({}));
    const userModel = { findOne };
    const request: any = { body: { requesteeId } };
    const response: any = { status, locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveRequesteeMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.RetreiveRequesteeMiddleware, expect.any(Error))
    );
  });
});

describe("requesteeIsAlreadyAFriendMiddleware", () => {
  test("calls next if friend does not exist on requesters friend list", () => {
    expect.assertions(1);

    const friendId = "friendId";
    const friends = ["friend1", "friend2", "friend3"];
    const requester = {
      friends
    };

    const request: any = { body: { friendId } };
    const response: any = { locals: { requester } };
    const next = jest.fn();

    requesteeIsAlreadyAFriendMiddleware(request, response, next);

    expect(next).toBeCalledWith();
  });

  test("throws RequesteeIsAlreadyAFriend error if friend already exists on requesters friend list", () => {
    expect.assertions(1);

    const requesteeId = "friend1";
    const friends = [requesteeId, "friend2", "friend3"];
    const requester = {
      friends
    };

    const request: any = { body: { requesteeId } };
    const response: any = { locals: { requester } };
    const next = jest.fn();

    requesteeIsAlreadyAFriendMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.RequesteeIsAlreadyAFriend)
    );
  });

  test("throws RequesteeIsAlreadyAFriend error on middleware failure", () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = {};
    const next = jest.fn();

    requesteeIsAlreadyAFriendMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.RequesteeIsAlreadyAFriendMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`saveFriendRequestToDatabaseMiddleware`, () => {
  test("sets response.locals.friendRequest and calls next", async () => {
    expect.assertions(3);
    const requesterId = "requesterId";
    const requesteeId = "requesteeId";
    const save = jest.fn(() => Promise.resolve(true));
    class FriendRequestModel {
      requesterId: string;
      requesteeId: string;

      constructor(requesterId: string, requesteeId: string) {
        this.requesterId = requesterId;
        this.requesteeId = requesteeId;
      }

      save() {
        return save();
      }
    }
    const request: any = { body: { requesterId, requesteeId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getSaveFriendRequestToDatabaseMiddleware(
      FriendRequestModel as any
    );

    await middleware(request, response, next);

    expect(response.locals.friendRequest).toBeDefined();
    expect(save).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws SaveFriendRequestToDatabase error on Middleware failure", async () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSaveFriendRequestToDatabaseMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SaveFriendRequestToDatabaseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`sendFriendRequestMiddleware`, () => {
  test("responds with status 201 and sends friendRequest", async () => {
    expect.assertions(3);
    const friendRequest = {
      _id: "_id",
      requesterId: "requesterId",
      requesteeId: "requesteeId",
      status: FriendRequestStatus.pending
    };
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { friendRequest }, status };
    const request: any = {};
    const next = jest.fn();

    await sendFriendRequestMiddleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith(friendRequest);
  });

  test("calls next with SendFriendRequestMiddleware error on middleware failure", () => {
    expect.assertions(1);

    const response: any = {};

    const request: any = {};
    const next = jest.fn();

    sendFriendRequestMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendFriendRequestMiddleware, expect.any(Error))
    );
  });
});

describe(`createFriendRequestMiddlewares`, () => {
  test("are defined in the correct order", async () => {
    expect.assertions(6);

    expect(createFriendRequestMiddlewares.length).toEqual(5);
    expect(createFriendRequestMiddlewares[0]).toBe(
      createFriendRequestBodyValidationMiddleware
    );
    expect(createFriendRequestMiddlewares[1]).toBe(retreiveRequesterMiddleware);
    expect(createFriendRequestMiddlewares[2]).toBe(retreiveRequesteeMiddleware);
    expect(createFriendRequestMiddlewares[3]).toBe(
      saveFriendRequestToDatabaseMiddleware
    );
    expect(createFriendRequestMiddlewares[4]).toBe(sendFriendRequestMiddleware);
  });
});
