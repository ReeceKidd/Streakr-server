import {
  getFriendsMiddlewares,
  getRetreiveUserMiddleware,
  retreiveUserMiddleware,
  getFriendsParamsValidationMiddleware,
  getRetreiveFriendsMiddleware,
  sendFormattedFriendsMiddleware,
  retreiveFriendsMiddleware,
  formatFriendsMiddleware
} from "./getFriendsMiddlewares";
import { CustomError, ErrorType } from "../../../customError";

describe(`getFriendsMiddlewares`, () => {
  describe("getFriendsParamsValidationMiddleware", () => {
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

      getFriendsParamsValidationMiddleware(request, response, next);

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

      getFriendsParamsValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "userId" fails because ["userId" must be a string]'
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

    test("throws GetFriendsUserDoesNotExistError when user does not exist", async () => {
      expect.assertions(1);
      const userId = "5d616c43e1dc592ce8bd487b";
      const lean = jest.fn(() => false);
      const findOne = jest.fn(() => ({ lean }));
      const userModel = { findOne };
      const request: any = { params: { userId } };
      const response: any = { locals: {} };
      const next = jest.fn();
      const middleware = getRetreiveUserMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.GetFriendsUserDoesNotExist)
      );
    });

    test("throws RetreiveUserMiddleware error on middleware failure", async () => {
      expect.assertions(1);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const userId = "abcd";
      const findOne = jest.fn(() => ({}));
      const userModel = { findOne };
      const request: any = { body: { userId } };
      const response: any = { status, locals: {} };
      const next = jest.fn();
      const middleware = getRetreiveUserMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.RetreiveUserMiddleware, expect.any(Error))
      );
    });
  });

  describe("retreiveFriendsMiddleware", () => {
    test("retreives users for userId with a regex search on friends.username", async () => {
      expect.assertions(3);

      const find = jest.fn(() =>
        Promise.resolve([{ _id: "123", username: "username" }])
      );
      const userModel = { find };
      const friends = ["123", "abc", "xyz"];
      const user = {
        friends
      };
      const request: any = {};
      const response: any = {
        locals: { user }
      };
      const next = jest.fn();
      const middleware = getRetreiveFriendsMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(find).toBeCalledWith({
        _id: friends
      });
      expect(response.locals.friends).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test("calls next with RetreiveFriendsMiddleware error on middleware failure", async () => {
      expect.assertions(1);

      const request: any = {};
      const response: any = {};
      const next = jest.fn();
      const middleware = getRetreiveFriendsMiddleware({} as any);

      await middleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.RetreiveFriendsMiddleware, expect.any(Error))
      );
    });
  });

  describe("formatFriendsMiddleware", () => {
    test("sets response.locals.formattedFriends with formatted user objects", () => {
      expect.assertions(2);

      const _id = "_id";
      const username = "username";
      const friends = [{ _id, username, password: "password" }];

      const request: any = {};
      const response: any = { locals: { friends } };
      const next = jest.fn();

      formatFriendsMiddleware(request, response, next);

      expect(response.locals.formattedFriends).toEqual([{ _id, username }]);
      expect(next).toBeCalledWith();
    });

    test("throws FormatFriendsMiddleware error on middleware failure", () => {
      expect.assertions(1);

      const request: any = {};
      const response: any = {};
      const next = jest.fn();

      formatFriendsMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(ErrorType.FormatFriendsMiddleware, expect.any(Error))
      );
    });
  });

  describe("sendFormattedFriendsMiddleware", () => {
    test("sends users in response", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {};
      const formattedFriends = [{ _id: "123", username: "username" }];
      const response: any = { locals: { formattedFriends }, status };
      const next = jest.fn();

      sendFormattedFriendsMiddleware(request, response, next);

      expect(next).not.toBeCalled();
      expect(status).toBeCalledWith(200);
      expect(send).toBeCalledWith(formattedFriends);
    });

    test("calls next with SendFormattedFriendsMiddleware on middleware failure", () => {
      expect.assertions(1);

      const response: any = {};
      const request: any = {};
      const next = jest.fn();

      sendFormattedFriendsMiddleware(request, response, next);

      expect(next).toBeCalledWith(
        new CustomError(
          ErrorType.SendFormattedFriendsMiddleware,
          expect.any(Error)
        )
      );
    });
  });

  test("middlewares are defined in the correct order", () => {
    expect.assertions(6);

    expect(getFriendsMiddlewares.length).toBe(5);

    expect(getFriendsMiddlewares[0]).toEqual(
      getFriendsParamsValidationMiddleware
    );
    expect(getFriendsMiddlewares[1]).toEqual(retreiveUserMiddleware);
    expect(getFriendsMiddlewares[2]).toEqual(retreiveFriendsMiddleware);
    expect(getFriendsMiddlewares[3]).toEqual(formatFriendsMiddleware);
    expect(getFriendsMiddlewares[4]).toEqual(sendFormattedFriendsMiddleware);
  });
});
