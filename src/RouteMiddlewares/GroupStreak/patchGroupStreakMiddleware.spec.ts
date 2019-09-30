import {
  patchGroupStreakMiddlewares,
  groupStreakRequestBodyValidationMiddleware,
  getPatchGroupStreakMiddleware,
  patchGroupStreakMiddleware,
  sendUpdatedGroupStreakMiddleware,
  groupStreakParamsValidationMiddleware
} from "./patchGroupStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("groupStreakParamsValidationMiddleware", () => {
  test("sends correct error response when groupStreakId is not defined", () => {
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

  test("sends correct error response when groupStreakId is not a string", () => {
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

describe("groupStreakRequestBodyValidationMiddleware", () => {
  const creatorId = "creatorId";
  const streakName = "streakName";
  const streakDescription = "streakDescription";
  const numberOfMinutes = 30;
  const timezone = "timezone";
  const status = "active";

  const body = {
    creatorId,
    streakName,
    streakDescription,
    numberOfMinutes,
    timezone,
    status
  };

  test("sends correct error response when unsupported key is sent", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        unsupportedKey: 1234
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupStreakRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.badRequest);
    expect(send).toBeCalledWith({
      message: '"unsupportedKey" is not allowed'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error when streakName is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        streakName: 123
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupStreakRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "streakName" fails because ["streakName" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct response is sent when streakDescription is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        streakDescription: 123
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupStreakRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "streakDescription" fails because ["streakDescription" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when numberOfMinutes is not a number", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        numberOfMinutes: "abc"
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupStreakRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "numberOfMinutes" fails because ["numberOfMinutes" must be a number]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when timezone is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        timezone: 123
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupStreakRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "timezone" fails because ["timezone" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when status is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        status: 123
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    groupStreakRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "status" fails because ["status" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("patchGroupStreakMiddleware", () => {
  test("sets response.locals.updatedGroupStreak", async () => {
    expect.assertions(3);
    const groupStreakId = "abc123";
    const userId = "123cde";
    const name = "Daily programming";
    const description = "Do one hour of programming each day";
    const request: any = {
      params: { groupStreakId },
      body: {
        userId,
        name,
        description
      }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
    const groupStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchGroupStreakMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(findByIdAndUpdate).toBeCalledWith(
      groupStreakId,
      { userId, name, description },
      { new: true }
    );
    expect(response.locals.updatedGroupStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws UpdatedGroupStreakNotFound error when solo streak is not found", async () => {
    expect.assertions(1);
    const groupStreakId = "abc123";
    const userId = "123cde";
    const name = "Daily programming";
    const description = "Do one hour of programming each day";
    const request: any = {
      params: { groupStreakId },
      body: {
        userId,
        name,
        description
      }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
    const groupStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchGroupStreakMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.UpdatedGroupStreakNotFound)
    );
  });

  test("calls next with PatchGroupStreakMiddleware on middleware failure", async () => {
    expect.assertions(1);
    const groupStreakId = "abc123";
    const userId = "123cde";
    const name = "Daily programming";
    const description = "Do one hour of programming each day";
    const request: any = {
      params: { groupStreakId },
      body: {
        userId,
        name,
        description
      }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const errorMessage = "error";
    const findByIdAndUpdate = jest.fn(() => Promise.reject(errorMessage));
    const groupStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchGroupStreakMiddleware(groupStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.PatchGroupStreakMiddleware)
    );
  });
});

describe("sendUpdatedPatchMiddleware", () => {
  const ERROR_MESSAGE = "error";
  const updatedGroupStreak = {
    userId: "abc",
    streakName: "Daily Spanish",
    streakDescription: "Practice spanish every day",
    startDate: new Date()
  };

  test("sends updatedGroupStreak", () => {
    expect.assertions(4);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const groupStreakResponseLocals = { updatedGroupStreak };
    const response: any = { locals: groupStreakResponseLocals, status };
    const request: any = {};
    const next = jest.fn();
    const updatedResourceResponseCode = 200;

    sendUpdatedGroupStreakMiddleware(request, response, next);

    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(updatedResourceResponseCode);
    expect(send).toBeCalledWith(updatedGroupStreak);
  });

  test("calls next with SendUpdatedGroupStreakMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { updatedGroupStreak }, status };
    const request: any = {};
    const next = jest.fn();

    sendUpdatedGroupStreakMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendUpdatedGroupStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("patchGroupStreakMiddlewares", () => {
  test("are defined in the correct order", () => {
    expect.assertions(5);

    expect(patchGroupStreakMiddlewares.length).toBe(4);
    expect(patchGroupStreakMiddlewares[0]).toBe(
      groupStreakParamsValidationMiddleware
    );
    expect(patchGroupStreakMiddlewares[1]).toBe(
      groupStreakRequestBodyValidationMiddleware
    );
    expect(patchGroupStreakMiddlewares[2]).toBe(patchGroupStreakMiddleware);
    expect(patchGroupStreakMiddlewares[3]).toBe(
      sendUpdatedGroupStreakMiddleware
    );
  });
});
