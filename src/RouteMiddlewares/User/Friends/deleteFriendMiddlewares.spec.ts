import {
  deleteFriendMiddlewares,
  retreiveUserMiddleware,
  getRetreiveUserMiddleware,
  deleteFriendParamsValidationMiddleware,
  doesFriendExistMiddleware,
  deleteFriendMiddleware,
  sendFriendDeletedResponseMiddleware,
  getDeleteFriendMiddleware
} from "./deleteFriendsMiddlewares";
import { CustomError, ErrorType } from "../../../customError";

describe("deleteFriendMiddlewares", () => {
  describe(`deleteFriendParamsValidationMiddleware`, () => {
    const userId = "5d43f0c2f4499975cb312b72";
    const friendId = "5d43f0c2f4499975cb312b7a";

    test("calls next() when correct params are supplied", () => {
      expect.assertions(1);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        params: { userId, friendId }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      deleteFriendParamsValidationMiddleware(request, response, next);

      expect(next).toBeCalled();
    });

    test("sends error response when userId is missing", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        params: { friendId }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      deleteFriendParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "userId" fails because ["userId" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends error response when userId is not a string", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        params: { userId: 1234, friendId }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      deleteFriendParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "userId" fails because ["userId" must be a string]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends error response when userId is not 24 characters in length", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        params: { userId: "1234567" }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      deleteFriendParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message:
          'child "userId" fails because ["userId" length must be 24 characters long]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends error response when friendId is missing", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        params: { userId }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      deleteFriendParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "friendId" fails because ["friendId" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends error response when friendId is not a string", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        params: { userId, friendId: 1234 }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      deleteFriendParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "friendId" fails because ["friendId" must be a string]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends error response when friendId is not 24 characters in length", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        params: { userId, friendId: "1234567" }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      deleteFriendParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message:
          'child "friendId" fails because ["friendId" length must be 24 characters long]'
      });
      expect(next).not.toBeCalled();
    });
  });

  describe("retreiveUserMiddleware", () => {
    test("sets response.locals.user and calls next()", async () => {
      expect.assertions(4);
      const lean = jest.fn(() => true);
      const findOne = jest.fn(() => ({ lean }));
      const userModel = { findOne };
      const userId = "abcdefg";
      const request: any = { params: { userId } };
      const response: any = { locals: {} };
      const next = jest.fn();
      const middleware = getRetreiveUserMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(response.locals.user).toBeDefined();
      expect(findOne).toBeCalledWith({ _id: userId });
      expect(lean).toBeCalledWith();
      expect(next).toBeCalledWith();
    });

    test("throws DeleteUserNoUserFound when user does not exist", async () => {
      expect.assertions(1);
      const userId = "abcd";
      const lean = jest.fn(() => false);
      const findOne = jest.fn(() => ({ lean }));
      const userModel = { findOne };
      const request: any = { params: { userId } };
      const response: any = { locals: {} };
      const next = jest.fn();
      const middleware = getRetreiveUserMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.DeleteUserNoUserFound)
      );
    });

    test("throws DeleteUserRetreiveUserMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();
      const middleware = getRetreiveUserMiddleware({} as any);

      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.DeleteUserRetreiveUserMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("doesFriendExistMiddleware", () => {
    test("calls next() if frined exists", () => {
      expect.assertions(1);

      const friendId = "friendId";
      const user = {
        friends: [friendId]
      };
      const request: any = { params: { friendId } };
      const response: any = { locals: { user } };
      const next = jest.fn();

      doesFriendExistMiddleware(request, response, next);

      expect(next).toBeCalledWith();
    });

    test("throws DeleteUserFriendDoesNotExist if the friend does not exist", () => {
      expect.assertions(1);

      const friendId = "friendId";
      const user = {
        friends: []
      };
      const request: any = { params: { friendId } };
      const response: any = { locals: { user } };
      const next = jest.fn();

      doesFriendExistMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.DeleteUserFriendDoesNotExist)
      );
    });

    test("throws DeleteFriendDoesFriendExistMiddleware error on middleware failure", async () => {
      expect.assertions(1);

      const request: any = {};
      const response: any = {};
      const next = jest.fn();

      await doesFriendExistMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.DeleteFriendDoesFriendExistMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("deleteFriendMiddleware", () => {
    test("removes friend and sets response.locals.updatedUser", async () => {
      expect.assertions(3);

      const userId = "userId";
      const friendId = "friendId";

      const findByIdAndUpdate = jest.fn().mockResolvedValue({ _id: "1234" });
      const userModel: any = { findByIdAndUpdate };

      const request: any = { params: { userId, friendId } };
      const response: any = { locals: {} };
      const next = jest.fn();

      const middleware = getDeleteFriendMiddleware(userModel);
      await middleware(request, response, next);

      expect(findByIdAndUpdate).toBeCalledWith(userId, {
        $pull: { friends: friendId }
      });
      expect(response.locals.updatedUser).toEqual({ _id: "1234" });
      expect(next).toBeCalledWith();
    });

    test("calls next with DeleteFriendMiddleware on middleware failure", async () => {
      expect.assertions(1);

      const request: any = { params: {} };
      const response: any = {};
      const next = jest.fn();

      const middleware = getDeleteFriendMiddleware({} as any);
      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.DeleteFriendMiddleware, expect.any(Error))
      );
    });
  });

  describe("sendUserDeletedResponseMiddleware", () => {
    test("responds with successful deletion", () => {
      expect.assertions(2);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {};
      const response: any = { status };
      const next = jest.fn();

      sendFriendDeletedResponseMiddleware(request, response, next);

      expect(status).toBeCalledWith(204);
      expect(next).not.toBeCalled();
    });

    test("that on error next is called with error", () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();

      sendFriendDeletedResponseMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.SendUserDeletedResponseMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  test("middlewares are defined in the correct order", () => {
    expect.assertions(6);

    expect(deleteFriendMiddlewares.length).toEqual(5);

    expect(deleteFriendMiddlewares[0]).toEqual(
      deleteFriendParamsValidationMiddleware
    );
    expect(deleteFriendMiddlewares[1]).toEqual(retreiveUserMiddleware);
    expect(deleteFriendMiddlewares[2]).toEqual(doesFriendExistMiddleware);
    expect(deleteFriendMiddlewares[3]).toEqual(deleteFriendMiddleware);
    expect(deleteFriendMiddlewares[4]).toEqual(
      sendFriendDeletedResponseMiddleware
    );
  });
});
