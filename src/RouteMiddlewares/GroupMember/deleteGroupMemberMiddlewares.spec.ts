import {
  deleteGroupMemberMiddlewares,
  groupMemberParamsValidationMiddleware,
  deleteGroupMemberMiddleware,
  sendGroupMemberDeletedResponseMiddleware,
  retreiveGroupMemberMiddleware,
  getDeleteGroupMemberMiddleware,
  getRetreiveGroupStreakMiddleware,
  retreiveGroupStreakMiddleware
} from "./deleteGroupMemberMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("groupMemberParamsValidationMiddleware", () => {
  const groupStreakId = "groupStreakId";
  const memberId = "memberId";
  const params = {
    groupStreakId,
    memberId
  };

  test("sends memberId is not defined error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: {
        ...params,
        memberId: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "memberId" fails because ["memberId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends memberId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { ...params, memberId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "memberId" fails because ["memberId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends groupStreakId is not defined error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: {
        ...params,
        groupStreakId: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberParamsValidationMiddleware(request, response, next);

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
      params: { ...params, groupStreakId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupMemberParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupStreakId" fails because ["groupStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("retreiveGroupStreakMiddleware", () => {
  test("sets response.locals.groupStreak and calls next()", async () => {
    expect.assertions(4);
    const groupStreakId = "abc";
    const request: any = {
      params: { groupStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(true);
    const findById = jest.fn(() => ({ lean }));
    const groupStreakModel = { findById };
    const middleware = getRetreiveGroupStreakMiddleware(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(findById).toBeCalledWith(groupStreakId);
    expect(lean).toBeCalled();
    expect(response.locals.groupStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws NoGroupStreakFound error when group streak does not exist", async () => {
    expect.assertions(1);
    const groupStreakId = "abc";
    const request: any = {
      params: { groupStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(false);
    const findById = jest.fn(() => ({ lean }));
    const groupStreakModel = { findById };
    const middleware = getRetreiveGroupStreakMiddleware(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(new CustomError(ErrorType.NoGroupStreakFound));
  });

  test("throws DeleteGroupMemberRetreiveGroupStreakMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getRetreiveGroupStreakMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.DeleteGroupMemberRetreiveGroupStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("retreiveGroupMemberMiddleware", () => {
  test("sets response.locals.member and calls next()", async () => {
    expect.assertions(2);
    const memberId = "abc";
    const members = [{ memberId }];
    const groupStreak = {
      members
    };

    const request: any = {
      params: { memberId }
    };
    const response: any = { locals: { groupStreak } };
    const next = jest.fn();

    await retreiveGroupMemberMiddleware(request, response, next);

    expect(response.locals.member).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with RetreiveGroupMemberMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getRetreiveGroupStreakMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.DeleteGroupMemberRetreiveGroupStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteGroupMemberMiddleware", () => {
  test("sets response.locals.deletedGroupMember", async () => {
    expect.assertions(3);
    const memberId = "abc123";
    const groupStreakId = "12345";
    const members = [{ memberId }];
    const groupStreak = {
      members
    };

    const request: any = { params: { memberId, groupStreakId } };
    const response: any = { locals: { groupStreak } };
    const next = jest.fn();
    const lean = jest.fn().mockResolvedValue(true);
    const findByIdAndUpdate = jest.fn(() => ({ lean }));
    const groupStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getDeleteGroupMemberMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(findByIdAndUpdate).toBeCalledWith(
      groupStreakId,
      { members: [] },
      { new: true }
    );
    expect(lean).toBeCalled();
    expect(next).toBeCalledWith();
  });

  test("calls next with DeleteGroupMemberMiddleware error on failure", async () => {
    expect.assertions(1);

    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDeleteGroupMemberMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DeleteGroupMemberMiddleware, expect.any(Error))
    );
  });
});

describe("sendGroupMemberDeletedResponseMiddleware", () => {
  test("responds with successful deletion", () => {
    expect.assertions(2);
    const successfulDeletionResponseCode = 204;
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();

    sendGroupMemberDeletedResponseMiddleware(request, response, next);

    expect(status).toBeCalledWith(successfulDeletionResponseCode);
    expect(next).not.toBeCalled();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();

    sendGroupMemberDeletedResponseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendGroupMemberDeletedResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("deleteGroupMemberMiddlewares", () => {
  test("are defined in the correct order", () => {
    expect.assertions(6);

    expect(deleteGroupMemberMiddlewares.length).toEqual(5);
    expect(deleteGroupMemberMiddlewares[0]).toEqual(
      groupMemberParamsValidationMiddleware
    );
    expect(deleteGroupMemberMiddlewares[1]).toEqual(
      retreiveGroupStreakMiddleware
    );
    expect(deleteGroupMemberMiddlewares[2]).toEqual(
      retreiveGroupMemberMiddleware
    );
    expect(deleteGroupMemberMiddlewares[3]).toEqual(
      deleteGroupMemberMiddleware
    );
    expect(deleteGroupMemberMiddlewares[4]).toEqual(
      sendGroupMemberDeletedResponseMiddleware
    );
  });
});
