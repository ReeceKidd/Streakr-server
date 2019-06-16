"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const addFriendMiddlewares_1 = require("./addFriendMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
const headers_1 = require("../../Server/headers");
describe("addFriendParamsValidationMiddleware", () => {
  const userId = "abc";
  test("that valid request passes", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: { userId }
    };
    const response = {
      status
    };
    const next = jest.fn();
    addFriendMiddlewares_1.addFriendParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect(next).toBeCalledWith();
  });
  test("that request fails when userId is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: {}
    };
    const response = {
      status
    };
    const next = jest.fn();
    addFriendMiddlewares_1.addFriendParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" is required]'
    });
    expect(next).not.toBeCalled();
  });
});
describe("addFriendBodyValidationMiddleware", () => {
  const mockFriendId = "2345";
  test("that valid request passes", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { friendId: mockFriendId }
    };
    const response = {
      status
    };
    const next = jest.fn();
    addFriendMiddlewares_1.addFriendBodyValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(1);
    expect(next).toBeCalledWith();
  });
  test("that request fails when friendId is missing from body", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: {}
    };
    const response = {
      status
    };
    const next = jest.fn();
    addFriendMiddlewares_1.addFriendBodyValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "friendId" fails because ["friendId" is required]'
    });
    expect(next).not.toBeCalled();
  });
  test("that request fails when friendId is not a string", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { friendId: 1234 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    addFriendMiddlewares_1.addFriendBodyValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "friendId" fails because ["friendId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});
describe(`retreiveUserMiddleware`, () => {
  const mockUserId = "abcdefghij123";
  const ERROR_MESSAGE = "error";
  test("should define response.locals.user when user is found", () =>
    __awaiter(this, void 0, void 0, function*() {
      const findOne = jest.fn(() => Promise.resolve(true));
      const UserModel = {
        findOne
      };
      const request = { params: { userId: mockUserId } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = addFriendMiddlewares_1.getRetreiveUserMiddleware(
        UserModel
      );
      yield middleware(request, response, next);
      expect.assertions(3);
      expect(findOne).toBeCalledWith({ _id: mockUserId });
      expect(response.locals.user).toBe(true);
      expect(next).toBeCalled();
    }));
  test("should not define response.locals.user when user doesn't exist", () =>
    __awaiter(this, void 0, void 0, function*() {
      const findOne = jest.fn(() => Promise.resolve(undefined));
      const UserModel = {
        findOne
      };
      const request = { params: { userId: mockUserId } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = addFriendMiddlewares_1.getRetreiveUserMiddleware(
        UserModel
      );
      yield middleware(request, response, next);
      expect.assertions(3);
      expect(findOne).toBeCalledWith({ _id: mockUserId });
      expect(response.locals.user).toBe(undefined);
      expect(next).toBeCalledWith();
    }));
  test("should call next() with err paramater if database call fails", () =>
    __awaiter(this, void 0, void 0, function*() {
      const findOne = jest.fn(() => Promise.reject(ERROR_MESSAGE));
      const UserModel = {
        findOne
      };
      const request = { params: { userId: mockUserId } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = addFriendMiddlewares_1.getRetreiveUserMiddleware(
        UserModel
      );
      yield middleware(request, response, next);
      expect.assertions(3);
      expect(findOne).toBeCalledWith({ _id: mockUserId });
      expect(response.locals.user).toBe(undefined);
      expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe(`userExistsValidationMiddleware`, () => {
  const mockErrorMessage = "User does not exist";
  test("check that error response is returned correctly when user wasn't found", () =>
    __awaiter(this, void 0, void 0, function*() {
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request = {};
      const response = {
        locals: {},
        status
      };
      const next = jest.fn();
      const middleware = addFriendMiddlewares_1.getUserExistsValidationMiddleware(
        mockErrorMessage
      );
      middleware(request, response, next);
      expect.assertions(2);
      expect(status).toHaveBeenCalledWith(
        responseCodes_1.ResponseCodes.badRequest
      );
      expect(send).toBeCalledWith({ message: mockErrorMessage });
    }));
  test("check that next is called when user is defined on response.locals", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {};
    const response = {
      locals: { user: true },
      status
    };
    const next = jest.fn();
    const middleware = addFriendMiddlewares_1.getUserExistsValidationMiddleware(
      mockErrorMessage
    );
    middleware(request, response, next);
    expect.assertions(3);
    expect(status).not.toHaveBeenCalled();
    expect(send).not.toBeCalled();
    expect(next).toBeCalled();
  });
  test("check that next is called with err on send failure", () => {
    const errorMessage = "error";
    const send = jest.fn(() => {
      throw new Error(errorMessage);
    });
    const status = jest.fn(() => ({ send }));
    const request = {};
    const response = {
      locals: { user: false },
      status
    };
    const next = jest.fn();
    const middleware = addFriendMiddlewares_1.getUserExistsValidationMiddleware(
      mockErrorMessage
    );
    middleware(request, response, next);
    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(errorMessage));
  });
});
describe("addFriendMiddleware", () => {
  const mockUserId = "1234";
  const mockFriendId = "2345";
  test("that friendId gets added to the users friends array correctly", () =>
    __awaiter(this, void 0, void 0, function*() {
      const findOneAndUpdate = jest.fn(() => Promise.resolve(true));
      const UserModel = {
        findOneAndUpdate
      };
      const request = {
        body: { friendId: mockFriendId },
        params: { userId: mockUserId }
      };
      const response = {
        locals: {}
      };
      const next = jest.fn();
      const middleware = addFriendMiddlewares_1.getAddFriendMiddleware(
        UserModel
      );
      yield middleware(request, response, next);
      expect.assertions(2);
      expect(findOneAndUpdate).toBeCalledWith(
        { _id: mockUserId },
        { $addToSet: { friends: mockFriendId } }
      );
      expect(next).toBeCalledWith();
    }));
  test("should call next() with err paramater if database call fails", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(2);
      const ERROR_MESSAGE = "addFriendError";
      const findOneAndUpdate = jest.fn(() => Promise.reject(ERROR_MESSAGE));
      const UserModel = {
        findOneAndUpdate
      };
      const request = {
        body: { friendId: mockFriendId },
        params: { userId: mockUserId }
      };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = addFriendMiddlewares_1.getAddFriendMiddleware(
        UserModel
      );
      yield middleware(request, response, next);
      expect(findOneAndUpdate).toBeCalledWith(
        { _id: mockUserId },
        { $addToSet: { friends: mockFriendId } }
      );
      expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe("retreiveFriendsDetailsMiddleware", () => {
  const friendId = "abcd";
  test("that response.locals.friends is populated with friends details", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(3);
      const friends = [friendId];
      const request = {};
      const response = { locals: { updatedUser: { friends } } };
      const next = jest.fn();
      const find = jest.fn(() => Promise.resolve(true));
      const userModel = {
        find
      };
      const middleware = addFriendMiddlewares_1.getRetreiveFriendsDetailsMiddleware(
        userModel
      );
      yield middleware(request, response, next);
      expect(find).toBeCalledWith({ _id: { $in: friends } });
      expect(response.locals.friends).toBe(true);
      expect(next).toBeCalledWith();
    }));
  test("that response.locals.friends is populated with friends details", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(2);
      const friends = [friendId];
      const request = {};
      const response = { locals: { updatedUser: { friends } } };
      const next = jest.fn();
      const ERROR_MESSAGE = "error";
      const find = jest.fn(() => Promise.reject(ERROR_MESSAGE));
      const userModel = {
        find
      };
      const middleware = addFriendMiddlewares_1.getRetreiveFriendsDetailsMiddleware(
        userModel
      );
      yield middleware(request, response, next);
      expect(find).toBeCalledWith({ _id: { $in: friends } });
      expect(next).toBeCalledWith(ERROR_MESSAGE);
    }));
});
describe("formatFriendsMiddleware", () => {
  test("that formatted friends have just a userName property", () => {
    expect.assertions(2);
    const userName = "friend";
    const password = "password";
    const email = "secret@gmail.com";
    const friend = {
      userName,
      password,
      email
    };
    const friends = [friend];
    const request = {};
    const response = { locals: { friends } };
    const next = jest.fn();
    addFriendMiddlewares_1.formatFriendsMiddleware(request, response, next);
    expect(next).toBeCalledWith();
    expect(response.locals.formattedFriends).toEqual([{ userName }]);
  });
  test("that next is called with err message on err", () => {
    expect.assertions(1);
    const request = {};
    const response = { locals: {} };
    const next = jest.fn();
    addFriendMiddlewares_1.formatFriendsMiddleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError(`Cannot read property 'map' of undefined`)
    );
  });
});
describe("defineLocationPathMiddleware", () => {
  test("that response.locals.locationPath is defined correctly", () => {
    expect.assertions(2);
    const userId = "123";
    const friendId = "abc";
    const request = {
      params: { userId },
      body: { friendId }
    };
    const response = {
      locals: {}
    };
    const next = jest.fn();
    const apiVersion = "v1";
    const userCategory = "users";
    const friendsProperty = "friends";
    const middleware = addFriendMiddlewares_1.getDefineLocationPathMiddleware(
      apiVersion,
      userCategory,
      friendsProperty
    );
    middleware(request, response, next);
    expect(response.locals.locationPath).toEqual(
      `/${apiVersion}/${userCategory}/${userId}/${friendsProperty}/${friendId}`
    );
    expect(next).toBeCalledWith();
  });
  test("that next is called with error on failure", () => {
    expect.assertions(1);
    const userId = "123";
    const friendId = "abc";
    const request = {
      params: { userId },
      body: { friendId }
    };
    const response = {};
    const next = jest.fn();
    const apiVersion = "v1";
    const userCategory = "users";
    const friendsProperty = "friends";
    const middleware = addFriendMiddlewares_1.getDefineLocationPathMiddleware(
      apiVersion,
      userCategory,
      friendsProperty
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError(`Cannot set property 'locationPath' of undefined`)
    );
  });
});
describe("setLocationHeaderMiddleware", () => {
  test("that location header is set correctly", () => {
    const locationPath = "v1/users/123/friends/abc";
    const request = {
      body: { friendId: "1234" }
    };
    const setHeader = jest.fn();
    const response = {
      setHeader,
      locals: {
        locationPath
      }
    };
    const next = jest.fn();
    const middleware = addFriendMiddlewares_1.getSetLocationHeaderMiddleware(
      headers_1.SupportedResponseHeaders.location
    );
    middleware(request, response, next);
    expect.assertions(2);
    expect(setHeader).toHaveBeenCalledWith(
      headers_1.SupportedResponseHeaders.location,
      locationPath
    );
    expect(next).toBeCalled();
  });
  test("that next is called with error on failure", () => {
    const request = {
      body: { friendId: "1234" }
    };
    const response = {};
    const next = jest.fn();
    const middleware = addFriendMiddlewares_1.getSetLocationHeaderMiddleware(
      headers_1.SupportedResponseHeaders.location
    );
    middleware(request, response, next);
    expect.assertions(1);
    expect(next).toBeCalledWith(
      new TypeError(
        "Cannot destructure property `locationPath` of 'undefined' or 'null'."
      )
    );
  });
});
describe("sendFriendAddedSuccessMessageMiddleware", () => {
  test("that response sends success message inside of object", () => {
    const successMessage = "success";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const formattedFriends = [{ userName: "abc" }];
    const response = { status, locals: { formattedFriends } };
    const request = {};
    const next = jest.fn();
    const middleware = addFriendMiddlewares_1.getSendFriendAddedSuccessMessageMiddleware(
      successMessage
    );
    middleware(request, response, next);
    expect.assertions(3);
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(responseCodes_1.ResponseCodes.created);
    expect(send).toBeCalledWith({
      message: successMessage,
      friends: formattedFriends
    });
  });
  test("that next gets called with error on message send failure", () => {
    const ERROR_MESSAGE = "error";
    const successMessage = "success";
    const formattedFriends = [{ userName: "abc" }];
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response = { status, locals: { formattedFriends } };
    const request = {};
    const next = jest.fn();
    const middleware = addFriendMiddlewares_1.getSendFriendAddedSuccessMessageMiddleware(
      successMessage
    );
    middleware(request, response, next);
    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
  });
});
describe("addFriendMiddlewares", () => {
  test("that middlewares are defined in the correct order", () => {
    expect.assertions(10);
    expect(addFriendMiddlewares_1.addFriendMiddlewares[0]).toBe(
      addFriendMiddlewares_1.addFriendParamsValidationMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[1]).toBe(
      addFriendMiddlewares_1.addFriendBodyValidationMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[2]).toBe(
      addFriendMiddlewares_1.retreiveUserMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[3]).toBe(
      addFriendMiddlewares_1.userExistsValidationMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[4]).toBe(
      addFriendMiddlewares_1.addFriendMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[5]).toBe(
      addFriendMiddlewares_1.retreiveFriendsDetailsMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[6]).toBe(
      addFriendMiddlewares_1.formatFriendsMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[7]).toBe(
      addFriendMiddlewares_1.defineLocationPathMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[8]).toBe(
      addFriendMiddlewares_1.setLocationHeaderMiddleware
    );
    expect(addFriendMiddlewares_1.addFriendMiddlewares[9]).toBe(
      addFriendMiddlewares_1.sendFriendAddedSuccessMessageMiddleware
    );
  });
});
//# sourceMappingURL=addFriendMiddlewares.spec.js.map
