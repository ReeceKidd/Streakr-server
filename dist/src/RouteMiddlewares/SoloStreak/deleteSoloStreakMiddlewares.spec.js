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
const deleteSoloStreakMiddlewares_1 = require("./deleteSoloStreakMiddlewares");
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
    deleteSoloStreakMiddlewares_1.soloStreakParamsValidationMiddleware(
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
    deleteSoloStreakMiddlewares_1.soloStreakParamsValidationMiddleware(
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
describe("deleteSoloStreakMiddleware", () => {
  test("that when soloStreak is deleted successfully response.locals.deletedSoloStreak is defined and next is called", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(3);
      const soloStreakId = "abc123";
      const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
      const soloStreakModel = {
        findByIdAndDelete
      };
      const request = { params: { soloStreakId } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = deleteSoloStreakMiddlewares_1.getDeleteSoloStreakMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(findByIdAndDelete).toBeCalledWith(soloStreakId);
      expect(response.locals.deletedSoloStreak).toBeDefined();
      expect(next).toBeCalledWith();
    }));
  test("that on error next is called with error", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const soloStreakId = "abc123";
      const error = "error";
      const findByIdAndDelete = jest.fn(() => Promise.reject(error));
      const soloStreakModel = {
        findByIdAndDelete
      };
      const request = { params: { soloStreakId } };
      const response = { locals: {} };
      const next = jest.fn();
      const middleware = deleteSoloStreakMiddlewares_1.getDeleteSoloStreakMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(error);
    }));
});
describe("soloStreakNotFoundMiddleware", () => {
  test("that correct error response is sent whem deletedSoloStreak is not defined", () => {
    expect.assertions(3);
    const badRequestResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {};
    const response = { locals: {}, status };
    const next = jest.fn();
    const middleware = deleteSoloStreakMiddlewares_1.getSoloStreakNotFoundMiddleware(
      badRequestResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(status).toBeCalledWith(badRequestResponseCode);
    expect(send).toBeCalledWith({
      message: localisedSoloStreakDoesNotExistMessage
    });
    expect(next).not.toBeCalled();
  });
  test("that next is called when deletedSoloStreak is defined", () => {
    expect.assertions(1);
    const badRequestResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {};
    const deletedSoloStreak = true;
    const response = { locals: { deletedSoloStreak }, status };
    const next = jest.fn();
    const middleware = deleteSoloStreakMiddlewares_1.getSoloStreakNotFoundMiddleware(
      badRequestResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith();
  });
  test("that on error next is called with error", () => {
    expect.assertions(1);
    const badRequestResponseCode = 404;
    const localisedSoloStreakDoesNotExistMessage =
      "Localised solo streak does not exist";
    const request = {};
    const response = {};
    const next = jest.fn();
    const middleware = deleteSoloStreakMiddlewares_1.getSoloStreakNotFoundMiddleware(
      badRequestResponseCode,
      localisedSoloStreakDoesNotExistMessage
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError(
        "Cannot destructure property `deletedSoloStreak` of 'undefined' or 'null'."
      )
    );
  });
});
describe("sendSoloStreakDeletedResponseMiddleware", () => {
  test("that on deletion correct response is sent", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {};
    const response = { status };
    const next = jest.fn();
    const middleware = deleteSoloStreakMiddlewares_1.getSendSoloStreakDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );
    middleware(request, response, next);
    expect(status).toBeCalledWith(successfulDeletionResponseCode);
    expect(next).not.toBeCalled();
  });
  test("that on error next is called with error", () => {
    expect.assertions(1);
    const successfulDeletionResponseCode = 204;
    const request = {};
    const response = {};
    const next = jest.fn();
    const middleware = deleteSoloStreakMiddlewares_1.getSendSoloStreakDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("response.status is not a function")
    );
  });
});
describe("deleteSoloStreakMiddlewares", () => {
  test("that deleteSoloStreakMiddlewares are defined in the correct order", () => {
    expect.assertions(5);
    expect(
      deleteSoloStreakMiddlewares_1.deleteSoloStreakMiddlewares.length
    ).toEqual(4);
    expect(
      deleteSoloStreakMiddlewares_1.deleteSoloStreakMiddlewares[0]
    ).toEqual(
      deleteSoloStreakMiddlewares_1.soloStreakParamsValidationMiddleware
    );
    expect(
      deleteSoloStreakMiddlewares_1.deleteSoloStreakMiddlewares[1]
    ).toEqual(deleteSoloStreakMiddlewares_1.deleteSoloStreakMiddleware);
    expect(
      deleteSoloStreakMiddlewares_1.deleteSoloStreakMiddlewares[2]
    ).toEqual(deleteSoloStreakMiddlewares_1.soloStreakNotFoundMiddleware);
    expect(
      deleteSoloStreakMiddlewares_1.deleteSoloStreakMiddlewares[3]
    ).toEqual(
      deleteSoloStreakMiddlewares_1.sendSoloStreakDeletedResponseMiddleware
    );
  });
});
//# sourceMappingURL=deleteSoloStreakMiddlewares.spec.js.map
