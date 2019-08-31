import {
  getGroupStreakMiddlewares,
  retreiveGroupStreakMiddleware,
  getRetreiveGroupStreakMiddleware,
  sendGroupStreakMiddleware,
  getGroupStreakParamsValidationMiddleware,
  getSendGroupStreakMiddleware,
  retreiveGroupStreakMembersInformationMiddleware,
  getRetreiveGroupStreakMembersInformationMiddleware
} from "./getGroupStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { ErrorType, CustomError } from "../../customError";

describe(`getGroupStreakParamsValidationMiddleware`, () => {
  const groupStreakId = "12345678";

  test("calls next() when correct params are supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { groupStreakId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getGroupStreakParamsValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends error response when groupStreakId is missing", () => {
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

    getGroupStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupStreakId" fails because ["groupStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends error response when groupStreakId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { groupStreakId: 1234 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    getGroupStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupStreakId" fails because ["groupStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("retreiveGroupStreakMiddleware", () => {
  test("sets response.locals.groupStreak", async () => {
    expect.assertions(3);
    const lean = jest.fn(() => Promise.resolve(true));
    const findOne = jest.fn(() => ({ lean }));
    const groupStreakModel = {
      findOne
    };
    const groupStreakId = "abcd";
    const request: any = { params: { groupStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveGroupStreakMiddleware(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ _id: groupStreakId });
    expect(response.locals.groupStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws GetGroupStreakNoGroupStreakFound when group streak is not found", async () => {
    expect.assertions(1);
    const lean = jest.fn(() => Promise.resolve(false));
    const findOne = jest.fn(() => ({ lean }));
    const groupStreakModel = {
      findOne
    };
    const groupStreakId = "abcd";
    const request: any = { params: { groupStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveGroupStreakMiddleware(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.GetGroupStreakNoGroupStreakFound)
    );
  });

  test("calls next with RetreiveGroupStreakMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const errorMessage = "error";
    const lean = jest.fn(() => Promise.reject(errorMessage));
    const findOne = jest.fn(() => ({ lean }));
    const groupStreakModel = {
      findOne
    };
    const groupStreakId = "abcd";
    const request: any = { params: { groupStreakId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveGroupStreakMiddleware(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.RetreiveGroupStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("retreiveGroupStreakMembersInformation", () => {
  test("retreives group streak members information and sets response.locals.groupStreaksWithUsers", async () => {
    expect.assertions(4);

    const user = { _id: "12345678", username: "usernames" };
    const lean = jest.fn().mockResolvedValue(user);
    const findOne = jest.fn(() => ({ lean }));
    const userModel: any = {
      findOne
    };
    const members = ["12345678"];
    const groupStreak = { _id: "abc", members };
    const request: any = {};
    const response: any = { locals: { groupStreak } };
    const next = jest.fn();

    const middleware = getRetreiveGroupStreakMembersInformationMiddleware(
      userModel
    );
    await middleware(request, response, next);

    expect(findOne).toHaveBeenCalled();
    expect(lean).toHaveBeenCalled();
    expect(response.locals.groupStreakWithUsers).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with RetreiveGroupStreakMembersInformation on middleware failure", async () => {
    expect.assertions(1);

    const response: any = {};
    const request: any = {};
    const next = jest.fn();

    const middleware = getRetreiveGroupStreakMembersInformationMiddleware(
      {} as any
    );
    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.RetreiveGroupStreakMembersInformation,
        expect.any(Error)
      )
    );
  });
});

describe("sendGroupStreakMiddleware", () => {
  test("sends groupStreak", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const groupStreak = { _id: "abc" };
    const request: any = {};
    const response: any = { locals: { groupStreak }, status };
    const next = jest.fn();
    const resourceCreatedCode = 401;
    const middleware = getSendGroupStreakMiddleware(resourceCreatedCode);

    middleware(request, response, next);

    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(resourceCreatedCode);
    expect(send).toBeCalledWith({ ...groupStreak });
  });

  test("calls next with SendGroupStreakMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const error = "error";
    const send = jest.fn(() => Promise.reject(error));
    const status = jest.fn(() => ({ send }));
    const response: any = { status };
    const next = jest.fn();
    const resourceCreatedResponseCode = 401;
    const middleware = getSendGroupStreakMiddleware(
      resourceCreatedResponseCode
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SendGroupStreakMiddleware, expect.any(Error))
    );
  });
});

describe("getGroupStreakMiddlewares", () => {
  test("that getGroupStreakMiddlewares are defined in the correct order", () => {
    expect.assertions(5);

    expect(getGroupStreakMiddlewares.length).toEqual(4);
    expect(getGroupStreakMiddlewares[0]).toEqual(
      getGroupStreakParamsValidationMiddleware
    );
    expect(getGroupStreakMiddlewares[1]).toEqual(retreiveGroupStreakMiddleware);
    expect(getGroupStreakMiddlewares[2]).toEqual(
      retreiveGroupStreakMembersInformationMiddleware
    );
    expect(getGroupStreakMiddlewares[3]).toEqual(sendGroupStreakMiddleware);
  });
});
