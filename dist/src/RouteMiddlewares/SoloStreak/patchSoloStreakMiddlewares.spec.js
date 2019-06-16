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
const patchSoloStreakMiddlewares_1 = require("./patchSoloStreakMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
describe("soloStreakParamsValidationMiddleware", () => {
  test("that correct response is sent when soloStreakId is not defined", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: {}
    };
    const response = {
      status
    };
    const next = jest.fn();
    patchSoloStreakMiddlewares_1.soloStreakParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "soloStreakId" fails because ["soloStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });
  test("that correct response is sent when soloStreakId is not a string", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: { soloStreakId: 123 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    patchSoloStreakMiddlewares_1.soloStreakParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message:
        'child "soloStreakId" fails because ["soloStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});
describe("soloStreakRequestBodyValidationMiddleware", () => {
  test("that unsupported key cannot be sent in body", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { unsupportedKey: 1234 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    patchSoloStreakMiddlewares_1.soloStreakRequestBodyValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.badRequest
    );
    expect(send).toBeCalledWith({
      message: '"unsupportedKey" is not allowed'
    });
    expect(next).not.toBeCalled();
  });
  test("that correct response is sent when userId is not a string", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { userId: 1234 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    patchSoloStreakMiddlewares_1.soloStreakRequestBodyValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
  test("that correct response is sent when name is not a string", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { name: 1234 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    patchSoloStreakMiddlewares_1.soloStreakRequestBodyValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "name" fails because ["name" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
  test("that correct response is sent when description is not a string", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { description: 1234 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    patchSoloStreakMiddlewares_1.soloStreakRequestBodyValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message:
        'child "description" fails because ["description" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
  test("that correct response is sent when completedToday is not a boolean", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      body: { completedToday: 1 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    patchSoloStreakMiddlewares_1.soloStreakRequestBodyValidationMiddleware(
      request,
      response,
      next
    );
    expect.assertions(3);
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message:
        'child "completedToday" fails because ["completedToday" must be a boolean]'
    });
    expect(next).not.toBeCalled();
  });
});
describe("patchSoloStreakMiddleware", () => {
  test("that response.locals.updatedSoloStreak is defined and next is called", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(3);
      const soloStreakId = "abc123";
      const userId = "123cde";
      const name = "Daily programming";
      const description = "Do one hour of programming each day";
      const request = {
        params: { soloStreakId },
        body: {
          userId,
          name,
          description
        }
      };
      const response = { locals: {} };
      const next = jest.fn();
      const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
      const soloStreakModel = {
        findByIdAndUpdate
      };
      const middleware = patchSoloStreakMiddlewares_1.getPatchSoloStreakMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(findByIdAndUpdate).toBeCalledWith(
        soloStreakId,
        { userId, name, description },
        { new: true }
      );
      expect(response.locals.updatedSoloStreak).toBeDefined();
      expect(next).toBeCalledWith();
    }));
  test("that on error next is called with error", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const soloStreakId = "abc123";
      const userId = "123cde";
      const name = "Daily programming";
      const description = "Do one hour of programming each day";
      const request = {
        params: { soloStreakId },
        body: {
          userId,
          name,
          description
        }
      };
      const response = { locals: {} };
      const next = jest.fn();
      const errorMessage = "error";
      const findByIdAndUpdate = jest.fn(() => Promise.reject(errorMessage));
      const soloStreakModel = {
        findByIdAndUpdate
      };
      const middleware = patchSoloStreakMiddlewares_1.getPatchSoloStreakMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(errorMessage);
    }));
});
describe("soloStreakDoesNotExistErrorMessageMiddleware", () => {
  test("that error response is sent when response.locals.updatedSoloStreak is not defined", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(3);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request = {};
      const response = { locals: {}, status };
      const next = jest.fn();
      const unprocessableEntityStatus = 404;
      const localisedErrorMessage = "error";
      const middleware = patchSoloStreakMiddlewares_1.getSoloStreakDoesNotExistErrorMessageMiddleware(
        unprocessableEntityStatus,
        localisedErrorMessage
      );
      middleware(request, response, next);
      expect(status).toBeCalledWith(unprocessableEntityStatus);
      expect(send).toBeCalledWith({ message: localisedErrorMessage });
      expect(next).not.toBeCalledWith();
    }));
  test("that next() is called when response.locals.updatedSoloStreak is defined", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const updatedSoloStreak = {
        soloStreakName: "Test soloStreak"
      };
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const request = {};
      const response = { locals: { updatedSoloStreak }, status };
      const next = jest.fn();
      const unprocessableEntityStatus = 402;
      const localisedErrorMessage = "error";
      const middleware = patchSoloStreakMiddlewares_1.getSoloStreakDoesNotExistErrorMessageMiddleware(
        unprocessableEntityStatus,
        localisedErrorMessage
      );
      middleware(request, response, next);
      expect(next).toBeCalledWith();
    }));
  test("that next is called with error on error", () => {
    expect.assertions(1);
    const request = {};
    const response = { locals: {} };
    const next = jest.fn();
    const unprocessableEntityStatus = 402;
    const localisedErrorMessage = "error";
    const middleware = patchSoloStreakMiddlewares_1.getSoloStreakDoesNotExistErrorMessageMiddleware(
      unprocessableEntityStatus,
      localisedErrorMessage
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("response.status is not a function")
    );
  });
});
describe("sendUpdatedPatchMiddleware", () => {
  const ERROR_MESSAGE = "error";
  const updatedSoloStreak = {
    userId: "abc",
    streakName: "Daily Spanish",
    streakDescription: "Practice spanish every day",
    startDate: new Date()
  };
  test("should send user in response with password undefined", () => {
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const soloStreakResponseLocals = { updatedSoloStreak };
    const response = { locals: soloStreakResponseLocals, status };
    const request = {};
    const next = jest.fn();
    const updatedResourceResponseCode = 200;
    const middleware = patchSoloStreakMiddlewares_1.getSendUpdatedSoloStreakMiddleware(
      updatedResourceResponseCode
    );
    middleware(request, response, next);
    expect.assertions(4);
    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(updatedResourceResponseCode);
    expect(send).toBeCalledWith({ data: updatedSoloStreak });
  });
  test("should call next with an error on failure", () => {
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response = { locals: { updatedSoloStreak }, status };
    const request = {};
    const next = jest.fn();
    const updatedResourceResponseCode = 200;
    const middleware = patchSoloStreakMiddlewares_1.getSendUpdatedSoloStreakMiddleware(
      updatedResourceResponseCode
    );
    middleware(request, response, next);
    expect.assertions(1);
    expect(next).toBeCalledWith(new Error(ERROR_MESSAGE));
  });
});
describe("patchSoloStreakMiddlewares", () => {
  test("that patchSoloStreakMiddlewares are defined in the correct order", () => {
    expect.assertions(5);
    expect(patchSoloStreakMiddlewares_1.patchSoloStreakMiddlewares[0]).toBe(
      patchSoloStreakMiddlewares_1.soloStreakParamsValidationMiddleware
    );
    expect(patchSoloStreakMiddlewares_1.patchSoloStreakMiddlewares[1]).toBe(
      patchSoloStreakMiddlewares_1.soloStreakRequestBodyValidationMiddleware
    );
    expect(patchSoloStreakMiddlewares_1.patchSoloStreakMiddlewares[2]).toBe(
      patchSoloStreakMiddlewares_1.patchSoloStreakMiddleware
    );
    expect(patchSoloStreakMiddlewares_1.patchSoloStreakMiddlewares[3]).toBe(
      patchSoloStreakMiddlewares_1.soloStreakDoesNotExistErrorMessageMiddleware
    );
    expect(patchSoloStreakMiddlewares_1.patchSoloStreakMiddlewares[4]).toBe(
      patchSoloStreakMiddlewares_1.sendUpdatedSoloStreakMiddleware
    );
  });
});
//# sourceMappingURL=patchSoloStreakMiddlewares.spec.js.map
