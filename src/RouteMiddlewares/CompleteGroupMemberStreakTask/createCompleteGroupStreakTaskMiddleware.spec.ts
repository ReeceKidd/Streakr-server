import {
  createCompleteGroupMemberStreakTaskMiddlewares,
  hasTaskAlreadyBeenCompletedTodayMiddleware,
  retreiveUserMiddleware,
  setTaskCompleteTimeMiddleware,
  setDayTaskWasCompletedMiddleware,
  sendCompleteGroupMemberStreakTaskResponseMiddleware,
  createCompleteGroupMemberStreakTaskDefinitionMiddleware,
  groupMemberStreakExistsMiddleware,
  saveTaskCompleteMiddleware,
  streakMaintainedMiddleware,
  getGroupMemberStreakExistsMiddleware,
  getRetreiveUserMiddleware,
  getSetDayTaskWasCompletedMiddleware,
  getSetTaskCompleteTimeMiddleware,
  getHasTaskAlreadyBeenCompletedTodayMiddleware,
  getCreateCompleteGroupMemberStreakTaskDefinitionMiddleware,
  getSaveTaskCompleteMiddleware,
  getStreakMaintainedMiddleware,
  getSendCompleteGroupMemberStreakTaskResponseMiddleware,
  setStreakStartDateMiddleware,
  getSetStreakStartDateMiddleware,
  completeGroupMemberStreakTaskBodyValidationMiddleware
} from "./createCompleteGroupMemberStreakTaskMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";
import { CustomError, ErrorType } from "../../customError";
import { getSendTaskCompleteResponseMiddleware } from "../CompleteSoloStreakTask/createCompleteSoloStreakTaskMiddlewares";

