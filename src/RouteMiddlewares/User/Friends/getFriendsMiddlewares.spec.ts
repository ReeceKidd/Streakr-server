import {
  getFriendsQueryValidationMiddleware,
  getFriendsMiddlewares,
  getFriendsParamsValidationMiddleware,
  getRetreiveFriendsMiddleware,
  sendFormattedFriendsMiddleware
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

  describe(`getFriendsQueryValidationMiddleware`, () => {
    const mockSearchQuery = "searchQuery";

    test("valid request passes", () => {
      expect.assertions(1);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        query: { searchQuery: mockSearchQuery }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      getFriendsQueryValidationMiddleware(request, response, next);

      expect(next).toBeCalledWith();
    });

    test("sends correct error response when searchQuery is missing", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {
        query: {}
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      getFriendsQueryValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message: 'child "searchQuery" fails because ["searchQuery" is required]'
      });
      expect(next).not.toBeCalled();
    });

    test("sends correct response when searchQuery length is too short", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const shortSearchQuery = "";
      const request: any = {
        query: { searchQuery: shortSearchQuery }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      getFriendsQueryValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(400);
      expect(send).toBeCalledWith({
        message:
          'child "searchQuery" fails because ["searchQuery" is not allowed to be empty]'
      });
      expect(next).not.toBeCalled();
    });

    test(`sends correct response when searchQuery length is longer than 64`, () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const longSearchQuery =
        "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
      const request: any = {
        query: { searchQuery: longSearchQuery }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      getFriendsQueryValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message:
          'child "searchQuery" fails because ["searchQuery" length must be less than or equal to 64 characters long]'
      });
      expect(next).not.toBeCalled();
    });

    test(`sends correct response when searchQuery is not a string`, () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const numberSearchQuery = 123;
      const request: any = {
        query: { searchQuery: numberSearchQuery }
      };
      const response: any = {
        status
      };
      const next = jest.fn();

      getFriendsQueryValidationMiddleware(request, response, next);

      expect(status).toHaveBeenCalledWith(422);
      expect(send).toBeCalledWith({
        message:
          'child "searchQuery" fails because ["searchQuery" must be a string]'
      });
      expect(next).not.toBeCalled();
    });
  });

  describe("getRetreiveFriendsMiddleware", () => {
    test("retreives users for userId with a regex search on friends.username", async () => {
      expect.assertions(3);
      const searchQuery = "searchQuery";
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const find = jest.fn(() => Promise.resolve(true));
      const userModel = { find };
      const userId = "userId";
      const request: any = { params: { userId }, query: { searchQuery } };
      const response: any = {
        locals: {},
        status
      };
      const next = jest.fn();
      const middleware = getRetreiveFriendsMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(find).toBeCalledWith({
        _id: userId,
        "friends.username": { $regex: searchQuery.toLowerCase() }
      });
      expect(response.locals.friends).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test("sets response.locals.users without using a searchQuery", async () => {
      expect.assertions(3);

      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const findById = jest.fn(() => Promise.resolve(true));
      const userModel = { findById };
      const userId = "userId";
      const request: any = { params: { userId }, query: {} };
      const response: any = {
        locals: {},
        status
      };
      const next = jest.fn();
      const middleware = getRetreiveFriendsMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(findById).toBeCalledWith(userId, { friends: 1 });
      expect(response.locals.friends).toBeDefined();
      expect(next).toBeCalledWith();
    });

    test("calls next with RetreiveFriendsMiddleware error on middleware failure", async () => {
      expect.assertions(2);
      const errorMessage = "error";
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const find = jest.fn(() => Promise.reject(errorMessage));
      const userModel = { find };
      const request: any = {};
      const response: any = {
        status,
        locals: {}
      };
      const next = jest.fn();
      const middleware = getRetreiveFriendsMiddleware(userModel as any);

      await middleware(request, response, next);

      expect(response.locals.users).not.toBeDefined();
      expect(next).toBeCalledWith(
        new CustomError(ErrorType.RetreiveFriendsMiddleware, expect.any(Error))
      );
    });
  });

  describe("sendFormattedFriendsMiddleware", () => {
    test("sends users in response", () => {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request: any = {};
      const friends = ["user"];
      const response: any = { locals: { friends }, status };
      const next = jest.fn();

      sendFormattedFriendsMiddleware(request, response, next);

      expect(next).not.toBeCalled();
      expect(status).toBeCalledWith(200);
      expect(send).toBeCalledWith({ friends });
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
    expect.assertions(5);

    expect(getFriendsMiddlewares.length).toBe(4);
    expect(getFriendsMiddlewares[0]).toEqual(
      getFriendsParamsValidationMiddleware
    );
    expect(getFriendsMiddlewares[1]).toEqual(
      getFriendsQueryValidationMiddleware
    );
    expect(getFriendsMiddlewares[2]).toEqual(getRetreiveFriendsMiddleware);
    expect(getFriendsMiddlewares[3]).toEqual(sendFormattedFriendsMiddleware);
  });
});
