import {
  createGroupStreakMiddlewares,
  createGroupStreakBodyValidationMiddleware,
  createGroupStreakFromRequestMiddleware,
  getCreateGroupStreakFromRequestMiddleware,
  saveGroupStreakToDatabaseMiddleware,
  sendFormattedGroupStreakMiddleware,
  defineEndOfDayMiddleware,
  defineCurrentTimeMiddleware,
  defineStartDayMiddleware,
  getDefineCurrentTimeMiddleware,
  getDefineStartDayMiddleware,
  getDefineEndOfDayMiddleware
} from "./createGroupStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe(`createGroupStreakBodyValidationMiddleware`, () => {
  const creatorId = "abcdefgh";
  const groupName = "Weightwatchers London";
  const streakName = "Followed our calorie level";
  const streakDescription = "Stuck to our recommended calorie level";
  const members: string[] = [];

  const body = {
    creatorId,
    groupName,
    streakName,
    streakDescription,
    members
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

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends creatorId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        creatorId: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "creatorId" fails because ["creatorId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends groupName is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        groupName: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "groupName" fails because ["groupName" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends streakName is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        streakName: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "streakName" fails because ["streakName" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends streakDescription is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        streakDescription: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "streakDescription" fails because ["streakDescription" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends members is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: {
        ...body,
        members: undefined
      }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    createGroupStreakBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "members" fails because ["members" is required]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("defineCurrentTimeMiddleware", () => {
  test("sets response.locals.currentTime", () => {
    expect.assertions(4);
    const timezone = "Europe/London";
    const tz = jest.fn(() => true);
    const moment = jest.fn(() => ({ tz }));
    const request: any = {};
    const response: any = { locals: { timezone } };
    const next = jest.fn();
    const middleware = getDefineCurrentTimeMiddleware(moment);

    middleware(request, response, next);

    expect(moment).toBeCalledWith();
    expect(tz).toBeCalledWith(timezone);
    expect(response.locals.currentTime).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("calls next with DefineCurrentTimeMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const moment = jest.fn(() => ({}));
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getDefineCurrentTimeMiddleware(moment);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DefineCurrentTimeMiddleware, expect.any(Error))
    );
  });
});

describe("defineStartDayMiddleware", () => {
  test("sets response.locals.startDay", () => {
    expect.assertions(3);
    const dayFormat = "DD/MM/YYYY";
    const format = jest.fn(() => true);
    const currentTime = {
      format
    };
    const request: any = {};
    const response: any = { locals: { currentTime } };
    const next = jest.fn();
    const middleware = getDefineStartDayMiddleware(dayFormat);

    middleware(request, response, next);

    expect(response.locals.startDay).toBeDefined();
    expect(format).toBeCalledWith(dayFormat);
    expect(next).toBeCalledWith();
  });

  test("calls next with DefineStartDayMiddleware on middleware failure", () => {
    expect.assertions(1);
    const dayFormat = "DD/MM/YYYY";
    const currentTime = {};
    const request: any = {};
    const response: any = { locals: { currentTime } };
    const next = jest.fn();
    const middleware = getDefineStartDayMiddleware(dayFormat);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DefineStartDayMiddleware)
    );
  });
});

describe("defineEndOfDayMiddleware", () => {
  test("sets response.locals.endOfDay", () => {
    expect.assertions(4);
    const toDate = jest.fn(() => new Date());
    const endOf = jest.fn(() => ({ toDate }));
    const currentTime = {
      endOf
    };
    const request: any = {};
    const response: any = {
      locals: { currentTime }
    };
    const next = jest.fn();
    const dayTimeRange = "day";
    const middleware = getDefineEndOfDayMiddleware(dayTimeRange);

    middleware(request, response, next);

    expect(response.locals.endOfDay).toBeDefined();
    expect(endOf).toBeCalledWith(dayTimeRange);
    expect(toDate).toBeCalled();
    expect(next).toBeCalledWith();
  });

  test("calls next with DefineEndOfDayMiddleware on middleware failure", () => {
    expect.assertions(1);
    const endOf = jest.fn(() => ({}));
    const currentTime = {
      endOf
    };
    const request: any = {};
    const response: any = {
      locals: { currentTime }
    };
    const next = jest.fn();
    const dayTimeRange = "day";
    const middleware = getDefineEndOfDayMiddleware(dayTimeRange);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.DefineEndOfDayMiddleware)
    );
  });
});

