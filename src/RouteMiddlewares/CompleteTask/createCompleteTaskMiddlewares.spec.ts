import {
  createCompleteTaskMiddlewares,
  hasTaskAlreadyBeenCompletedTodayMiddleware,
  retreiveUserMiddleware,
  setTaskCompleteTimeMiddleware,
  setDayTaskWasCompletedMiddleware,
  sendTaskCompleteResponseMiddleware,
  createCompleteTaskDefinitionMiddleware,
  soloStreakExistsMiddleware,
  saveTaskCompleteMiddleware,
  streakMaintainedMiddleware,
  getSoloStreakExistsMiddleware,
  getRetreiveUserMiddleware,
  getSetDayTaskWasCompletedMiddleware,
  getSetTaskCompleteTimeMiddleware,
  getHasTaskAlreadyBeenCompletedTodayMiddleware,
  getCreateCompleteTaskDefinitionMiddleware,
  getSaveTaskCompleteMiddleware,
  getStreakMaintainedMiddleware,
  getSendTaskCompleteResponseMiddleware,
  setStreakStartDateMiddleware,
  getSetStreakStartDateMiddleware,
  completeTaskBodyValidationMiddleware
} from "./createCompleteTaskMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { SupportedRequestHeaders } from "../../Server/headers";

describe(`completeTaskBodyValidationMiddleware`, () => {
  const userId = "abcdefgh";
  const soloStreakId = "123456";

  test("calls next() when correct body is supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId, soloStreakId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeTaskBodyValidationMiddleware(request, response, next);

    expect(next).toBeCalled();
  });

  test("sends correct error response when userId is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { soloStreakId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeTaskBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when soloStreakId is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeTaskBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "soloStreakId" fails because ["soloStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when soloStreakId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { soloStreakId: 1234, userId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeTaskBodyValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "soloStreakId" fails because ["soloStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("soloStreakExistsMiddleware", () => {
  test("sets response.locals.soloStreak and calls next()", async () => {
    expect.assertions(3);
    const soloStreakId = "abc";
    const request: any = {
      body: { soloStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = { findOne };
    const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ _id: soloStreakId });
    expect(response.locals.soloStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws SoloStreakDoesNotExist error when solo streak does not exist", async () => {
    expect.assertions(1);
    const soloStreakId = "abc";
    const request: any = {
      body: { soloStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(false));
    const soloStreakModel = { findOne };
    const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SoloStreakDoesNotExist)
    );
  });

  test("throws SoloStreakExistsMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = { findOne };
    const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SoloStreakExistsMiddleware, expect.any(Error))
    );
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

  test("throws UserDoesNotExistError when user does not exist", async () => {
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

    expect(next).toBeCalledWith(new CustomError(ErrorType.UserDoesNotExist));
  });

  test("throws RetreiveUserMiddleware error on middleware failure", async () => {
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
      new CustomError(ErrorType.RetreiveUserMiddleware, expect.any(Error))
    );
  });
});

