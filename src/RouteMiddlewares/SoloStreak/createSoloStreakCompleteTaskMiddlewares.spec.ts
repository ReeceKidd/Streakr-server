import {
  createSoloStreakCompleteTaskMiddlewares,
  retreiveTimezoneHeaderMiddleware,
  sendMissingTimezoneErrorResponseMiddleware,
  validateTimezoneMiddleware,
  sendInvalidTimezoneErrorResponseMiddleware,
  hasTaskAlreadyBeenCompletedTodayMiddleware,
  sendTaskAlreadyCompletedTodayErrorMiddleware,
  retreiveUserMiddleware,
  getValidateTimezoneMiddleware,
  getSendInvalidTimezoneErrorResponseMiddleware,
  sendUserDoesNotExistErrorMiddleware,
  setTaskCompleteTimeMiddleware,
  setDayTaskWasCompletedMiddleware,
  sendTaskCompleteResponseMiddleware,
  createCompleteTaskDefinitionMiddleware,
  soloStreakTaskCompleteParamsValidationMiddleware,
  soloStreakExistsMiddleware,
  sendSoloStreakDoesNotExistErrorMessageMiddleware,
  saveTaskCompleteMiddleware,
  streakMaintainedMiddleware,
  getSoloStreakExistsMiddleware,
  getSendSoloStreakDoesNotExistErrorMessageMiddleware,
  getRetreiveTimezoneHeaderMiddleware,
  getSendMissingTimezoneErrorResponseMiddleware,
  getRetreiveUserMiddleware,
  getSendUserDoesNotExistErrorMiddlware,
  getSetDayTaskWasCompletedMiddleware,
  getSetTaskCompleteTimeMiddleware,
  getHasTaskAlreadyBeenCompletedTodayMiddleware,
  getSendTaskAlreadyCompletedTodayErrorMiddleware,
  getCreateCompleteTaskDefinitionMiddleware,
  dayFormat,
  getSaveTaskCompleteMiddleware,
  getStreakMaintainedMiddleware,
  getSendTaskCompleteResponseMiddleware,
  setStreakStartDateMiddleware,
  getSetStreakStartDateMiddleware
} from "./createSoloStreakCompleteTaskMiddlewares";
import { ResponseCodes } from "../../Server/responseCodes";