describe(`completeGroupMemberStreakTaskBodyValidationMiddleware`, () => {
  const userId = "abcdefgh";
  const groupMemberStreakId = "123456";

  test("calls next() when correct body is supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { userId, groupMemberStreakId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeGroupMemberStreakTaskBodyValidationMiddleware(
      request,
      response,
      next
    );

    expect(next).toBeCalled();
  });

  test("sends correct error response when userId is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { groupMemberStreakId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeGroupMemberStreakTaskBodyValidationMiddleware(
      request,
      response,
      next
    );

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "userId" fails because ["userId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when groupMemberStreakId is missing", () => {
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

    completeGroupMemberStreakTaskBodyValidationMiddleware(
      request,
      response,
      next
    );

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupMemberStreakId" fails because ["groupMemberStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("sends correct error response when groupMemberStreakId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {
      body: { groupMemberStreakId: 1234, userId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    completeGroupMemberStreakTaskBodyValidationMiddleware(
      request,
      response,
      next
    );

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "groupMemberStreakId" fails because ["groupMemberStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("groupMemberStreakExistsMiddleware", () => {
  test("sets response.locals.groupMemberStreak and calls next()", async () => {
    expect.assertions(3);
    const groupMemberStreakId = "abc";
    const request: any = {
      body: { groupMemberStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(true));
    const groupMemberStreakModel = { findOne };
    const middleware = getGroupMemberStreakExistsMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({ _id: groupMemberStreakId });
    expect(response.locals.groupMemberStreak).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("throws GroupMemberStreakDoesNotExist error when solo streak does not exist", async () => {
    expect.assertions(1);
    const groupMemberStreakId = "abc";
    const request: any = {
      body: { groupMemberStreakId }
    };
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(false));
    const groupMemberStreakModel = { findOne };
    const middleware = getGroupMemberStreakExistsMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.GroupMemberStreakDoesNotExist)
    );
  });

  test("throws GroupMemberStreakExistsMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const findOne = jest.fn(() => Promise.resolve(true));
    const groupMemberStreakModel = { findOne };
    const middleware = getGroupMemberStreakExistsMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.GroupMemberStreakExistsMiddleware,
        expect.any(Error)
      )
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
  test("sets groupMemberStreak.startDate to taskCompleteTime if it's undefined and calls next()", async () => {
    expect.assertions(2);
    const updateOne = jest.fn().mockResolvedValue(true);
    const groupMemberStreakModel: any = {
      updateOne
    };
    const taskCompleteTime = new Date();
    const groupMemberStreakId = 1;
    const groupMemberStreak = {
      _id: groupMemberStreakId,
      currentStreak: {
        startDate: undefined,
        numberOfDaysInARow: 0
      }
    };
    const request: any = {};
    const response: any = { locals: { groupMemberStreak, taskCompleteTime } };
    const next: any = jest.fn();
    const middleware = await getSetStreakStartDateMiddleware(
      groupMemberStreakModel
    );

    await middleware(request, response, next);

    expect(updateOne).toBeCalledWith(
      { _id: groupMemberStreakId },
      {
        currentStreak: { startDate: taskCompleteTime, numberOfDaysInARow: 0 }
      }
    );
    expect(next).toBeCalledWith();
  });

  test("doesn't update groupMemberStreak currentStreak.startDate if it's already set", async () => {
    expect.assertions(2);
    const findByIdAndUpdate = jest.fn();
    const groupMemberStreakModel: any = {
      findByIdAndUpdate
    };
    const taskCompleteTime = new Date();
    const groupMemberStreakId = 1;
    const groupMemberStreak = {
      currentStreak: {
        startDate: new Date()
      }
    };
    const request: any = { params: { groupMemberStreakId } };
    const response: any = { locals: { groupMemberStreak, taskCompleteTime } };
    const next: any = jest.fn();
    const middleware = await getSetStreakStartDateMiddleware(
      groupMemberStreakModel
    );

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
    const completeGroupMemberStreakTaskModel = { findOne };
    const groupMemberStreakId = "abcd";
    const taskCompleteDay = "26/04/2012";
    const userId = "Abcde";
    const request: any = { body: { userId, groupMemberStreakId } };
    const response: any = { locals: { taskCompleteDay } };
    const next = jest.fn();
    const middleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
      completeGroupMemberStreakTaskModel as any
    );

    await middleware(request, response, next);

    expect(findOne).toBeCalledWith({
      userId,
      streakId: groupMemberStreakId,
      taskCompleteDay
    });
    expect(next).toBeCalledWith();
  });

  test("throws TaskAlreadyCompletedToday error if task has already been completed today", async () => {
    expect.assertions(1);
    const findOne = jest.fn(() => Promise.resolve(true));
    const completeGroupMemberStreakTaskModel = { findOne };
    const groupMemberStreakId = "abcd";
    const taskCompleteDay = "26/04/2012";
    const userId = "abcde";
    const request: any = { params: { groupMemberStreakId }, body: { userId } };
    const response: any = { locals: { taskCompleteDay } };
    const next = jest.fn();
    const middleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
      completeGroupMemberStreakTaskModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.TaskAlreadyCompletedToday)
    );
  });

  test("throws HasTaskAlreadyBeenCompletedTodayMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const findOne = jest.fn(() => Promise.resolve(true));
    const completeGroupMemberStreakTaskModel = { findOne };
    const taskCompleteDay = "26/04/2012";
    const request: any = {};
    const response: any = { locals: { taskCompleteDay } };
    const next = jest.fn();
    const middleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
      completeGroupMemberStreakTaskModel as any
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

describe("createCompleteGroupMemberStreakTaskDefinitionMiddleware", () => {
  test("sets completeGroupMemberStreakTaskDefinition and calls next()", () => {
    expect.assertions(3);
    const groupMemberStreakId = "abcd123";
    const toDate = jest.fn(() => "27/03/2019");
    const taskCompleteTime = {
      toDate
    };
    const taskCompleteDay = "09/05/2019";
    const userId = "abc";
    const request: any = {
      body: { userId, groupMemberStreakId }
    };
    const response: any = {
      locals: {
        taskCompleteTime,
        taskCompleteDay
      }
    };
    const next = jest.fn();
    const streakType = "groupMemberStreak";
    const middleware = getCreateCompleteGroupMemberStreakTaskDefinitionMiddleware(
      streakType
    );

    middleware(request, response, next);

    expect(response.locals.completeGroupMemberStreakTaskDefinition).toEqual({
      userId,
      streakId: groupMemberStreakId,
      taskCompleteTime: taskCompleteTime.toDate(),
      taskCompleteDay,
      streakType
    });
    expect(toDate).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws CreateCompleteGroupMemberStreakTaskDefinitionMiddlware error on middleware failure", () => {
    expect.assertions(1);
    const groupMemberStreakId = "abcd123";
    const taskCompleteTime = {};
    const taskCompleteDay = "09/05/2019";
    const userId = "abcd";
    const request: any = {
      params: { groupMemberStreakId },
      body: { userId }
    };
    const response: any = {
      locals: {
        taskCompleteTime,
        taskCompleteDay
      }
    };
    const next = jest.fn();
    const streakType = "groupMemberStreak";
    const middleware = getCreateCompleteGroupMemberStreakTaskDefinitionMiddleware(
      streakType
    );

    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(
        ErrorType.CreateCompleteGroupMemberStreakTaskDefinitionMiddleware,
        expect.any(Error)
      )
    );
  });
});

describe(`saveTaskCompleteMiddleware`, () => {
  test("sets response.locals.completeGroupMemberStreakTask and calls next", async () => {
    expect.assertions(3);
    const userId = "abcd";
    const streakId = "1234";
    const taskCompleteTime = new Date();
    const taskCompleteDay = "09/05/2019";
    const streakType = "groupMemberStreak";
    const completeGroupMemberStreakTaskDefinition = {
      userId,
      streakId,
      taskCompleteTime,
      taskCompleteDay,
      streakType
    };
    const save = jest.fn(() => Promise.resolve(true));
    class CompleteGroupMemberStreakTaskModel {
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
    const response: any = {
      locals: { completeGroupMemberStreakTaskDefinition }
    };
    const next = jest.fn();
    const middleware = getSaveTaskCompleteMiddleware(
      CompleteGroupMemberStreakTaskModel as any
    );

    await middleware(request, response, next);

    expect(response.locals.completeGroupMemberStreakTask).toBeDefined();
    expect(save).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("throws SaveTaskCompleteMiddleware error on Middleware failure", async () => {
    expect.assertions(1);
    const userId = "abcd";
    const streakId = "1234";
    const taskCompleteTime = new Date();
    const taskCompleteDay = "09/05/2019";
    const streakType = "groupMemberStreak";
    const completeGroupMemberStreakTaskDefinition = {
      userId,
      streakId,
      taskCompleteTime,
      taskCompleteDay,
      streakType
    };
    const request: any = {};
    const response: any = {
      locals: { completeGroupMemberStreakTaskDefinition }
    };
    const next = jest.fn();
    const middleware = getSaveTaskCompleteMiddleware({} as any);

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.SaveTaskCompleteMiddleware, expect.any(Error))
    );
  });
});

describe("streakMaintainedMiddleware", () => {
  test("updates streak completedToday, increments number of days, sets active and calls next", async () => {
    expect.assertions(2);
    const groupMemberStreakId = "123abc";
    const updateOne = jest.fn(() => Promise.resolve(true));
    const groupMemberStreakModel = {
      updateOne
    };
    const request: any = { body: { groupMemberStreakId } };
    const response: any = {};
    const next = jest.fn();
    const middleware = getStreakMaintainedMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(updateOne).toBeCalledWith(
      { _id: groupMemberStreakId },
      {
        completedToday: true,
        $inc: { "currentStreak.numberOfDaysInARow": 1 },
        active: true
      }
    );
    expect(next).toBeCalledWith();
  });

  test("throws StreakMaintainedMiddleware error on middleware failure", async () => {
    expect.assertions(1);
    const groupMemberStreakId = "123abc";
    const groupMemberStreakModel = {};
    const request: any = { params: { groupMemberStreakId } };
    const response: any = {};
    const next = jest.fn();
    const middleware = getStreakMaintainedMiddleware(
      groupMemberStreakModel as any
    );

    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new CustomError(ErrorType.StreakMaintainedMiddleware, expect.any(Error))
    );
  });
});

describe("sendCompleteGroupMemberStreakTaskResponseMiddleware", () => {
  test("sends completeGroupMemberStreakTask response", () => {
    expect.assertions(3);
    const send = jest.fn(() => true);
    const status = jest.fn(() => ({ send }));
    const completeGroupMemberStreakTask = {
      userId: "abcd",
      streakId: "1234",
      taskCompleteTime: new Date(),
      taskCompleteDay: "10/05/2019",
      streakType: "solo-streak"
    };
    const successResponseCode = 200;
    const middleware = getSendCompleteGroupMemberStreakTaskResponseMiddleware(
      successResponseCode
    );
    const request: any = {};
    const response: any = { locals: { completeGroupMemberStreakTask }, status };
    const next = jest.fn();

    middleware(request, response, next);

    expect(status).toBeCalledWith(successResponseCode);
    expect(send).toBeCalledWith({ completeGroupMemberStreakTask });
    expect(next).not.toBeCalled();
  });

  test("throws SendTaskCompleteResponseMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const completeGroupMemberStreakTask = {
      userId: "abcd",
      streakId: "1234",
      taskCompleteTime: new Date(),
      taskCompleteDay: "10/05/2019",
      streakType: "solo-streak"
    };
    const successResponseCode = 200;
    const middleware = getSendCompleteGroupMemberStreakTaskResponseMiddleware(
      successResponseCode
    );
    const request: any = {};
    const response: any = { locals: { completeGroupMemberStreakTask } };
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

describe(`createCompleteGroupMemberStreakTaskMiddlewares`, () => {
  test("are defined in the correct order", async () => {
    expect.assertions(12);

    expect(createCompleteGroupMemberStreakTaskMiddlewares.length).toEqual(11);
    expect(createCompleteGroupMemberStreakTaskMiddlewares[0]).toBe(
      completeGroupMemberStreakTaskBodyValidationMiddleware
    ),
      expect(createCompleteGroupMemberStreakTaskMiddlewares[1]).toBe(
        groupMemberStreakExistsMiddleware
      );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[2]).toBe(
      retreiveUserMiddleware
    );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[3]).toBe(
      setTaskCompleteTimeMiddleware
    );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[4]).toBe(
      setStreakStartDateMiddleware
    );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[5]).toBe(
      setDayTaskWasCompletedMiddleware
    );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[6]).toBe(
      hasTaskAlreadyBeenCompletedTodayMiddleware
    );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[7]).toBe(
      createCompleteGroupMemberStreakTaskDefinitionMiddleware
    );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[8]).toBe(
      saveTaskCompleteMiddleware
    );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[9]).toBe(
      streakMaintainedMiddleware
    );
    expect(createCompleteGroupMemberStreakTaskMiddlewares[10]).toBe(
      sendCompleteGroupMemberStreakTaskResponseMiddleware
    );
  });
});
