"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
const createSoloStreakCompleteTaskMiddlewares_1 = require("./createSoloStreakCompleteTaskMiddlewares");
const responseCodes_1 = require("../../Server/responseCodes");
const customError_1 = require("../../customError");
describe(`soloStreakTaskCompleteParamsValidationMiddleware`, () => {
  const soloStreakId = "12345678";
  test("calls next() when correct params are supplied", () => {
    expect.assertions(1);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: { soloStreakId }
    };
    const response = {
      status
    };
    const next = jest.fn();
    createSoloStreakCompleteTaskMiddlewares_1.soloStreakTaskCompleteParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect(next).toBeCalled();
  });
  test("sends correct error response when soloStreakId is missing", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: {}
    };
    const response = {
      status
    };
    const next = jest.fn();
    createSoloStreakCompleteTaskMiddlewares_1.soloStreakTaskCompleteParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message: 'child "soloStreakId" fails because ["soloStreakId" is required]'
    });
    expect(next).not.toBeCalled();
  });
  test("sends correct error response when soloStreakId is not a string", () => {
    expect.assertions(3);
    const send = jest.fn();
    const status = jest.fn(() => ({ send }));
    const request = {
      params: { soloStreakId: 1234 }
    };
    const response = {
      status
    };
    const next = jest.fn();
    createSoloStreakCompleteTaskMiddlewares_1.soloStreakTaskCompleteParamsValidationMiddleware(
      request,
      response,
      next
    );
    expect(status).toHaveBeenCalledWith(
      responseCodes_1.ResponseCodes.unprocessableEntity
    );
    expect(send).toBeCalledWith({
      message:
        'child "soloStreakId" fails because ["soloStreakId" must be a string]'
    });
    expect(next).not.toBeCalled();
  });
});
describe("soloStreakExistsMiddleware", () => {
  test("sets response.locals.soloStreak and calls next()", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(3);
      const soloStreakId = "abc";
      const request = {
        params: { soloStreakId }
      };
      const response = { locals: {} };
      const next = jest.fn();
      const findOne = jest.fn(() => Promise.resolve(true));
      const soloStreakModel = { findOne };
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSoloStreakExistsMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(findOne).toBeCalledWith({ _id: soloStreakId });
      expect(response.locals.soloStreak).toBeDefined();
      expect(next).toBeCalledWith();
    }));
  test("throws SoloStreakDoesNotExist error when solo streak does not exist", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const soloStreakId = "abc";
      const request = {
        params: { soloStreakId }
      };
      const response = { locals: {} };
      const next = jest.fn();
      const findOne = jest.fn(() => Promise.resolve(false));
      const soloStreakModel = { findOne };
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSoloStreakExistsMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.SoloStreakDoesNotExist
        )
      );
    }));
  test("throws SoloStreakExistsMiddleware error on middleware failure", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const request = {};
      const response = { locals: {} };
      const next = jest.fn();
      const findOne = jest.fn(() => Promise.resolve(true));
      const soloStreakModel = { findOne };
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSoloStreakExistsMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.SoloStreakExistsMiddleware,
          expect.any(Error)
        )
      );
    }));
});
describe("retreiveTimezoneHeaderMiddleware", () => {
  test("sets response.locals.timezone and calls next()", () => {
    expect.assertions(3);
    const header = jest.fn(() => timezoneHeader);
    const timezoneHeader = "Europe/London";
    const request = {
      header
    };
    const response = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getRetreiveTimezoneHeaderMiddleware(
      timezoneHeader
    );
    middleware(request, response, next);
    expect(header).toBeCalledWith(timezoneHeader);
    expect(response.locals.timezone).toBeDefined();
    expect(next).toBeCalledWith();
  });
  test("throws MissingTimezoneHeader error when timezone is missing", () => {
    expect.assertions(1);
    const header = jest.fn(() => timezoneHeader);
    const timezoneHeader = undefined;
    const request = {
      header
    };
    const response = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getRetreiveTimezoneHeaderMiddleware(
      timezoneHeader
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.MissingTimezoneHeader
      )
    );
  });
  test("throws RetreiveTimezoneHeaderMiddleware when middleware fails", () => {
    expect.assertions(1);
    const timezoneHeader = "Europe/London";
    const request = {};
    const response = {
      locals: {}
    };
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getRetreiveTimezoneHeaderMiddleware(
      timezoneHeader
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.RetreiveTimezoneHeaderMiddleware,
        expect.any(Error)
      )
    );
  });
});
describe("validateTimezoneMiddleware", () => {
  test("sets response.locals.validTimezone and calls next()", () => {
    expect.assertions(2);
    const timezone = "Europe/London";
    const request = {};
    const response = { locals: { timezone } };
    const next = jest.fn();
    const isValidTimezone = jest.fn(() => true);
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getValidateTimezoneMiddleware(
      isValidTimezone
    );
    middleware(request, response, next);
    expect(isValidTimezone).toBeCalledWith(timezone);
    expect(next).toBeCalledWith();
  });
  test("throws InvalidTimezone error when timezone is invalid", () => {
    expect.assertions(1);
    const timezone = "Invalid";
    const request = {};
    const response = { locals: { timezone } };
    const next = jest.fn();
    const isValidTimezone = jest.fn(() => false);
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getValidateTimezoneMiddleware(
      isValidTimezone
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(customError_1.ErrorType.InvalidTimezone)
    );
  });
  test("throws ValidateTimezoneMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const timezone = "Europe/London";
    const request = {};
    const response = { locals: { timezone } };
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getValidateTimezoneMiddleware(
      undefined
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.ValidateTimezoneMiddleware,
        expect.any(Error)
      )
    );
  });
});
describe("retreiveUserMiddleware", () => {
  test("sets response.locals.user and calls next()", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(4);
      const _id = "abcd";
      const minimumUserData = { _id };
      const lean = jest.fn(() => true);
      const findOne = jest.fn(() => ({ lean }));
      const userModel = { findOne };
      const request = {};
      const response = { locals: { minimumUserData } };
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getRetreiveUserMiddleware(
        userModel
      );
      yield middleware(request, response, next);
      expect(response.locals.user).toBeDefined();
      expect(findOne).toBeCalledWith({ _id: minimumUserData._id });
      expect(lean).toBeCalledWith();
      expect(next).toBeCalledWith();
    }));
  test("throws UserDoesNotExistError when user does not exist", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const _id = "abcd";
      const minimumUserData = { _id };
      const lean = jest.fn(() => false);
      const findOne = jest.fn(() => ({ lean }));
      const userModel = { findOne };
      const request = {};
      const response = { locals: { minimumUserData } };
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getRetreiveUserMiddleware(
        userModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(customError_1.ErrorType.UserDoesNotExist)
      );
    }));
  test("throws RetreiveUserMiddleware error on middleware failure", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const send = jest.fn();
      const status = jest.fn(() => ({ send }));
      const _id = "abcd";
      const minimumUserData = { _id };
      const findOne = jest.fn(() => ({}));
      const userModel = { findOne };
      const request = {};
      const response = { status, locals: { minimumUserData } };
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getRetreiveUserMiddleware(
        userModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.RetreiveUserMiddleware,
          expect.any(Error)
        )
      );
    }));
});
describe("setTaskCompleteTimeMiddleware", () => {
  test("sets response.locals.taskCompleteTime and calls next()", () => {
    expect.assertions(4);
    const timezone = "Europe/London";
    const tz = jest.fn(() => true);
    const moment = jest.fn(() => ({ tz }));
    const request = {};
    const response = { locals: { timezone } };
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSetTaskCompleteTimeMiddleware(
      moment
    );
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
    const request = {};
    const response = {};
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSetTaskCompleteTimeMiddleware(
      moment
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.SetTaskCompleteTimeMiddleware,
        expect.any(Error)
      )
    );
  });
});
describe("setStreakStartDateMiddleware", () => {
  test("sets soloStreak.startDate to taskCompleteTime if it's undefined and calls next()", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(2);
      const findByIdAndUpdate = jest.fn();
      const soloStreakModel = {
        findByIdAndUpdate
      };
      const taskCompleteTime = new Date();
      const soloStreakId = 1;
      const soloStreak = {
        currentStreak: {
          startDate: undefined
        }
      };
      const request = { params: { soloStreakId } };
      const response = { locals: { soloStreak, taskCompleteTime } };
      const next = jest.fn();
      const middleware = yield createSoloStreakCompleteTaskMiddlewares_1.getSetStreakStartDateMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(findByIdAndUpdate).toBeCalledWith(soloStreakId, {
        currentStreak: { startDate: taskCompleteTime }
      });
      expect(next).toBeCalledWith();
    }));
  test("doesn't update soloStreak currentStreak.startDate if it's already set", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(2);
      const findByIdAndUpdate = jest.fn();
      const soloStreakModel = {
        findByIdAndUpdate
      };
      const taskCompleteTime = new Date();
      const soloStreakId = 1;
      const soloStreak = {
        currentStreak: {
          startDate: new Date()
        }
      };
      const request = { params: { soloStreakId } };
      const response = { locals: { soloStreak, taskCompleteTime } };
      const next = jest.fn();
      const middleware = yield createSoloStreakCompleteTaskMiddlewares_1.getSetStreakStartDateMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(findByIdAndUpdate).not.toBeCalled();
      expect(next).toBeCalledWith();
    }));
  test("throws SetStreakStartDateMiddleware on middleware failure", () => {
    expect.assertions(1);
    const request = {};
    const response = {};
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSetStreakStartDateMiddleware(
      undefined
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.SetStreakStartDateMiddleware,
        expect.any(Error)
      )
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
    const request = {};
    const response = { locals: { taskCompleteTime } };
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSetDayTaskWasCompletedMiddleware(
      dayFormat
    );
    middleware(request, response, next);
    expect(format).toBeCalledWith(dayFormat);
    expect(response.locals.taskCompleteDay).toBeDefined();
    expect(next).toBeDefined();
  });
  test("throws setDayTaskWasCompletedMiddleware error on middleware failure", () => {
    expect.assertions(1);
    const dayFormat = "DD/MM/YYYY";
    const request = {};
    const response = { locals: {} };
    const next = jest.fn();
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSetDayTaskWasCompletedMiddleware(
      dayFormat
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.SetDayTaskWasCompletedMiddleware,
        expect.any(Error)
      )
    );
  });
});
describe("hasTaskAlreadyBeenCompletedTodayMiddleware", () => {
  test("checks task has not already been completed today", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(2);
      const findOne = jest.fn(() => Promise.resolve(false));
      const completeTaskModel = { findOne };
      const soloStreakId = "abcd";
      const taskCompleteDay = "26/04/2012";
      const _id = "a1b2";
      const user = {
        _id
      };
      const request = { params: { soloStreakId } };
      const response = { locals: { taskCompleteDay, user } };
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getHasTaskAlreadyBeenCompletedTodayMiddleware(
        completeTaskModel
      );
      yield middleware(request, response, next);
      expect(findOne).toBeCalledWith({
        userId: _id,
        streakId: soloStreakId,
        taskCompleteDay
      });
      expect(next).toBeCalledWith();
    }));
  test("throws TaskAlreadyCompletedToday error if task has already been completed today", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const findOne = jest.fn(() => Promise.resolve(true));
      const completeTaskModel = { findOne };
      const soloStreakId = "abcd";
      const taskCompleteDay = "26/04/2012";
      const _id = "a1b2";
      const user = {
        _id
      };
      const request = { params: { soloStreakId } };
      const response = { locals: { taskCompleteDay, user } };
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getHasTaskAlreadyBeenCompletedTodayMiddleware(
        completeTaskModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.TaskAlreadyCompletedToday
        )
      );
    }));
  test("throws HasTaskAlreadyBeenCompletedTodayMiddleware error on middleware failure", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const findOne = jest.fn(() => Promise.resolve(true));
      const completeTaskModel = { findOne };
      const soloStreakId = "abcd";
      const taskCompleteDay = "26/04/2012";
      const _id = "a1b2";
      const user = {
        _id
      };
      const request = {};
      const response = { locals: { taskCompleteDay, user } };
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getHasTaskAlreadyBeenCompletedTodayMiddleware(
        completeTaskModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware,
          expect.any(Error)
        )
      );
    }));
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
    const _id = "777ff";
    const user = {
      _id
    };
    const request = {
      params: { soloStreakId }
    };
    const response = {
      locals: {
        taskCompleteTime,
        taskCompleteDay,
        user
      }
    };
    const next = jest.fn();
    const streakType = "soloStreak";
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getCreateCompleteTaskDefinitionMiddleware(
      streakType
    );
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
  test("throws CreateCompleteTaskDefinitionMiddlware error on middleware failure", () => {
    expect.assertions(1);
    const soloStreakId = "abcd123";
    const taskCompleteTime = {};
    const taskCompleteDay = "09/05/2019";
    const _id = "777ff";
    const user = {
      _id
    };
    const request = {
      params: { soloStreakId }
    };
    const response = {
      locals: {
        taskCompleteTime,
        taskCompleteDay,
        user
      }
    };
    const next = jest.fn();
    const streakType = "soloStreak";
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getCreateCompleteTaskDefinitionMiddleware(
      streakType
    );
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.CreateCompleteTaskDefinitionMiddleware,
        expect.any(Error)
      )
    );
  });
});
describe(`saveTaskCompleteMiddleware`, () => {
  test("sets response.locals.completeTask and calls next", () =>
    __awaiter(this, void 0, void 0, function*() {
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
        constructor(
          userId,
          streakId,
          taskCompleteTime,
          taskCompleteDay,
          streakType
        ) {
          this.userId = userId;
          (this.streakId = streakId),
            (this.taskCompleteTime = taskCompleteTime);
          this.taskCompleteDay = taskCompleteDay;
          this.streakType = streakType;
        }
        save() {
          return save();
        }
      }
      const request = {};
      const response = { locals: { completeTaskDefinition } };
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSaveTaskCompleteMiddleware(
        CompleteTaskModel
      );
      yield middleware(request, response, next);
      expect(response.locals.completeTask).toBeDefined();
      expect(save).toBeCalledWith();
      expect(next).toBeCalledWith();
    }));
  test("throws SaveTaskCompleteMiddleware error on Middleware failure", () =>
    __awaiter(this, void 0, void 0, function*() {
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
      const request = {};
      const response = { locals: { completeTaskDefinition } };
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSaveTaskCompleteMiddleware(
        {}
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.SaveTaskCompleteMiddleware,
          expect.any(Error)
        )
      );
    }));
});
describe("streakMaintainedMiddleware", () => {
  test("updates streak completedToday, increments number of days and calls next", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(2);
      const soloStreakId = "123abc";
      const updateOne = jest.fn(() => Promise.resolve(true));
      const soloStreakModel = {
        updateOne
      };
      const request = { params: { soloStreakId } };
      const response = {};
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getStreakMaintainedMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(updateOne).toBeCalledWith(
        { _id: soloStreakId },
        {
          completedToday: true,
          $inc: { "currentStreak.numberOfDaysInARow": 1 }
        }
      );
      expect(next).toBeCalledWith();
    }));
  test("throws StreakMaintainedMiddleware error on middleware failure", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(1);
      const soloStreakId = "123abc";
      const soloStreakModel = {};
      const request = { params: { soloStreakId } };
      const response = {};
      const next = jest.fn();
      const middleware = createSoloStreakCompleteTaskMiddlewares_1.getStreakMaintainedMiddleware(
        soloStreakModel
      );
      yield middleware(request, response, next);
      expect(next).toBeCalledWith(
        new customError_1.CustomError(
          customError_1.ErrorType.StreakMaintainedMiddleware,
          expect.any(Error)
        )
      );
    }));
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
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSendTaskCompleteResponseMiddleware(
      successResponseCode
    );
    const request = {};
    const response = { locals: { completeTask }, status };
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
    const middleware = createSoloStreakCompleteTaskMiddlewares_1.getSendTaskCompleteResponseMiddleware(
      successResponseCode
    );
    const request = {};
    const response = { locals: { completeTask } };
    const next = jest.fn();
    middleware(request, response, next);
    expect(next).toBeCalledWith(
      new customError_1.CustomError(
        customError_1.ErrorType.SendTaskCompleteResponseMiddleware,
        expect.any(Error)
      )
    );
  });
});
describe(`createSoloStreakCompleteTaskMiddlewares`, () => {
  test("checks createSoloStreakTaskMiddlweares are defined in the correct order", () =>
    __awaiter(this, void 0, void 0, function*() {
      expect.assertions(13);
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[0]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.soloStreakTaskCompleteParamsValidationMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[1]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.soloStreakExistsMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[2]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.retreiveTimezoneHeaderMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[3]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.validateTimezoneMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[4]
      ).toBe(createSoloStreakCompleteTaskMiddlewares_1.retreiveUserMiddleware);
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[5]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.setTaskCompleteTimeMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[6]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.setStreakStartDateMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[7]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.setDayTaskWasCompletedMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[8]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.hasTaskAlreadyBeenCompletedTodayMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[9]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.createCompleteTaskDefinitionMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[10]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.saveTaskCompleteMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[11]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.streakMaintainedMiddleware
      );
      expect(
        createSoloStreakCompleteTaskMiddlewares_1
          .createSoloStreakCompleteTaskMiddlewares[12]
      ).toBe(
        createSoloStreakCompleteTaskMiddlewares_1.sendTaskCompleteResponseMiddleware
      );
    }));
});
//# sourceMappingURL=createSoloStreakCompleteTaskMiddlewares.spec.js.map