describe(`soloStreakTaskCompleteParamsValidationMiddleware`, () => {
  const soloStreakId = "12345678";

  test("that next() is called when correct params are supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request: any = {
      params: { soloStreakId }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakTaskCompleteParamsValidationMiddleware(request, response, next);
    expect(next).toBeCalled();
  });

  test("that correct response is sent when soloStreakId is missing", () => {
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

    soloStreakTaskCompleteParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message: 'child "soloStreakId" fails because ["soloStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });

  test("that error response is sent when soloStreakId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));

    const request: any = {
      params: { soloStreakId: 1234 }
    };
    const response: any = {
      status
    };
    const next = jest.fn();

    soloStreakTaskCompleteParamsValidationMiddleware(request, response, next);

    expect(status).toHaveBeenCalledWith(ResponseCodes.unprocessableEntity);
    expect(send).toBeCalledWith({
      message:
        'child "soloStreakId" fails because ["soloStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});

describe("soloStreakExistsMiddleware", () => {
  test("that response.locals.soloStreak is defined and next() is called", async () => {
    expect.assertions(3);
    const soloStreakId = "abc";
    const request: any = {
      params: { soloStreakId }
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

  test("on error next() is called with error", async () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();

    const findOne = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = { findOne };

    const middleware = getSoloStreakExistsMiddleware(soloStreakModel as any);
    await middleware(request, response, next);

    expect(next).toBeCalledWith(
      new TypeError(
        "Cannot destructure property `soloStreakId` of 'undefined' or 'null'."
      )
    );
  });
});

describe("sendSoloStreakDoesNotExistErrorMessageMiddleware", () => {
  test("that error response is sent when response.locals.soloStreak is not defined", async () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { locals: {}, status };
    const next = jest.fn();

    const unprocessableEntityStatus = 402;
    const localisedErrorMessage = "error";

    const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      unprocessableEntityStatus,
      localisedErrorMessage
    );
    middleware(request, response, next);
    expect(status).toBeCalledWith(unprocessableEntityStatus);
    expect(send).toBeCalledWith({ message: localisedErrorMessage });
    expect(next).not.toBeCalledWith();
  });

  test("that next() is called when response.locals.soloStreak is defined", async () => {
    expect.assertions(1);
    const soloStreak = {
      soloStreakName: "Test soloStreak"
    };
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { locals: { soloStreak }, status };
    const next = jest.fn();

    const unprocessableEntityStatus = 402;
    const localisedErrorMessage = "error";

    const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      unprocessableEntityStatus,
      localisedErrorMessage
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith();
  });

  test("that next is called with error on error", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();

    const unprocessableEntityStatus = 402;
    const localisedErrorMessage = "error";

    const middleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(
      unprocessableEntityStatus,
      localisedErrorMessage
    );
    middleware(request, response, next);

    expect(next).toBeCalledWith(
      new TypeError("response.status is not a function")
    );
  });
});

describe("retreiveTimezoneHeaderMiddleware", () => {
  test("that response.locals.timezone is defined and next() is called", () => {
    expect.assertions(3);
    const header = jest.fn(() => true);
    const timezoneHeader = "Europe/London";
    const request: any = {
      header
    };
    const response: any = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = getRetreiveTimezoneHeaderMiddleware(timezoneHeader);
    middleware(request, response, next);
    expect(header).toBeCalledWith(timezoneHeader);
    expect(response.locals.timezone).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("on error that next is called with error", () => {
    expect.assertions(1);
    const timezoneHeader = "Europe/London";
    const request: any = {};
    const response: any = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = getRetreiveTimezoneHeaderMiddleware(timezoneHeader);
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("request.header is not a function")
    );
  });
});

describe("sendMissingTimezoneErrorResponseMiddleware", () => {
  test("that error response is sent correctly when timezone is not defined", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status, locals: {} };
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendMissingTimezoneErrorResponseMiddleware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(status).toBeCalledWith(unprocessableEntityCode);
    expect(send).toBeCalledWith({ message: localisedError });
    expect(next).not.toBeCalled();
  });

  test("that next() is called when timezone is defined", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const timezone = "Europe/London";
    const request: any = {};
    const response: any = { status, locals: { timezone } };
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendMissingTimezoneErrorResponseMiddleware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith();
  });

  test("that on error next() is called with error", () => {
    expect.assertions(1);
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status };
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendMissingTimezoneErrorResponseMiddleware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError(
        "Cannot destructure property `timezone` of 'undefined' or 'null'."
      )
    );
  });
});

describe("validateTimezoneMiddleware", () => {
  test("that response.locals.validTimezone is defined and next() is called", () => {
    expect.assertions(3);
    const timezone = "Europe/London";
    const request: any = {};
    const response: any = { locals: { timezone } };
    const next = jest.fn();
    const isValidTimezone = jest.fn(() => true);
    const middleware = getValidateTimezoneMiddleware(isValidTimezone);
    middleware(request, response, next);
    expect(response.locals.validTimezone).toBeDefined();
    expect(isValidTimezone).toBeCalledWith(timezone);
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const timezone = "Europe/London";
    const request: any = {};
    const response: any = { locals: { timezone } };
    const next = jest.fn();
    const middleware = getValidateTimezoneMiddleware(undefined);
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("isValidTimezone is not a function")
    );
  });
});

describe("sendInvalidTimezoneErrorResponseMiddleware", () => {
  test("that error response is sent correctly when validTimezone is not defined", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { locals: {}, status };
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendInvalidTimezoneErrorResponseMiddleware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(status).toBeCalledWith(unprocessableEntityCode);
    expect(send).toBeCalledWith({ message: localisedError });
    expect(next).not.toBeCalled();
  });

  test("that error response is sent correctly when timezone is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const validTimezone = "Europe/London";
    const response: any = { locals: { validTimezone } };
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendInvalidTimezoneErrorResponseMiddleware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(status).not.toBeCalled();
    expect(send).not.toBeCalled();
    expect(next).toBeCalledWith();
  });

  test("that on failure next is called with error", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendInvalidTimezoneErrorResponseMiddleware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError(
        "Cannot destructure property `validTimezone` of 'undefined' or 'null'."
      )
    );
  });
});

