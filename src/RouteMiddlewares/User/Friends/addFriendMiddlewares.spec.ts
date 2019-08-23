import {
  addFriendMiddlewares,
  addFriendParamsValidationMiddleware,
  getRetreiveUserMiddleware,
  addFriendBodyValidationMiddleware,
  getRetreiveFriendMiddleware,
  addFriendToUsersFriendListMiddleware,
  sendUserWithNewFriendMiddleware,
  isAlreadyAFriendMiddleware,
  getAddFriendToUsersFriendListMiddleware
} from "./addFriendMiddlewares";
import { CustomError, ErrorType } from "../../../customError";

describe("addFriendMiddlewares", () => {
  describe("addFriendParamsValidationMiddleware", () => {
    test("sends userId is not defined error", () => {
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

      addFriendParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "userId" fails because ["userId" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends userId is not a string error", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        params: { userId: 123 }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      addFriendParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "userId" fails because ["userId" must be a string]'
      });
      expect(next).not.toBeCalled();
    });
  });

  describe("addFriendBodyValidationMiddleware", () => {
    test("sends friendId is not defined error", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: {}
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      addFriendBodyValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "friendId" fails because ["friendId" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends friendId is not a string error", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        body: { friendId: 123 }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      addFriendBodyValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "friendId" fails because ["friendId" must be a string]'
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

    test("throws AddFriendUserDoesNotExist when user does not exist", async () => {
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
        new CustomError(ErrorType.AddFriendUserDoesNotExist)
      );
    });

    test("throws AddFriendRetreiveUserMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const userId = "abcd";
      const findOne = jest.fn(() => ({}));
      const userModel = { findOne };
      const request: any = { params: { userId } };
      const response: any = { status, locals: {} };
      const next = jest.fn();
      const middleware = getRetreiveUserMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.AddFriendRetreiveUserMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("isAlreadyAFriendMiddleware", () => {
    test("calls next if friend does not exist on users friend list", () => {
      expect.assertions(1);

      const friendId = "friendId";
      const friends = ["friend1", "friend2", "friend3"];
      const user = {
        friends
      };

      const request: any = { body: { friendId } };
      const response: any = { locals: { user } };
      const next = jest.fn();

      isAlreadyAFriendMiddleware(request, response, next);

      expect(next).toBeCalledWith();
    });

    test("throws IsAlreadyAFriend error if friend already exists on users friend list", () => {
      expect.assertions(1);

      const friendId = "friend1";
      const friends = ["friend1", "friend2", "friend3"];
      const user = {
        friends
      };

      const request: any = { body: { friendId } };
      const response: any = { locals: { user } };
      const next = jest.fn();

      isAlreadyAFriendMiddleware(request, response, next);

      expect(next).toBeCalledWith(new CustomError(ErrorType.IsAlreadyAFriend));
    });

    test("throws IsAlreadyAFriendMiddleware error on middleware failure", () => {
      expect.assertions(1);

      const request: any = {};
      const response: any = {};
      const next = jest.fn();

      isAlreadyAFriendMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.IsAlreadyAFriendMiddleware, expect.any(Error))
      );
    });
  });

  describe("retreiveFriendMiddleware", () => {
    test("sets response.locals.friend and calls next()", async () => {
      expect.assertions(4);
      const lean = jest.fn(() => true);
      const findOne = jest.fn(() => ({ lean }));
      const userModel = { findOne };
      const friendId = "abcdefg";
      const request: any = { body: { friendId } };
      const response: any = { locals: {} };
      const next = jest.fn();
      const middleware = getRetreiveFriendMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(response.locals.friend).toBeDefined();
      expect(findOne).toBeCalledWith({ _id: friendId });
      expect(lean).toBeCalledWith();
      expect(next).toBeCalledWith();
    });

    test("throws FriendDoesNotExist error when friend does not exist", async () => {
      expect.assertions(1);
      const friendId = "abcd";
      const lean = jest.fn(() => false);
      const findOne = jest.fn(() => ({ lean }));
      const userModel = { findOne };
      const request: any = { body: { friendId } };
      const response: any = { locals: {} };
      const next = jest.fn();
      const middleware = getRetreiveFriendMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.FriendDoesNotExist)
      );
    });

    test("throws DoesFriendExistMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const friendId = "abcd";
      const findOne = jest.fn(() => ({}));
      const userModel = { findOne };
      const request: any = { friendId: { friendId } };
      const response: any = { status, locals: {} };
      const next = jest.fn();
      const middleware = getRetreiveFriendMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.DoesFriendExistMiddleware, expect.any(Error))
      );
    });
  });

  describe("addFriendToUsersFriendListMiddleware", () => {
    test("adds friendId to users friends list and sets response.locals.userWithNewFriend", async () => {
      expect.assertions(3);

      const userId = "userId";
      const friendId = "friendId";
      const findByIdAndUpdate = jest.fn().mockResolvedValue(true);
      const userModel: any = { findByIdAndUpdate };
      const request: any = { params: { userId }, body: { friendId } };
      const response: any = { locals: {} };
      const next = jest.fn();

      const middleware = getAddFriendToUsersFriendListMiddleware(userModel);
      await middleware(request, response, next);

      expect(findByIdAndUpdate).toBeCalledWith(userId, {
        $addToSet: { friends: friendId }
      });
      expect(response.locals.userWithNewFriend).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test("throws AddFriendToUsersFriendListMiddleware error on middleware failure", async () => {
      expect.assertions(1);

      const request: any = {};
      const response: any = {};
      const next = jest.fn();

      const middleware = getAddFriendToUsersFriendListMiddleware({} as any);
      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.AddFriendToUsersFriendListMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  describe("sendUserWithNewFriendMiddleware", () => {
    test("sends user with new friends", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const userWithNewFriend = { _id: "abc" };
      const request: any = {};
      const response: any = { locals: { userWithNewFriend }, status };
      const next = jest.fn();

      sendUserWithNewFriendMiddleware(request, response, next);

      expect(next).not.toBeCalled();
      expect(status).toBeCalledWith(201);
      expect(send).toBeCalledWith({ user: userWithNewFriend });
    });

    test("calls next with SendUserWithNewFriendMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const request: any = {};
      const response: any = {};
      const next = jest.fn();

      await sendUserWithNewFriendMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.SendUserWithNewFriendMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  test("middlewares are defined in the correct order", () => {
    expect.assertions(8);

    expect(addFriendMiddlewares.length).toEqual(7);
    expect(addFriendMiddlewares[0]).toEqual(
      addFriendParamsValidationMiddleware
    );
    expect(addFriendMiddlewares[1]).toEqual(addFriendBodyValidationMiddleware);
    expect(addFriendMiddlewares[2]).toEqual(getRetreiveUserMiddleware);
    expect(addFriendMiddlewares[3]).toEqual(isAlreadyAFriendMiddleware);
    expect(addFriendMiddlewares[4]).toEqual(getRetreiveFriendMiddleware);
    expect(addFriendMiddlewares[5]).toEqual(
      addFriendToUsersFriendListMiddleware
    );
    expect(addFriendMiddlewares[6]).toEqual(sendUserWithNewFriendMiddleware);
  });
});