describe("setTaskCompleteTimeMiddleware", () => {
  test("sets response.locals.taskCompleteTime and calls next()", () => {
    expect.assertions(4);
    const timezone = "Europe/London";
    const tz = jest.fn(() => true);
    const moment = jest.fn(() => ({ tz }));
    const request: any = {};
    const response: any = { locals: { timezone } };
    const next = jest.fn();
    const middleware = getSetTaskCompleteTimeMiddleware(moment);

    middleware(request, response, next);

    expect(moment).toBeCalledWith();
    expect(tz).toBeCalledWith(timezone);
    expect(response.locals.taskCompleteTime).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws SetTaskCompleteTimeMiddlewre error on middleware failure", () => {
    expect.assertions(1);
    const tz = jest.fn(() => true);
    const moment = jest.fn(() => ({ tz }));
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSetTaskCompleteTimeMiddleware(moment);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SetTaskCompleteTimeMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("setStreakStartDateMiddleware", () => {
  test("sets soloStreak.startDate to taskCompleteTime if it's undefined and calls next()", async () => {
    expect.assertions(2);
    const updateOne = jest.fn().mockResolvedValue(true);
    const soloStreakModel: any = {
      updateOne
    };
    const taskCompleteTime = new Date();
    const soloStreakId = 1;
    const soloStreak = {
      _id: soloStreakId,
      currentStreak: {
        startDate: undefined,
        numberOfDaysInARow: 0
      }
    };
    const request: any = {};
    const response: any = { locals: { soloStreak, taskCompleteTime } };
    const next: any = jest.fn();
    const middleware = await getSetStreakStartDateMiddleware(soloStreakModel);

    await middleware(request, response, next);

    expect(updateOne).toBeCalledWith(
      { _id: soloStreakId },
      {
        currentStreak: { startDate: taskCompleteTime, numberOfDaysInARow: 0 }
      }
    );
    expect(next).toBeCalledWith();
  });

  test("doesn't update soloStreak currentStreak.startDate if it's already set", async () => {
    expect.assertions(2);
    const findByIdAndUpdate = jest.fn();
    const soloStreakModel: any = {
      findByIdAndUpdate
    };
    const taskCompleteTime = new Date();
    const soloStreakId = 1;
    const soloStreak = {
      currentStreak: {
        startDate: new Date()
      }
    };
    const request: any = { params: { soloStreakId } };
    const response: any = { locals: { soloStreak, taskCompleteTime } };
    const next: any = jest.fn();
    const middleware = await getSetStreakStartDateMiddleware(soloStreakModel);

    await middleware(request, response, next);

    expect(findByIdAndUpdate).not.toBeCalled();
    expect(next).toBeCalledWith();
  });

  test("throws SetStreakStartDateMiddleware on middleware failure", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSetStreakStartDateMiddleware(undefined as any);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SetStreakStartDateMiddleware, expect.any(Error))
    );
  });
});

describe("setDayTaskWasCompletedMiddleware", () => {
  test("sets response.locals.taskCompleteTime and calls next()", () => {
    expect.assertions(3);
    const dayFormat = "DD/MM/YYYY";
    const format = jest.fn(() => true);
    const taskCompleteTime = {
      format
    };
    const request: any = {};
    const response: any = { locals: { taskCompleteTime } };
    const next = jest.fn();
    const middleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

    middleware(request, response, next);

    expect(format).toBeCalledWith(dayFormat);
    expect(response.locals.taskCompleteDay).toBeDefined();
    expect(next).toBeDefined();
  });

  test("throws setDayTaskWasCompletedMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const dayFormat = "DD/MM/YYYY";
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getSetDayTaskWasCompletedMiddleware(dayFormat);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SetDayTaskWasCompletedMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("hasTaskAlreadyBeenCompletedTodayMiddleware", () => {
  test("checks task has not already been completed today", async () => {
    expect.assertions(2);
    const findOne = jest.fn(() => Promise.resolve(false));
    const completeTaskModel = { findOne };
    const soloStreakId = "abcd";
    const taskCompleteDay = "26/04/2012";
    const userId = "Abcde";
    const request: any = { body: { userId, soloStreakId } };
    const response: any = { locals: { taskCompleteDay } };
    const next = jest.fn();
    const middleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
      completeTaskModel as any
    );

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({
      userId,
      streakId: soloStreakId,
      taskCompleteDay
    });
    expect(next).toBeCalledWith();
  });

  test("throws TaskAlreadyCompletedToday error if task has already been completed today", async () => {
    expect.assertions(1);
    const findOne = jest.fn(() => Promise.resolve(true));
    const completeTaskModel = { findOne };
    const soloStreakId = "abcd";
    const taskCompleteDay = "26/04/2012";
    const userId = "abcde";
    const request: any = { params: { soloStreakId }, body: { userId } };
    const response: any = { locals: { taskCompleteDay } };
    const next = jest.fn();
    const middleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
      completeTaskModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.TaskAlreadyCompletedToday)
    );
  });

  test("throws HasTaskAlreadyBeenCompletedTodayMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const findOne = jest.fn(() => Promise.resolve(true));
    const completeTaskModel = { findOne };
    const taskCompleteDay = "26/04/2012";
    const request: any = {};
    const response: any = { locals: { taskCompleteDay } };
    const next = jest.fn();
    const middleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
      completeTaskModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe("createCompleteTaskDefinitionMiddleware", () => {
  test("sets completeTaskDefinition and calls next()", () => {
    expect.assertions(3);
    const soloStreakId = "abcd123";
    const toDate = jest.fn(() => "27/03/2019");
    const taskCompleteTime = {
      toDate
    };
    const taskCompleteDay = "09/05/2019";
    const userId = "abc";
    const request: any = {
      body: { userId, soloStreakId }
    };
    const response: any = {
      locals: {
        taskCompleteTime,
        taskCompleteDay
      }
    };
    const next = jest.fn();
    const streakType = "soloStreak";
    const middleware = getCreateCompleteTaskDefinitionMiddleware(streakType);

    middleware(request, response, next);

    expect(response.locals.completeTaskDefinition).toEqual({
      userId,
      streakId: soloStreakId,
      taskCompleteTime: taskCompleteTime.toDate(),
      taskCompleteDay,
      streakType
    });
    expect(toDate).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws CreateCompleteTaskDefinitionMiddlware error on middleware failure", () => {
    expect.assertions(1);
    const soloStreakId = "abcd123";
    const taskCompleteTime = {};
    const taskCompleteDay = "09/05/2019";
    const userId = "abcd";
    const request: any = {
      params: { soloStreakId },
      body: { userId }
    };
    const response: any = {
      locals: {
        taskCompleteTime,
        taskCompleteDay
      }
    };
    const next = jest.fn();
    const streakType = "soloStreak";
    const middleware = getCreateCompleteTaskDefinitionMiddleware(streakType);

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateCompleteTaskDefinitionMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`saveTaskCompleteMiddleware`, () => {
  test("sets response.locals.completeTask and calls next", async () => {
    expect.assertions(3);
    const userId = "abcd";
    const streakId = "1234";
    const taskCompleteTime = new Date();
    const taskCompleteDay = "09/05/2019";
    const streakType = "soloStreak";
    const completeTaskDefinition = {
      userId,
      streakId,
      taskCompleteTime,
      taskCompleteDay,
      streakType
    };
    const save = jest.fn(() => Promise.resolve(true));
    class CompleteTaskModel {
      userId: string;
      streakId: string;
      taskCompleteTime: Date;
      taskCompleteDay: string;
      streakType: string;

      constructor(
        userId: string,
        streakId: string,
        taskCompleteTime: Date,
        taskCompleteDay: string,
        streakType: string
      ) {
        this.userId = userId;
        (this.streakId = streakId), (this.taskCompleteTime = taskCompleteTime);
        this.taskCompleteDay = taskCompleteDay;
        this.streakType = streakType;
      }

      save() {
        return save();
      }
    }
    const request: any = {};
    const response: any = { locals: { completeTaskDefinition } };
    const next = jest.fn();
    const middleware = getSaveTaskCompleteMiddleware(CompleteTaskModel as any);

    await middleware(request, response, next);

    expect(response.locals.completeTask).toBeDefined();
    expect(save).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws SaveTaskCompleteMiddleware error on Middleware failure", async () => {
    expect.assertions(1);
    const userId = "abcd";
    const streakId = "1234";
    const taskCompleteTime = new Date();
    const taskCompleteDay = "09/05/2019";
    const streakType = "soloStreak";
    const completeTaskDefinition = {
      userId,
      streakId,
      taskCompleteTime,
      taskCompleteDay,
      streakType
    };
    const request: any = {};
    const response: any = { locals: { completeTaskDefinition } };
    const next = jest.fn();
    const middleware = getSaveTaskCompleteMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SaveTaskCompleteMiddleware, expect.any(Error))
    );
  });
});

describe("streakMaintainedMiddleware", () => {
  test("updates streak completedToday, increments number of days and calls next", async () => {
    expect.assertions(2);
    const soloStreakId = "123abc";
    const updateOne = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = {
      updateOne
    };
    const request: any = { body: { soloStreakId } };
    const response: any = {};
    const next = jest.fn();
    const middleware = getStreakMaintainedMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(updateOne).toBeCalledWith(
      { _id: soloStreakId },
      { completedToday: true, $inc: { "currentStreak.numberOfDaysInARow": 1 } }
    );
    expect(next).toBeCalledWith();
  });

  test("throws StreakMaintainedMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const soloStreakId = "123abc";
    const soloStreakModel = {};
    const request: any = { params: { soloStreakId } };
    const response: any = {};
    const next = jest.fn();
    const middleware = getStreakMaintainedMiddleware(soloStreakModel as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.StreakMaintainedMiddleware, expect.any(Error))
    );
  });
});

describe("sendTaskCompleteResponseMiddleware", () => {
  test("sends completeTask response", () => {
    expect.assertions(3);
    const send = jest.fn(() => true);
    const status = jest.fn(() => ({ send }));
    const completeTask = {
      userId: "abcd",
      streakId: "1234",
      taskCompleteTime: new Date(),
      taskCompleteDay: "10/05/2019",
      streakType: "solo-streak"
    };
    const successResponseCode = 200;
    const middleware = getSendTaskCompleteResponseMiddleware(
      successResponseCode
    );
    const request: any = {};
    const response: any = { locals: { completeTask }, status };
    const next = jest.fn();

    middleware(request, response, next);

    expect(status).toBeCalledWith(successResponseCode);
    expect(send).toBeCalledWith({ completeTask });
    expect(next).not.toBeCalled();
  });

  test("throws SendTaskCompleteResponseMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const completeTask = {
      userId: "abcd",
      streakId: "1234",
      taskCompleteTime: new Date(),
      taskCompleteDay: "10/05/2019",
      streakType: "solo-streak"
    };
    const successResponseCode = 200;
    const middleware = getSendTaskCompleteResponseMiddleware(
      successResponseCode
    );
    const request: any = {};
    const response: any = { locals: { completeTask } };
    const next = jest.fn();

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.SendTaskCompleteResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`createCompleteTaskMiddlewares`, () => {
  test("are defined in the correct order", async () => {
    expect.assertions(12);

    expect(createCompleteTaskMiddlewares.length).toEqual(11);
    expect(createCompleteTaskMiddlewares[0]).toBe(
      completeTaskBodyValidationMiddleware
    ),
      expect(createCompleteTaskMiddlewares[1]).toBe(soloStreakExistsMiddleware);
    expect(createCompleteTaskMiddlewares[2]).toBe(retreiveUserMiddleware);
    expect(createCompleteTaskMiddlewares[3]).toBe(
      setTaskCompleteTimeMiddleware
    );
    expect(createCompleteTaskMiddlewares[4]).toBe(setStreakStartDateMiddleware);
    expect(createCompleteTaskMiddlewares[5]).toBe(
      setDayTaskWasCompletedMiddleware
    );
    expect(createCompleteTaskMiddlewares[6]).toBe(
      hasTaskAlreadyBeenCompletedTodayMiddleware
    );
    expect(createCompleteTaskMiddlewares[7]).toBe(
      createCompleteTaskDefinitionMiddleware
    );
    expect(createCompleteTaskMiddlewares[8]).toBe(saveTaskCompleteMiddleware);
    expect(createCompleteTaskMiddlewares[9]).toBe(streakMaintainedMiddleware);
    expect(createCompleteTaskMiddlewares[10]).toBe(
      sendTaskCompleteResponseMiddleware
    );
  });
});
