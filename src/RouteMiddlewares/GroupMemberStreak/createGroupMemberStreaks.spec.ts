import {
  createGroupMemberStreakMiddlewares,
  createGroupMemberStreakBodyValidationMiddleware,
  createGroupMemberStreakFromRequestMiddleware,
  getCreateGroupMemberStreakFromRequestMiddleware,
  saveGroupMemberStreakToDatabaseMiddleware,
  sendFormattedGroupMemberStreakMiddleware
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
describe(`createGroupMemberStreakFromRequestMiddleware`, () => {
  test("sets response.locals.newGroupMemberStreak", async () => {
    expect.assertions(2);
    const userId = "abcdefg";
    const name = "streak name";
    const description = "mock streak description";
    const timezone = "Europe/London";
    class GroupMemberStreak {
      userId: string;
      name: string;
      description: string;
      timezone: string;

      constructor({ userId, name, description, timezone }: any) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.timezone = timezone;
      }
    }
    const response: any = { locals: { timezone } };
    const request: any = { body: { userId, name, description } };
    const next = jest.fn();
    const newGroupMemberStreak = new GroupMemberStreak({
      userId,
      name,
      description,
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
    expect.assertions(5);

    expect(createGroupMemberStreakMiddlewares.length).toEqual(4);
    expect(createGroupMemberStreakMiddlewares[0]).toBe(
      createGroupMemberStreakBodyValidationMiddleware
    );
    expect(createGroupMemberStreakMiddlewares[1]).toBe(
      createGroupMemberStreakFromRequestMiddleware
    );
    expect(createGroupMemberStreakMiddlewares[2]).toBe(
      saveGroupMemberStreakToDatabaseMiddleware
    );
    expect(createGroupMemberStreakMiddlewares[3]).toBe(
      sendFormattedGroupMemberStreakMiddleware
    );
  });
});