describe(`createGroupStreakFromRequestMiddleware`, () => {
  test("sets response.locals.newGroupStreak", async () => {
    expect.assertions(2);

    const creatorId = "abcdefg";
    const groupName = "Spanish Learners";
    const streakName = "30 minutes of Spanish";
    const streakDescription = "Everyday we must do 30 minutes of Spanish";
    const members: string[] = [];
    const timezone = "Europe/London";

    class GroupStreak {
      creatorId: string;
      groupName: string;
      streakName: string;
      streakDescription: string;
      members: string[];
      timezone: string;

      constructor({
        creatorId,
        groupName,
        streakName,
        streakDescription,
        members,
        timezone
      }: any) {
        this.creatorId = creatorId;
        this.groupName = groupName;
        this.streakName = streakName;
        this.streakDescription = streakDescription;
        this.members = members;
        this.timezone = timezone;
      }
    }
    const response: any = { locals: { timezone } };
    const request: any = {
      body: {
        creatorId,
        groupName,
        streakName,
        streakDescription,
        members,
        timezone
      }
    };
    const next = jest.fn();
    const newGroupStreak = new GroupStreak({
      creatorId,
      groupName,
      streakName,
      streakDescription,
      members,
      timezone
    });
    const middleware = getCreateGroupStreakFromRequestMiddleware(
      GroupStreak as any
    );

    middleware(request, response, next);

    expect(response.locals.newGroupStreak).toEqual(newGroupStreak);
    expect(next).toBeCalledWith();
  });

  test("calls next with CreateGroupStreakFromRequestMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const timezone = "Europe/London";
    const userId = "abcdefg";
    const name = "streak name";
    const description = "mock streak description";
    const response: any = { locals: { timezone } };
    const request: any = { body: { userId, name, description } };
    const next = jest.fn();
    const middleware = getCreateGroupStreakFromRequestMiddleware({} as any);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateGroupStreakFromRequestMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`saveGroupStreakToDatabaseMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  test("sets response.locals.savedGroupStreak", async () => {
    expect.assertions(3);
    const save = jest.fn(() => {
      return Promise.resolve(true);
    });
    const mockGroupStreak = {
      userId: "abcdefg",
      email: "user@gmail.com",
      password: "password",
      save
    } as any;
    const response: any = { locals: { newGroupStreak: mockGroupStreak } };
    const request: any = {};
    const next = jest.fn();

    await saveGroupStreakToDatabaseMiddleware(request, response, next);

    expect(save).toBeCalled();
    expect(response.locals.savedGroupStreak).toBeDefined();
    expect(next).toBeCalled();
  });

  test("calls next with SaveGroupStreakToDatabaseMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const save = jest.fn(() => {
      return Promise.reject(ERROR_MESSAGE);
    });
    const request: any = {};
    const response: any = { locals: { newGroupStreak: { save } } };
    const next = jest.fn();

    await saveGroupStreakToDatabaseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SaveGroupStreakToDatabaseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`sendFormattedGroupStreakMiddleware`, () => {
  const ERROR_MESSAGE = "error";
  const savedGroupStreak = {
    userId: "abc",
    streakName: "Daily Spanish",
    streakDescription: "Practice spanish every day",
    startDate: new Date()
  };

  test("responds with status 201 with groupStreak", () => {
    expect.assertions(4);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const groupStreakResponseLocals = {
      savedGroupStreak
    };
    const response: any = { locals: groupStreakResponseLocals, status };
    const request: any = {};
    const next = jest.fn();

    sendFormattedGroupStreakMiddleware(request, response, next);

    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith(savedGroupStreak);
  });

  test("calls next with SendFormattedGroupStreakMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { savedGroupStreak }, status };

    const request: any = {};
    const next = jest.fn();

    sendFormattedGroupStreakMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendFormattedGroupStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createGroupStreakMiddlewares`, () => {
  test("that createGroupStreak middlewares are defined in the correct order", async () => {
    expect.assertions(8);

    expect(createGroupStreakMiddlewares.length).toEqual(7);
    expect(createGroupStreakMiddlewares[0]).toBe(
      createGroupStreakBodyValidationMiddleware
    );
    expect(createGroupStreakMiddlewares[1]).toBe(defineCurrentTimeMiddleware);
    expect(createGroupStreakMiddlewares[2]).toBe(defineStartDayMiddleware);
    expect(createGroupStreakMiddlewares[3]).toBe(defineEndOfDayMiddleware);
    expect(createGroupStreakMiddlewares[4]).toBe(
      createGroupStreakFromRequestMiddleware
    );
    expect(createGroupStreakMiddlewares[5]).toBe(
      saveGroupStreakToDatabaseMiddleware
    );
    expect(createGroupStreakMiddlewares[6]).toBe(
      sendFormattedGroupStreakMiddleware
    );
  });
});