describe("retreiveUserMiddleware", () => {
  test("that response.locals.user is defined and next() is called", async () => {
    expect.assertions(4);
    const _id = "abcd";
    const minimumUserData = { _id };
    const lean = jest.fn(() => true);
    const findOne = jest.fn(() => ({ lean }));
    const userModel = { findOne };
    const request: any = {};
    const response: any = { locals: { minimumUserData } };
    const next = jest.fn();
    const middleware = getRetreiveUserMiddleware(userModel);
    await middleware(request, response, next);
    expect(response.locals.user).toBeDefined();
    expect(findOne).toBeCalledWith({ _id: minimumUserData._id });
    expect(lean).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("on error next is called with error", async () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const _id = "abcd";
    const minimumUserData = { _id };
    const findOne = jest.fn(() => ({}));
    const userModel = { findOne };
    const request: any = {};
    const response: any = { status, locals: { minimumUserData } };
    const next = jest.fn();
    const middleware = getRetreiveUserMiddleware(userModel);
    await middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("userModel.findOne(...).lean is not a function")
    );
  });
});

describe(`sendUserDoesNotExistErrorMiddleware`, () => {
  test("that error response is sent when response.locals.user is undefined", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status, locals: {} };
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendUserDoesNotExistErrorMiddlware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(status).toBeCalledWith(unprocessableEntityCode);
    expect(send).toBeCalledWith({ message: localisedError });
    expect(next).not.toBeCalled();
  });

  test("that next is called when user is defined", () => {
    expect.assertions(3);
    const user = {
      userName: "Tester"
    };
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request: any = {};
    const response: any = { status, locals: { user } };
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendUserDoesNotExistErrorMiddlware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(status).not.toBeCalled();
    expect(send).not.toBeCalled();
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const unprocessableEntityCode = 422;
    const localisedError = "error";
    const middleware = getSendUserDoesNotExistErrorMiddlware(
      unprocessableEntityCode,
      localisedError
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("response.status is not a function")
    );
  });
});

describe("setTaskCompleteTimeMiddleware", () => {
  test("that response.locals.taskCompleteTime is defined and next is called", () => {
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

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const tz = jest.fn(() => true);
    const moment = jest.fn(() => ({ tz }));
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSetTaskCompleteTimeMiddleware(moment);
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError(
        "Cannot destructure property `timezone` of 'undefined' or 'null'."
      )
    );
  });
});

describe("setStreakStartDateMiddleware", () => {
  test("that soloStreak.startDate becomes equal to taskCompleteTime if it's undefined", async () => {
    expect.assertions(2);
    const findByIdAndUpdate = jest.fn();
    const soloStreakModel: any = {
      findByIdAndUpdate
    };
    const taskCompleteTime = new Date();
    const soloStreakId = 1;
    const soloStreak = {
      startDate: undefined
    };
    const request: any = { params: { soloStreakId } };
    const response: any = { locals: { soloStreak, taskCompleteTime } };
    const next: any = jest.fn();
    const middleware = await getSetStreakStartDateMiddleware(soloStreakModel);
    await middleware(request, response, next);
    expect(findByIdAndUpdate).toBeCalledWith(soloStreakId, {
      startDate: taskCompleteTime
    });
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const request: any = {};
    const response: any = {};
    const next = jest.fn();
    const middleware = getSetStreakStartDateMiddleware(undefined);
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("Cannot read property 'soloStreak' of undefined")
    );
  });
});

describe("setDayTaskWasCompletedMiddleware", () => {
  test("that response.locals.taskCompleteTime is defined and next is called", () => {
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

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const dayFormat = "DD/MM/YYYY";
    const request: any = {};
    const response: any = { locals: {} };
    const next = jest.fn();
    const middleware = getSetDayTaskWasCompletedMiddleware(dayFormat);
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("Cannot read property 'format' of undefined")
    );
  });
});

