import {
  patchFriendRequestMiddlewares,
  friendRequestRequestBodyValidationMiddleware,
  getPatchFriendRequestMiddleware,
  patchFriendRequestMiddleware,
  sendUpdatedPopulatedFriendRequestMiddleware,
  friendRequestParamsValidationMiddleware,
  populateUpdatedFriendRequestMiddleware,
  getPopulateUpdatedFriendRequestMiddleware
} from "./patchFriendRequestMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import {
  FriendRequest,
  FriendRequestStatus
} from "@streakoid/streakoid-sdk/lib";

describe("friendRequestParamsValidationMiddleware", () => {
  test("sends correct error response when friendRequestId is not defined", () => {
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

    friendRequestParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "friendRequestId" fails because ["friendRequestId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when friendRequestId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { friendRequestId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    friendRequestParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "friendRequestId" fails because ["friendRequestId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("friendRequestRequestBodyValidationMiddleware", () => {
  test("sends correct error response when unsupported key is sent", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { unsupportedKey: 1234 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    friendRequestRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({
      message: '"unsupportedKey" is not allowed'
    });
    expect(next).not.toBeCalled();
  });
});

describe("patchFriendRequestMiddleware", () => {
  test("sets response.locals.updatedFriendRequest", async () => {
    expect.assertions(3);
    const friendRequestId = "abc123";
    const userId = "123cde";
    const streakName = "Daily programming";
    const streakDescription = "Do one hour of programming each day";
    const status = "archived";
    const request: any = {
      params: { friendRequestId },
      body: {
        userId,
        streakName,
        streakDescription,
        status
      }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
    const friendRequestModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchFriendRequestMiddleware(
      friendRequestModel as any
    );

    await middleware(request, response, next);

    expect(findByIdAndUpdate).toBeCalledWith(
      friendRequestId,
      { userId, streakName, streakDescription, status },
      { new: true }
    );
    expect(response.locals.updatedFriendRequest).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws UpdatedFriendRequestNotFound error when solo streak is not found", async () => {
    expect.assertions(1);
    const friendRequestId = "abc123";
    const userId = "123cde";
    const streakName = "Daily programming";
    const streakDescription = "Do one hour of programming each day";
    const request: any = {
      params: { friendRequestId },
      body: {
        userId,
        streakName,
        streakDescription
      }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
    const friendRequestModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchFriendRequestMiddleware(
      friendRequestModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.UpdatedFriendRequestNotFound)
    );
  });

  test("calls next with PatchFriendRequestMiddleware on middleware failure", async () => {
    expect.assertions(1);
    const friendRequestId = "abc123";
    const userId = "123cde";
    const streakName = "Daily programming";
    const streakDescription = "Do one hour of programming each day";
    const request: any = {
      params: { friendRequestId },
      body: {
        userId,
        streakName,
        streakDescription
      }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const errorMessage = "error";
    const findByIdAndUpdate = jest.fn(() => Promise.reject(errorMessage));
    const friendRequestModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchFriendRequestMiddleware(
      friendRequestModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.PatchFriendRequestMiddleware)
    );
  });
});

describe("populateFriendRequestMiddleware", () => {
  test("sets response.locals.updatedPopulatedFriendRequest and calls next", async () => {
    expect.assertions(5);
    const _id = "_id";
    const status = FriendRequestStatus.pending;
    const requesteeId = "requesteeId";
    const requesterId = "requesterId";
    const createdAt = "createdAt";
    const updatedAt = "updatedAt";
    const updatedFriendRequest: FriendRequest = {
      _id,
      status,
      requesteeId,
      requesterId,
      createdAt,
      updatedAt
    };
    const username = "username";
    const findById = jest.fn(() => Promise.resolve({ _id, username }));
    const userModel = { findById };
    const request: any = {};
    const response: any = { locals: { updatedFriendRequest } };
    const next = jest.fn();
    const populateFriendRequestMiddleware = getPopulateUpdatedFriendRequestMiddleware(
      userModel as any
    );
    await populateFriendRequestMiddleware(request, response, next);

    expect(response.locals.updatedPopulatedFriendRequest).toBeDefined();
    const updatedPopulatedFriendRequest =
      response.locals.updatedPopulatedFriendRequest;
    expect(updatedPopulatedFriendRequest.requestee._id).toBeDefined();
    expect(updatedPopulatedFriendRequest.requestee.username).toBeDefined();
    expect(updatedPopulatedFriendRequest.requester._id).toBeDefined();
    expect(updatedPopulatedFriendRequest.requester.username).toBeDefined();
  });

  test("calls next with PopulateFriendRequestMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const friendRequestModel = {};
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getPopulateUpdatedFriendRequestMiddleware(
      friendRequestModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.PopulateFriendRequestMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("sendUpdatedPopulatedFriendRequestMiddleware", () => {
  test("sends updatedFriendRequest", () => {
    expect.assertions(4);
    const updatedPopulatedFriendRequest = {
      _id: "_id",
      requestee: {
        _id: "_id",
        username: "requestee"
      },
      requester: {
        _id: "_id",
        username: "requester"
      }
    };
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const friendRequestResponseLocals = { updatedPopulatedFriendRequest };
    const response: any = { locals: friendRequestResponseLocals, status };
    const request: any = {};
    const next = jest.fn();
    const updatedResourceResponseCode = 200;

    sendUpdatedPopulatedFriendRequestMiddleware(request, response, next);

    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(updatedResourceResponseCode);
    expect(send).toBeCalledWith(updatedPopulatedFriendRequest);
  });

  test("calls next with SendUpdatedFriendRequestMiddleware error on middleware failure", () => {
    expect.assertions(1);

    const response: any = {};
    const request: any = {};
    const next = jest.fn();

    sendUpdatedPopulatedFriendRequestMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendUpdatedFriendRequestMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("patchFriendRequestMiddlewares", () => {
  test("are defined in the correct order", () => {
    expect.assertions(6);

    expect(patchFriendRequestMiddlewares.length).toBe(5);
    expect(patchFriendRequestMiddlewares[0]).toBe(
      friendRequestParamsValidationMiddleware
    );
    expect(patchFriendRequestMiddlewares[1]).toBe(
      friendRequestRequestBodyValidationMiddleware
    );
    expect(patchFriendRequestMiddlewares[2]).toBe(patchFriendRequestMiddleware);
    expect(patchFriendRequestMiddlewares[3]).toBe(
      populateUpdatedFriendRequestMiddleware
    );
    expect(patchFriendRequestMiddlewares[4]).toBe(
      sendUpdatedPopulatedFriendRequestMiddleware
    );
  });
});
