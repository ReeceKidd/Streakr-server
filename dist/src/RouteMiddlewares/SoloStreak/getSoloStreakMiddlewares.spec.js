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
const getSoloStreakMiddlewares_1 = require("./getSoloStreakMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
describe(`getSoloStreakParamsValidationMiddleware`, () => {
  const soloStreakId = "12345678";
  test("that next() is called when correct params are supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: { soloStreakId }
    };
    const response = {
      status
    };
    const next = jest.fn();
    getSoloStreakMiddlewares_1.getSoloStreakParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect(next).toBeCalled();
  });
  test("that correct response is sent when soloStreakId is missing", () => {
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
    getSoloStreakMiddlewares_1.getSoloStreakParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "soloStreakId" fails because ["soloStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });
  test("that error response is sent when soloStreakId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: { soloStreakId: 1234 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    getSoloStreakMiddlewares_1.getSoloStreakParamsValidationMiddleware(
      request,
      response,
      next
    );
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
describe("retreiveSoloStreakMiddleware", () => {
  test("that response.locals.soloStreak is defined and next() is called", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(3);
      const lean = jest.fn(() => Promise.resolve(true));
      const findOne = jest.fn(() => ({ lean }));
      const soloStreakModel = {
        findOne
      };
      const soloStreakId = "abcd";
      const request = { params: { soloStreakId } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = getSoloStreakMiddlewares_1.getRetreiveSoloStreakMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(findOne).toBeCalledWith({ _id: soloStreakId });
      expect(response.locals.soloStreak).toBeDefined();
      expect(next).toBeCalledWith();
    }));
  test("that on error next() is called with error", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const errorMessage = "error";
      const lean = jest.fn(() => Promise.reject(errorMessage));
      const findOne = jest.fn(() => ({ lean }));
      const soloStreakModel = {
        findOne
      };
      const soloStreakId = "abcd";
      const request = { params: { soloStreakId } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = getSoloStreakMiddlewares_1.getRetreiveSoloStreakMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(errorMessage);
    }));
});
describe("sendSoloStreakDoesNotExistErrorResponse", () => {
  test("that correct error response is sent whem soloStreak is not defined", () => {
    expect.assertions(3);
    const doesNotExistErrorResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {};
    const response = { locals: {}, status };
    const next = jest.fn();
    const middleware = getSoloStreakMiddlewares_1.getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      doesNotExistErrorResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(status).toBeCalledWith(doesNotExistErrorResponseCode);
    expect(send).toBeCalledWith({
      message: localisedSoloStreakDoesNotExistMessage
    });
    expect(next).not.toBeCalled();
  });
  test("that next is called when soloStreak is defined", () => {
    expect.assertions(1);
    const doesNotExistErrorResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {};
    const soloStreak = true;
    const response = { locals: { soloStreak }, status };
    const next = jest.fn();
    const middleware = getSoloStreakMiddlewares_1.getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      doesNotExistErrorResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith();
  });
  test("that on error next is called with error", () => {
    expect.assertions(1);
    const doesNotExistErrorResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const request = {};
    const response = {};
    const next = jest.fn();
    const middleware = getSoloStreakMiddlewares_1.getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      doesNotExistErrorResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError(
        "Cannot destructure property `soloStreak` of 'undefined' or 'null'."
      )
    );
  });
});
describe("sendSoloStreakMiddleware", () => {
  test("that soloStreak is sent correctly", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const soloStreak = { _id: "abc" };
    const request = {};
    const response = { locals: { soloStreak }, status };
    const next = jest.fn();
    const resourceCreatedCode = 401;
    const middleware = getSoloStreakMiddlewares_1.getSendSoloStreakMiddleware(
      resourceCreatedCode
    );
    middleware(request, response, next);
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(resourceCreatedCode);
    expect(send).toBeCalledWith(Object.assign({}, soloStreak));
  });
  test("that on error next is called with error", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const request = {};
      const error = "error";
      const send = jest.fn(() => Promise.reject(error));
      const status = jest.fn(() => ({ send }));
      const response = { status };
      const next = jest.fn();
      const resourceCreatedResponseCode = 401;
      const middleware = getSoloStreakMiddlewares_1.getSendSoloStreakMiddleware(
        resourceCreatedResponseCode
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new TypeError(
          "Cannot destructure property `soloStreak` of 'undefined' or 'null'."
        )
      );
    }));
});
describe("getSoloStreakMiddlewares", () => {
  test("that getSoloStreakMiddlewares are defined in the correct order", () => {
    expect.assertions(5);
    expect(getSoloStreakMiddlewares_1.getSoloStreakMiddlewares.length).toEqual(
      4
    );
    expect(getSoloStreakMiddlewares_1.getSoloStreakMiddlewares[0]).toEqual(
      getSoloStreakMiddlewares_1.getSoloStreakParamsValidationMiddleware
    );
    expect(getSoloStreakMiddlewares_1.getSoloStreakMiddlewares[1]).toEqual(
      getSoloStreakMiddlewares_1.retreiveSoloStreakMiddleware
    );
    expect(getSoloStreakMiddlewares_1.getSoloStreakMiddlewares[2]).toEqual(
      getSoloStreakMiddlewares_1.sendSoloStreakDoesNotExistErrorMessageMiddleware
    );
    expect(getSoloStreakMiddlewares_1.getSoloStreakMiddlewares[3]).toEqual(
      getSoloStreakMiddlewares_1.sendSoloStreakMiddleware
    );
  });
});
//# sourceMappingURL=getSoloStreakMiddlewares.spec.js.map
