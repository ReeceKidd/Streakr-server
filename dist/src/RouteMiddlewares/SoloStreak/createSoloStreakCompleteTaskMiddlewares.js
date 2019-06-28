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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var __importStar =
  (this && this.__importStar) ||
  function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
  };
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const Joi = __importStar(require("joi"));
const headers_1 = require("../../Server/headers");
const responseCodes_1 = require("../../Server/responseCodes");
const User_1 = require("../../Models/User");
const SoloStreak_1 = require("../../Models/SoloStreak");
const CompleteTask_1 = require("../../Models/CompleteTask");
const validationErrorMessageSenderMiddleware_1 = require("../../SharedMiddleware/validationErrorMessageSenderMiddleware");
const customError_1 = require("../../customError");
exports.soloStreakTaskCompleteParamsValidationSchema = {
  soloStreakId: Joi.string().required()
};
exports.soloStreakTaskCompleteParamsValidationMiddleware = (
  request,
  response,
  next
) => {
  Joi.validate(
    request.params,
    exports.soloStreakTaskCompleteParamsValidationSchema,
    validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(
      request,
      response,
      next
    )
  );
};
exports.getSoloStreakExistsMiddleware = soloStreakModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { soloStreakId } = request.params;
      const soloStreak = yield soloStreakModel.findOne({ _id: soloStreakId });
      if (!soloStreak) {
        throw new customError_1.CustomError(
          customError_1.ErrorType.SoloStreakDoesNotExist
        );
      }
      response.locals.soloStreak = soloStreak;
      next();
    } catch (err) {
      if (err instanceof customError_1.CustomError) next(err);
      else
        next(
          new customError_1.CustomError(
            customError_1.ErrorType.SoloStreakExistsMiddleware,
            err
          )
        );
    }
  });
exports.soloStreakExistsMiddleware = exports.getSoloStreakExistsMiddleware(
  SoloStreak_1.soloStreakModel
);
exports.getRetreiveTimezoneHeaderMiddleware = timezoneHeader => (
  request,
  response,
  next
) => {
  try {
    const timezone = request.header(timezoneHeader);
    if (!timezone) {
      throw new customError_1.CustomError(
        customError_1.ErrorType.InvalidTimezone
      );
    }
    response.locals.timezone = timezone;
    next();
  } catch (err) {
    if (err instanceof customError_1.CustomError) next(err);
    else
      next(
        new customError_1.CustomError(
          customError_1.ErrorType.RetreiveTimezoneHeaderMiddleware,
          err
        )
      );
  }
};
exports.retreiveTimezoneHeaderMiddleware = exports.getRetreiveTimezoneHeaderMiddleware(
  headers_1.SupportedRequestHeaders.xTimezone
);
exports.getValidateTimezoneMiddleware = isValidTimezone => (
  request,
  response,
  next
) => {
  try {
    const { timezone } = response.locals;
    const validTimezone = isValidTimezone(timezone);
    if (!validTimezone) {
      throw new customError_1.CustomError(
        customError_1.ErrorType.InvalidTimezone
      );
    }
    next();
  } catch (err) {
    if (err instanceof customError_1.CustomError) next(err);
    else
      next(
        new customError_1.CustomError(
          customError_1.ErrorType.ValidateTimezoneMiddleware,
          err
        )
      );
  }
};
exports.validateTimezoneMiddleware = exports.getValidateTimezoneMiddleware(
  moment_timezone_1.default.tz.zone
);
exports.getRetreiveUserMiddleware = userModel => (request, response, next) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { minimumUserData } = response.locals;
      const user = yield userModel.findOne({ _id: minimumUserData._id }).lean();
      if (!user) {
        throw new customError_1.CustomError(
          customError_1.ErrorType.UserDoesNotExist
        );
      }
      response.locals.user = user;
      next();
    } catch (err) {
      if (err instanceof customError_1.CustomError) next(err);
      else
        next(
          new customError_1.CustomError(
            customError_1.ErrorType.RetreiveUserMiddleware,
            err
          )
        );
    }
  });
exports.retreiveUserMiddleware = exports.getRetreiveUserMiddleware(
  User_1.userModel
);
exports.getSetTaskCompleteTimeMiddleware = moment => (
  request,
  response,
  next
) => {
  try {
    const { timezone } = response.locals;
    const taskCompleteTime = moment().tz(timezone);
    response.locals.taskCompleteTime = taskCompleteTime;
    next();
  } catch (err) {
    next(
      new customError_1.CustomError(
        customError_1.ErrorType.SetTaskCompleteTimeMiddleware,
        err
      )
    );
  }
};
exports.setTaskCompleteTimeMiddleware = exports.getSetTaskCompleteTimeMiddleware(
  moment_timezone_1.default
);
exports.getSetStreakStartDateMiddleware = soloStreakModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const soloStreak = response.locals.soloStreak;
      const taskCompleteTime = response.locals.taskCompleteTime;
      if (!soloStreak.currentStreak.startDate) {
        const { soloStreakId } = request.params;
        yield soloStreakModel.findByIdAndUpdate(soloStreakId, {
          currentStreak: { startDate: taskCompleteTime }
        });
      }
      next();
    } catch (err) {
      next(
        new customError_1.CustomError(
          customError_1.ErrorType.SetStreakStartDateMiddleware,
          err
        )
      );
    }
  });
