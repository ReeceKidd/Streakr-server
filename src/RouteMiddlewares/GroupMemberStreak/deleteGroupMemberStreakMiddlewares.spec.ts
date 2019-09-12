import {
  deleteGroupMemberStreakMiddlewares,
  groupMemberStreakParamsValidationMiddleware,
  deleteGroupMemberStreakMiddleware,
  getDeleteGroupMemberStreakMiddleware,
  sendGroupMemberStreakDeletedResponseMiddleware,
  getSendGroupMemberStreakDeletedResponseMiddleware
} from "./deleteGroupMemberStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("groupMemberStreakParamsValidationMiddleware", () => {
  test("sends groupMemberStreakId is not defined error", () => {
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

    groupMemberStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupMemberStreakId" fails because ["groupMemberStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends groupMemberStreakId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { groupMemberStreakId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupMemberStreakId" fails because ["groupMemberStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("deleteGroupMemberStreakMiddleware", () => {
  test("sets response.locals.deletedGroupMemberStreak", async () => {
    expect.assertions(3);
    const groupMemberStreakId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(true));
    const groupMemberStreakModel = {
      findByIdAndDelete
    };
    const request: any = { params: { groupMemberStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteGroupMemberStreakMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(findByIdAndDelete).toBeCalledWith(groupMemberStreakId);
    expect(response.locals.deletedGroupMemberStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoGroupMemberStreakToDeleteFound error when no solo streak is found", async () => {
    expect.assertions(1);
    const groupMemberStreakId = "abc123";
    const findByIdAndDelete = jest.fn(() => Promise.resolve(false));
    const groupMemberStreakModel = {
      findByIdAndDelete
    };
    const request: any = { params: { groupMemberStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteGroupMemberStreakMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.NoGroupMemberStreakToDeleteFound)
    );
  });

  test("calls next with DeleteGroupMemberStreakMiddleware error on failure", async () => {
    expect.assertions(1);
    const groupMemberStreakId = "abc123";
    const error = "error";
    const findByIdAndDelete = jest.fn(() => Promise.reject(error));
    const groupMemberStreakModel = {
      findByIdAndDelete
    };
    const request: any = { params: { groupMemberStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteGroupMemberStreakMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.DeleteGroupMemberStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("sendGroupMemberStreakDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();
    const middleware = getSendGroupMemberStreakDeletedResponseMiddleware(
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
    const middleware = getSendGroupMemberStreakDeletedResponseMiddleware(
      successfulDeletionResponseCode
    );

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendGroupMemberStreakDeletedResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteGroupMemberStreakMiddlewares", () => {
  test("that deleteGroupMemberStreakMiddlewares are defined in the correct order", () => {
    expect.assertions(4);

    expect(deleteGroupMemberStreakMiddlewares.length).toEqual(3);
    expect(deleteGroupMemberStreakMiddlewares[0]).toEqual(
      groupMemberStreakParamsValidationMiddleware
    );
    expect(deleteGroupMemberStreakMiddlewares[1]).toEqual(
      deleteGroupMemberStreakMiddleware
    );
    expect(deleteGroupMemberStreakMiddlewares[2]).toEqual(
      sendGroupMemberStreakDeletedResponseMiddleware
    );
  });
});
