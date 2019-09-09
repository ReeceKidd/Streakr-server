import {
  createGroupMemberStreakMiddlewares,
  createGroupMemberStreakBodyValidationMiddleware,
  createGroupMemberStreakFromRequestMiddleware,
  getCreateGroupMemberStreakFromRequestMiddleware,
  saveGroupMemberStreakToDatabaseMiddleware,
  sendFormattedGroupMemberStreakMiddleware,
  retreiveUserMiddleware,
  getRetreiveGroupStreakMiddleware,
  getRetreiveUserMiddleware,
  retreiveGroupStreakMiddleware
} from "./createGroupMemberStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe(`createGroupMemberStreakBodyValidationMiddleware`, () => {
  const userId = "12345678";
  const groupStreakId = "abcdefg";

  const body = {
    userId,
    groupStreakId
  };

  test("valid request passes validation", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupMemberStreakBodyValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends userId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, userId: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupMemberStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends groupStreakId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { ...body, groupStreakId: undefined }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupMemberStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupStreakId" fails because ["groupStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("retreiveUserMiddleware", () => {
  test("sets response.locals.user and calls next()", async () => {
    expect.assertions(4);
    const lean = jest.fn(() => true);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const userId = "abcdefg";
    const request: any = { body: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveUserMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(response.locals.user).toBeDefined();
    expect(findOne).toBeCalledWith({ _id: userId });
    expect(lean).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws CreateGroupMemberStreakUserDoesNotExist when user does not exist", async () => {
    expect.assertions(1);
    const userId = "abcd";
    const lean = jest.fn(() => false);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const request: any = { body: { userId } };
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveUserMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.CreateGroupMemberStreakUserDoesNotExist)
    );
  });

  test("throws CreateGroupMemberStreakRetreiveUserMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const userId = "abcd";
    const findOne = jest.fn(() => ({}));
    const userModel = { findOne };
    const request: any = { body: { userId } };
    const response: any = { status, locals: {} };
    const next = jest.fn();
    const middleware = getRetreiveUserMiddleware(userModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateGroupMemberStreakRetreiveUserMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("retreiveGroupStreakMiddleware", () => {
  test("sets response.locals.soloStreak and calls next()", async () => {
    expect.assertions(3);
    const groupStreakId = "abc";
    const request: any = {
      body: { groupStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(true));
    const groupStreakModel = { findOne };
    const middleware = getRetreiveGroupStreakMiddleware(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ _id: groupStreakId });
    expect(response.locals.groupStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws CreateGroupMemberStreakGroupStreakDoesNotExist error when solo streak does not exist", async () => {
    expect.assertions(1);
    const soloStreakId = "abc";
    const request: any = {
      body: { soloStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(false));
    const groupStreakModel = { findOne };
    const middleware = getRetreiveGroupStreakMiddleware(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.CreateGroupMemberStreakGroupStreakDoesNotExist)
    );
  });

  test("throws CreateGroupMemberStreakRetreiveGroupStreakMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(true));
    const groupStreakModel = { findOne };
    const middleware = getRetreiveGroupStreakMiddleware(
      groupStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateGroupMemberStreakRetreiveGroupStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createGroupMemberStreakFromRequestMiddleware`, () => {
  test("sets response.locals.newGroupMemberStreak", async () => {
    expect.assertions(2);
    const userId = "abcdefg";
    const groupStreakId = "1a2b3c";
    const timezone = "Europe/London";
    class GroupMemberStreak {
      userId: string;
      groupStreakId: string;
      timezone: string;

      constructor({ userId, groupStreakId, timezone }: any) {
        this.userId = userId;
        this.groupStreakId = groupStreakId;
        this.timezone = timezone;
      }
    }
    const response: any = { locals: { timezone } };
    const request: any = { body: { userId, groupStreakId } };
    const next = jest.fn();
    const newGroupMemberStreak = new GroupMemberStreak({
      userId,
      groupStreakId,
      timezone
    });
    const middleware = getCreateGroupMemberStreakFromRequestMiddleware(
      GroupMemberStreak as any
    );

    middleware(request, response, next);

    expect(response.locals.newGroupMemberStreak).toEqual(newGroupMemberStreak);
    expect(next).toBeCalledWith();
  });

  test("calls next with CreateGroupMemberStreakFromRequestMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const timezone = "Europe/London";
    const userId = "abcdefg";
    const name = "streak name";
    const description = "mock streak description";
    const response: any = { locals: { timezone } };
    const request: any = { body: { userId, name, description } };
    const next = jest.fn();
    const middleware = getCreateGroupMemberStreakFromRequestMiddleware(
      {} as any
    );

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateGroupMemberStreakFromRequestMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`saveGroupMemberStreakToDatabaseMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  test("sets response.locals.savedGroupMemberStreak", async () => {
    expect.assertions(3);
    const save = jest.fn(() => {
      return Promise.resolve(true);
    });
    const mockGroupMemberStreak = {
      userId: "abcdefg",
      email: "user@gmail.com",
      password: "password",
      save
    } as any;
    const response: any = {
      locals: { newGroupMemberStreak: mockGroupMemberStreak }
    };
    const request: any = {};
    const next = jest.fn();

    await saveGroupMemberStreakToDatabaseMiddleware(request, response, next);

    expect(save).toBeCalled();
    expect(response.locals.savedGroupMemberStreak).toBeDefined();
    expect(next).toBeCalled();
  });

  test("calls next with SaveGroupMemberStreakToDatabaseMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const save = jest.fn(() => {
      return Promise.reject(ERROR_MESSAGE);
    });
    const request: any = {};
    const response: any = { locals: { newGroupMemberStreak: { save } } };
    const next = jest.fn();

    await saveGroupMemberStreakToDatabaseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SaveGroupMemberStreakToDatabaseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`sendFormattedGroupMemberStreakMiddleware`, () => {
  const ERROR_MESSAGE = "error";
  const savedGroupMemberStreak = {
    userId: "abc",
    streakName: "Daily Spanish",
    streakDescription: "Practice spanish every day",
    startDate: new Date()
  };

  test("responds with status 201 with groupMemberStreak", () => {
    expect.assertions(4);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const groupMemberStreakResponseLocals = {
      savedGroupMemberStreak
    };
    const response: any = { locals: groupMemberStreakResponseLocals, status };
    const request: any = {};
    const next = jest.fn();

    sendFormattedGroupMemberStreakMiddleware(request, response, next);

    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith(savedGroupMemberStreak);
  });

  test("calls next with SendFormattedGroupMemberStreakMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { savedGroupMemberStreak }, status };

    const request: any = {};
    const next = jest.fn();

    sendFormattedGroupMemberStreakMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendFormattedGroupMemberStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createGroupMemberStreakMiddlewares`, () => {
  test("that createGroupMemberStreak middlewares are defined in the correct order", async () => {
    expect.assertions(7);

    expect(createGroupMemberStreakMiddlewares.length).toEqual(6);
    expect(createGroupMemberStreakMiddlewares[0]).toBe(
      createGroupMemberStreakBodyValidationMiddleware
    );
    expect(createGroupMemberStreakMiddlewares[1]).toBe(retreiveUserMiddleware);
    expect(createGroupMemberStreakMiddlewares[2]).toBe(
      retreiveGroupStreakMiddleware
    );
    expect(createGroupMemberStreakMiddlewares[3]).toBe(
      createGroupMemberStreakFromRequestMiddleware
    );
    expect(createGroupMemberStreakMiddlewares[4]).toBe(
      saveGroupMemberStreakToDatabaseMiddleware
    );
    expect(createGroupMemberStreakMiddlewares[5]).toBe(
      sendFormattedGroupMemberStreakMiddleware
    );
  });
});
