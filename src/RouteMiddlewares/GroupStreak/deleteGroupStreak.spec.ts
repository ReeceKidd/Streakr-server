import {
  deleteGroupStreakMiddlewares,
  groupStreakParamsValidationMiddleware,
  deleteGroupStreakMiddleware,
  getDeleteGroupStreakMiddleware,
  sendGroupStreakDeletedResponseMiddleware,
  getSendGroupStreakDeletedResponseMiddleware
} from "./deleteGroupStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("groupStreakParamsValidationMiddleware", () => {
  test("sends groupStreakId is not defined error", () => {
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

    groupStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupStreakId" fails because ["groupStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends groupStreakId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { groupStreakId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupStreakId" fails because ["groupStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("deleteGroupStreakMiddleware", () => {
  test("sets response.locals.deletedGroupStreak", async () => {
    expect.assertions(3);
    const groupStreakId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
    const groupStreakModel = {
      findByIdAndDelete
    };
    const request: any = { params: { groupStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteGroupStreakMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(findByIdAndDelete).toBeCalledWith(groupStreakId);
    expect(response.locals.deletedGroupStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoGroupStreakToDeleteFound error when no group streak is found", async () => {
    expect.assertions(1);
    const groupStreakId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
    const groupStreakModel = {
      findByIdAndDelete
    };
    const request: any = { params: { groupStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteGroupStreakMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.NoGroupStreakToDeleteFound)
    );
  });

  test("calls next with DeleteGroupStreakMiddleware error on failure", async () => {
    expect.assertions(1);
    const groupStreakId = "abc123";
    const error = "error";
    const findByIdAndDelete = jest.fn(() => Promise.reject(error));
    const groupStreakModel = {
      findByIdAndDelete
    };
    const request: any = { params: { groupStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteGroupStreakMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DeleteGroupStreakMiddleware, expect.any(Error))
    );
  });
});

describe("sendGroupStreakDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();
    const middleware = getSendGroupStreakDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(status).toBeCalledWith(successfulDeletionResponseCode);
    expect(next).not.toBeCalled();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const successfulDeletionResponseCode = 204;
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSendGroupStreakDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendGroupStreakDeletedResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteGroupStreakMiddlewares", () => {
  test("that deleteGroupStreakMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(deleteGroupStreakMiddlewares.length).toEqual(3);
    expect(deleteGroupStreakMiddlewares[0]).toEqual(
      groupStreakParamsValidationMiddleware
    );
    expect(deleteGroupStreakMiddlewares[1]).toEqual(
      deleteGroupStreakMiddleware
    );
    expect(deleteGroupStreakMiddlewares[2]).toEqual(
      sendGroupStreakDeletedResponseMiddleware
    );
  });
});