exports.setStreakStartDateMiddleware = exports.getSetStreakStartDateMiddleware(
  SoloStreak_1.soloStreakModel
);
exports.getSetDayTaskWasCompletedMiddleware = dayFormat => (
  request,
  response,
  next
) => {
  try {
    const { taskCompleteTime } = response.locals;
    const taskCompleteDay = taskCompleteTime.format(dayFormat);
    response.locals.taskCompleteDay = taskCompleteDay;
    next();
  } catch (err) {
    next(
      new customError_1.CustomError(
        customError_1.ErrorType.SetDayTaskWasCompletedMiddleware,
        err
      )
    );
  }
};
exports.dayFormat = "YYYY-MM-DD";
exports.setDayTaskWasCompletedMiddleware = exports.getSetDayTaskWasCompletedMiddleware(
  exports.dayFormat
);
exports.getHasTaskAlreadyBeenCompletedTodayMiddleware = completeTaskModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { soloStreakId } = request.params;
      const { taskCompleteDay, user } = response.locals;
      const taskAlreadyCompletedToday = yield completeTaskModel.findOne({
        userId: user._id,
        streakId: soloStreakId,
        taskCompleteDay
      });
      if (taskAlreadyCompletedToday) {
        throw new customError_1.CustomError(
          customError_1.ErrorType.TaskAlreadyCompletedToday
        );
      }
      next();
    } catch (err) {
      if (err instanceof customError_1.CustomError) next(err);
      else
        next(
          new customError_1.CustomError(
            customError_1.ErrorType.HasTaskAlreadyBeenCompletedTodayMiddleware,
            err
          )
        );
    }
  });
exports.hasTaskAlreadyBeenCompletedTodayMiddleware = exports.getHasTaskAlreadyBeenCompletedTodayMiddleware(
  CompleteTask_1.completeTaskModel
);
exports.getCreateCompleteTaskDefinitionMiddleware = streakType => (
  request,
  response,
  next
) => {
  try {
    const { soloStreakId } = request.params;
    const { taskCompleteTime, taskCompleteDay, user } = response.locals;
    const completeTaskDefinition = {
      userId: user._id,
      streakId: soloStreakId,
      taskCompleteTime: taskCompleteTime.toDate(),
      taskCompleteDay,
      streakType
    };
    response.locals.completeTaskDefinition = completeTaskDefinition;
    next();
  } catch (err) {
    next(
      new customError_1.CustomError(
        customError_1.ErrorType.CreateCompleteTaskDefinitionMiddleware,
        err
      )
    );
  }
};
exports.createCompleteTaskDefinitionMiddleware = exports.getCreateCompleteTaskDefinitionMiddleware(
  CompleteTask_1.TypesOfStreak.soloStreak
);
exports.getSaveTaskCompleteMiddleware = completeTaskModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { completeTaskDefinition } = response.locals;
      const completeTask = yield new completeTaskModel(
        completeTaskDefinition
      ).save();
      response.locals.completeTask = completeTask;
      next();
    } catch (err) {
      next(
        new customError_1.CustomError(
          customError_1.ErrorType.SaveTaskCompleteMiddleware,
          err
        )
      );
    }
  });
exports.saveTaskCompleteMiddleware = exports.getSaveTaskCompleteMiddleware(
  CompleteTask_1.completeTaskModel
);
exports.getStreakMaintainedMiddleware = soloStreakModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { soloStreakId } = request.params;
      yield soloStreakModel.updateOne(
        { _id: soloStreakId },
        {
          completedToday: true,
          $inc: { "currentStreak.numberOfDaysInARow": 1 }
        }
      );
      next();
    } catch (err) {
      next(
        new customError_1.CustomError(
          customError_1.ErrorType.StreakMaintainedMiddleware,
          err
        )
      );
    }
  });
exports.streakMaintainedMiddleware = exports.getStreakMaintainedMiddleware(
  SoloStreak_1.soloStreakModel
);
exports.getSendTaskCompleteResponseMiddleware = resourceCreatedResponseCode => (
  request,
  response,
  next
) => {
  try {
    const { completeTask } = response.locals;
    return response.status(resourceCreatedResponseCode).send({ completeTask });
  } catch (err) {
    next(
      new customError_1.CustomError(
        customError_1.ErrorType.SendTaskCompleteResponseMiddleware,
        err
      )
    );
  }
};
exports.sendTaskCompleteResponseMiddleware = exports.getSendTaskCompleteResponseMiddleware(
  responseCodes_1.ResponseCodes.created
);
exports.createSoloStreakCompleteTaskMiddlewares = [
  exports.soloStreakTaskCompleteParamsValidationMiddleware,
  exports.soloStreakExistsMiddleware,
  exports.retreiveTimezoneHeaderMiddleware,
  exports.validateTimezoneMiddleware,
  exports.retreiveUserMiddleware,
  exports.setTaskCompleteTimeMiddleware,
  exports.setStreakStartDateMiddleware,
  exports.setDayTaskWasCompletedMiddleware,
  exports.hasTaskAlreadyBeenCompletedTodayMiddleware,
  exports.createCompleteTaskDefinitionMiddleware,
  exports.saveTaskCompleteMiddleware,
  exports.streakMaintainedMiddleware,
  exports.sendTaskCompleteResponseMiddleware
];
//# sourceMappingURL=createSoloStreakCompleteTaskMiddlewares.js.map