describe("hasTaskAlreadyBeenCompletedTodayMiddleware", () => {
  test("that response.locals.taskAlreadyCompletedToday is defined and next is called", async () => {
    expect.assertions(3);
    const findOne = jest.fn(() => Promise.resolve(true));
    const completeTaskModel = { findOne };
    const soloStreakId = "abcd";
    const taskCompleteDay = "26/04/2012";
    const _id = "a1b2";
    const user = {
      _id
    };
    const request: any = { params: { soloStreakId } };
    const response: any = { locals: { taskCompleteDay, user } };
    const next = jest.fn();
    const middleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
      completeTaskModel
    );
    await middleware(request, response, next);
    expect(findOne).toBeCalledWith({
      userId: _id,
      streakId: soloStreakId,
      taskCompleteDay
    });
    expect(response.locals.taskAlreadyCompletedToday).toBeDefined();
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with error", async () => {
    expect.assertions(1);
    const errorMessage = "error";
    const findOne = jest.fn(() => Promise.reject(errorMessage));
    const completeTaskModel = { findOne };
    const soloStreakId = "abcd";
    const taskCompleteDay = "26/04/2012";
    const _id = "a1b2";
    const user = {
      _id
    };
    const request: any = { params: { soloStreakId } };
    const response: any = { locals: { taskCompleteDay, user } };
    const next = jest.fn();
    const middleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(
      completeTaskModel
    );
    await middleware(request, response, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("sendTaskAlreadyCompletedTodayErrorMiddleware", () => {
  test("that error response is sent when response.locals.taskAlreadyCompletedToday is defined", () => {
    expect.assertions(3);
    const send = jest.fn(() => true);
    const status = jest.fn(() => ({ send }));
    const taskAlreadyCompletedToday = true;
    const unprocessableEntityCode = 422;
    const localisedTaskAlreadyCompletedTodayErrorMessage = "error";
    const middleware = getSendTaskAlreadyCompletedTodayErrorMiddleware(
      unprocessableEntityCode,
      localisedTaskAlreadyCompletedTodayErrorMessage
    );
    const request: any = {};
    const response: any = { locals: { taskAlreadyCompletedToday }, status };
    const next = jest.fn();
    middleware(request, response, next);
    expect(status).toBeCalledWith(unprocessableEntityCode);
    expect(send).toBeCalledWith({
      message: localisedTaskAlreadyCompletedTodayErrorMessage
    });
    expect(next).not.toBeCalled();
  });

  test("that next is called when response.locals.taskAlreadyCompleted is defined", () => {
    expect.assertions(1);
    const taskAlreadyCompletedToday = false;
    const unprocessableEntityCode = 422;
    const localisedTaskAlreadyCompletedTodayErrorMessage = "error";
    const middleware = getSendTaskAlreadyCompletedTodayErrorMiddleware(
      unprocessableEntityCode,
      localisedTaskAlreadyCompletedTodayErrorMessage
    );
    const request: any = {};
    const response: any = { locals: { taskAlreadyCompletedToday } };
    const next = jest.fn();
    middleware(request, response, next);
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const taskAlreadyCompletedToday = true;
    const unprocessableEntityCode = 422;
    const localisedTaskAlreadyCompletedTodayErrorMessage = "error";
    const middleware = getSendTaskAlreadyCompletedTodayErrorMiddleware(
      unprocessableEntityCode,
      localisedTaskAlreadyCompletedTodayErrorMessage
    );
    const request: any = {};
    const response: any = { locals: { taskAlreadyCompletedToday } };
    const next = jest.fn();
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("response.status is not a function")
    );
  });
});

describe("createCompleteTaskDefinitionMiddleware", () => {
  test("that completeTaskDefinition is defined and next is called", () => {
    expect.assertions(3);
    const soloStreakId = "abcd123";
    const toDate = jest.fn(() => "27/03/2019");
    const taskCompleteTime = {
      toDate
    };
    const taskCompleteDay = "09/05/2019";
    const _id = "777ff";
    const user = {
      _id
    };
    const request: any = {
      params: { soloStreakId }
    };
    const response: any = {
      locals: {
        taskCompleteTime,
        taskCompleteDay,
        user
      }
    };
    const next = jest.fn();
    const streakType = "soloStreak";
    const middleware = getCreateCompleteTaskDefinitionMiddleware(streakType);
    middleware(request, response, next);
    expect(response.locals.completeTaskDefinition).toEqual({
      userId: user._id,
      streakId: soloStreakId,
      taskCompleteTime: taskCompleteTime.toDate(),
      taskCompleteDay,
      streakType
    });
    expect(toDate).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with error", () => {
    expect.assertions(1);
    const soloStreakId = "abcd123";
    const taskCompleteTime = {};
    const taskCompleteDay = "09/05/2019";
    const _id = "777ff";
    const user = {
      _id
    };
    const request: any = {
      params: { soloStreakId }
    };
    const response: any = {
      locals: {
        taskCompleteTime,
        taskCompleteDay,
        user
      }
    };
    const next = jest.fn();
    const streakType = "soloStreak";
    const middleware = getCreateCompleteTaskDefinitionMiddleware(streakType);
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("taskCompleteTime.toDate is not a function")
    );
  });
});

describe(`saveTaskCompleteMiddleware`, () => {
  test(" that response.locals.completeTask is defined and next() is called", async () => {
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
        userId,
        streakId,
        taskCompleteTime,
        taskCompleteDay,
        streakType
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
    const middleware = getSaveTaskCompleteMiddleware(CompleteTaskModel);
    await middleware(request, response, next);
    expect(response.locals.completeTask).toBeDefined();
    expect(save).toBeCalledWith();
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with eror", async () => {
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
    const save = jest.fn(() => Promise.resolve(true));
    const request: any = {};
    const response: any = { locals: { completeTaskDefinition } };
    const next = jest.fn();
    const middleware = getSaveTaskCompleteMiddleware({});
    await middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("completeTaskModel is not a constructor")
    );
  });
});

describe("streakMaintainedMiddleware", () => {
  test("that soloStreakModel is updated and that next() is called", async () => {
    expect.assertions(2);
    const soloStreakId = "123abc";
    const updateOne = jest.fn(() => Promise.resolve(true));
    const soloStreakModel = {
      updateOne
    };
    const request: any = { params: { soloStreakId } };
    const response: any = {};
    const next = jest.fn();
    const middleware = getStreakMaintainedMiddleware(soloStreakModel);
    await middleware(request, response, next);
    expect(updateOne).toBeCalledWith(
      { _id: soloStreakId },
      { completedToday: true, $inc: { "currentStreak.numberOfDaysInARow": 1 } }
    );
    expect(next).toBeCalledWith();
  });

  test("that on error next is called with error", async () => {
    expect.assertions(1);
    const soloStreakId = "123abc";
    const soloStreakModel = {};
    const request: any = { params: { soloStreakId } };
    const response: any = {};
    const next = jest.fn();
    const middleware = getStreakMaintainedMiddleware(soloStreakModel);
    await middleware(request, response, next);
    expect(next).toBeCalledWith(
      new TypeError("soloStreakModel.updateOne is not a function")
    );
  });
});

describe("sendTaskCompleteResponseMiddleware", () => {
  test("that completeTask response is sent and next is not called", () => {
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

  test("that on error next is called with error", () => {
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
      new TypeError("response.status is not a function")
    );
  });
});

describe(`createSoloStreakCompleteTaskMiddlewares`, () => {
  test("that createSoloStreakTaskMiddlweares are defined in the correct order", async () => {
    expect.assertions(18);
    expect(createSoloStreakCompleteTaskMiddlewares[0]).toBe(
      soloStreakTaskCompleteParamsValidationMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[1]).toBe(
      soloStreakExistsMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[2]).toBe(
      sendSoloStreakDoesNotExistErrorMessageMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[3]).toBe(
      retreiveTimezoneHeaderMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[4]).toBe(
      sendMissingTimezoneErrorResponseMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[5]).toBe(
      validateTimezoneMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[6]).toBe(
      sendInvalidTimezoneErrorResponseMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[7]).toBe(
      retreiveUserMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[8]).toBe(
      sendUserDoesNotExistErrorMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[9]).toBe(
      setTaskCompleteTimeMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[10]).toBe(
      setStreakStartDateMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[11]).toBe(
      setDayTaskWasCompletedMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[12]).toBe(
      hasTaskAlreadyBeenCompletedTodayMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[13]).toBe(
      sendTaskAlreadyCompletedTodayErrorMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[14]).toBe(
      createCompleteTaskDefinitionMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[15]).toBe(
      saveTaskCompleteMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[16]).toBe(
      streakMaintainedMiddleware
    );
    expect(createSoloStreakCompleteTaskMiddlewares[17]).toBe(
      sendTaskCompleteResponseMiddleware
    );
  });
});
