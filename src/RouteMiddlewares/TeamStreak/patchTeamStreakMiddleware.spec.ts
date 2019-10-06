import {
  patchTeamStreakMiddlewares,
  teamStreakRequestBodyValidationMiddleware,
  getPatchTeamStreakMiddleware,
  patchTeamStreakMiddleware,
  sendUpdatedTeamStreakMiddleware,
  teamStreakParamsValidationMiddleware
} from "./patchTeamStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe("teamStreakParamsValidationMiddleware", () => {
  test("sends correct error response when teamStreakId is not defined", () => {
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

    teamStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "teamStreakId" fails because ["teamStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when teamStreakId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      params: { teamStreakId: 123 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    teamStreakParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "teamStreakId" fails because ["teamStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("teamStreakRequestBodyValidationMiddleware", () => {
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

    teamStreakRequestBodyValidationMiddleware(request, response, next);

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

    teamStreakRequestBodyValidationMiddleware(request, response, next);

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

    teamStreakRequestBodyValidationMiddleware(request, response, next);

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

    teamStreakRequestBodyValidationMiddleware(request, response, next);

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

    teamStreakRequestBodyValidationMiddleware(request, response, next);

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

    teamStreakRequestBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "status" fails because ["status" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("patchTeamStreakMiddleware", () => {
  test("sets response.locals.updatedTeamStreak", async () => {
    expect.assertions(3);
    const teamStreakId = "abc123";
    const userId = "123cde";
    const name = "Daily programming";
    const description = "Do one hour of programming each day";
    const request: any = {
      params: { teamStreakId },
      body: {
        userId,
        name,
        description
      }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findByIdAndUpdate = jest.fn(() => Promise.resolve(true));
    const teamStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchTeamStreakMiddleware(teamStreakModel as any);

    await middleware(request, response, next);

    expect(findByIdAndUpdate).toBeCalledWith(
      teamStreakId,
      { userId, name, description },
      { new: true }
    );
    expect(response.locals.updatedTeamStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws UpdatedTeamStreakNotFound error when solo streak is not found", async () => {
    expect.assertions(1);
    const teamStreakId = "abc123";
    const userId = "123cde";
    const name = "Daily programming";
    const description = "Do one hour of programming each day";
    const request: any = {
      params: { teamStreakId },
      body: {
        userId,
        name,
        description
      }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findByIdAndUpdate = jest.fn(() => Promise.resolve(false));
    const teamStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchTeamStreakMiddleware(teamStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.UpdatedTeamStreakNotFound)
    );
  });

  test("calls next with PatchTeamStreakMiddleware on middleware failure", async () => {
    expect.assertions(1);
    const teamStreakId = "abc123";
    const userId = "123cde";
    const name = "Daily programming";
    const description = "Do one hour of programming each day";
    const request: any = {
      params: { teamStreakId },
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
    const TeamStreakModel = {
      findByIdAndUpdate
    };
    const middleware = getPatchTeamStreakMiddleware(TeamStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.PatchTeamStreakMiddleware)
    );
  });
});

describe("sendUpdatedPatchMiddleware", () => {
  const ERROR_MESSAGE = "error";
  const updatedTeamStreak = {
    userId: "abc",
    streakName: "Daily Spanish",
    streakDescription: "Practice spanish every day",
    startDate: new Date()
  };

  test("sends updatedTeamStreak", () => {
    expect.assertions(4);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const teamStreakResponseLocals = { updatedTeamStreak };
    const response: any = { locals: teamStreakResponseLocals, status };
    const request: any = {};
    const next = jest.fn();
    const updatedResourceResponseCode = 200;

    sendUpdatedTeamStreakMiddleware(request, response, next);

    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(updatedResourceResponseCode);
    expect(send).toBeCalledWith(updatedTeamStreak);
  });

  test("calls next with SendUpdatedTeamStreakMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { updatedTeamStreak }, status };
    const request: any = {};
    const next = jest.fn();

    sendUpdatedTeamStreakMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendUpdatedTeamStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("patchTeamStreakMiddlewares", () => {
  test("are defined in the correct order", () => {
    expect.assertions(5);

    expect(patchTeamStreakMiddlewares.length).toBe(4);
    expect(patchTeamStreakMiddlewares[0]).toBe(
      teamStreakParamsValidationMiddleware
    );
    expect(patchTeamStreakMiddlewares[1]).toBe(
      teamStreakRequestBodyValidationMiddleware
    );
    expect(patchTeamStreakMiddlewares[2]).toBe(patchTeamStreakMiddleware);
    expect(patchTeamStreakMiddlewares[3]).toBe(sendUpdatedTeamStreakMiddleware);
  });
});
