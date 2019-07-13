import {
  createSoloStreakMiddlewares,
  soloStreakRegistrationValidationMiddleware,
  createSoloStreakFromRequestMiddleware,
  getCreateSoloStreakFromRequestMiddleware,
  saveSoloStreakToDatabaseMiddleware,
  sendFormattedSoloStreakMiddleware,
  defineEndOfDayMiddleware,
  defineCurrentTimeMiddleware,
  defineStartDayMiddleware,
  getDefineCurrentTimeMiddleware,
  getDefineStartDayMiddleware,
  getDefineEndOfDayMiddleware
} from "./createSoloStreakMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";

describe(`soloStreakRegistrationValidationMiddlware`, () => {
  const userId = "12345678";
  const name = "Spanish Streak";
  const description = " Do the insane amount of XP for Duolingo each day";

  test("valid request passes validation", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId, name, description }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakRegistrationValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends userId is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { name, description }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakRegistrationValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends userId is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId: 1234, name, description }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakRegistrationValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends name is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId, description }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakRegistrationValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "name" fails because ["name" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends name is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId, name: 1234, description }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakRegistrationValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "name" fails because ["name" must be a string]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends description is missing error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId, name }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakRegistrationValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "description" fails because ["description" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends description is not a string error", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId, name, description: 1234 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakRegistrationValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "description" fails because ["description" must be a string]'
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

describe(`createSoloStreakFromRequestMiddleware`, () => {
  test("sets response.locals.newSoloStreak", async () => {
    expect.assertions(2);
    const userId = "abcdefg";
    const name = "streak name";
    const description = "mock streak description";
    const timezone = "Europe/London";
    class SoloStreak {
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
    const newSoloStreak = new SoloStreak({
      userId,
      name,
      description,
      timezone
    });
    const middleware = getCreateSoloStreakFromRequestMiddleware(
      SoloStreak as any
    );

    middleware(request, response, next);

    expect(response.locals.newSoloStreak).toEqual(newSoloStreak);
    expect(next).toBeCalledWith();
  });

  test("calls next with CreateSoloStreakFromRequestMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const timezone = "Europe/London";
    const userId = "abcdefg";
    const name = "streak name";
    const description = "mock streak description";
    const response: any = { locals: { timezone } };
    const request: any = { body: { userId, name, description } };
    const next = jest.fn();
    const middleware = getCreateSoloStreakFromRequestMiddleware({} as any);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateSoloStreakFromRequestMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`saveSoloStreakToDatabaseMiddleware`, () => {
  const ERROR_MESSAGE = "error";

  test("sets response.locals.savedSoloStreak", async () => {
    expect.assertions(3);
    const save = jest.fn(() => {
      return Promise.resolve(true);
    });
    const mockSoloStreak = {
      userId: "abcdefg",
      email: "user@gmail.com",
      password: "password",
      save
    } as any;
    const response: any = { locals: { newSoloStreak: mockSoloStreak } };
    const request: any = {};
    const next = jest.fn();

    await saveSoloStreakToDatabaseMiddleware(request, response, next);

    expect(save).toBeCalled();
    expect(response.locals.savedSoloStreak).toBeDefined();
    expect(next).toBeCalled();
  });

  test("calls next with SaveSoloStreakToDatabaseMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const save = jest.fn(() => {
      return Promise.reject(ERROR_MESSAGE);
    });
    const request: any = {};
    const response: any = { locals: { newSoloStreak: { save } } };
    const next = jest.fn();

    await saveSoloStreakToDatabaseMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SaveSoloStreakToDatabaseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`sendFormattedSoloStreakMiddleware`, () => {
  const ERROR_MESSAGE = "error";
  const savedSoloStreak = {
    userId: "abc",
    streakName: "Daily Spanish",
    streakDescription: "Practice spanish every day",
    startDate: new Date()
  };

  test("responds with status 201 with soloStreak", () => {
    expect.assertions(4);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const soloStreakResponseLocals = {
      savedSoloStreak
    };
    const response: any = { locals: soloStreakResponseLocals, status };
    const request: any = {};
    const next = jest.fn();

    sendFormattedSoloStreakMiddleware(request, response, next);

    expect(response.locals.user).toBeUndefined();
    expect(next).not.toBeCalled();
    expect(status).toBeCalledWith(ResponseCodes.created);
    expect(send).toBeCalledWith(savedSoloStreak);
  });

  test("calls next with SendFormattedSoloStreakMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const send = jest.fn(() => {
      throw new Error(ERROR_MESSAGE);
    });
    const status = jest.fn(() => ({ send }));
    const response: any = { locals: { savedSoloStreak }, status };

    const request: any = {};
    const next = jest.fn();

    sendFormattedSoloStreakMiddleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendFormattedSoloStreakMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createSoloStreakMiddlewares`, () => {
  test("that createSoloStreak middlewares are defined in the correct order", async () => {
    expect.assertions(8);

    expect(createSoloStreakMiddlewares.length).toEqual(7);
    expect(createSoloStreakMiddlewares[0]).toBe(
      soloStreakRegistrationValidationMiddleware
    );
    expect(createSoloStreakMiddlewares[1]).toBe(defineCurrentTimeMiddleware);
    expect(createSoloStreakMiddlewares[2]).toBe(defineStartDayMiddleware);
    expect(createSoloStreakMiddlewares[3]).toBe(defineEndOfDayMiddleware);
    expect(createSoloStreakMiddlewares[4]).toBe(
      createSoloStreakFromRequestMiddleware
    );
    expect(createSoloStreakMiddlewares[5]).toBe(
      saveSoloStreakToDatabaseMiddleware
    );
    expect(createSoloStreakMiddlewares[6]).toBe(
      sendFormattedSoloStreakMiddleware
    );
  });
});
