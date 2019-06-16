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
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const agenda_1 = require("../../Agenda/agenda");
const validationErrorMessageSenderMiddleware_1 = require("../../SharedMiddleware/validationErrorMessageSenderMiddleware");
const SoloStreak_1 = require("../../Models/SoloStreak");
const responseCodes_1 = require("../../Server/responseCodes");
const headers_1 = require("../../Server/headers");
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const messageCategories_1 = require("../../Messages/messageCategories");
const failureMessages_1 = require("../../Messages/failureMessages");
const createSoloStreakCompleteTaskMiddlewares_1 = require("./createSoloStreakCompleteTaskMiddlewares");
const soloStreakRegisterstrationValidationSchema = {
  userId: Joi.string().required(),
  name: Joi.string().required(),
  description: Joi.string().required()
};
exports.soloStreakRegistrationValidationMiddleware = (
  request,
  response,
  next
) => {
  Joi.validate(
    request.body,
    soloStreakRegisterstrationValidationSchema,
    validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(
      request,
      response,
      next
    )
  );
};
const localisedMissingTimezoneHeaderMessage = getLocalisedString_1.getLocalisedString(
  messageCategories_1.MessageCategories.failureMessages,
  failureMessages_1.FailureMessageKeys.missingTimezoneHeaderMessage
);
exports.retreiveTimezoneHeaderMiddleware = (request, response, next) => {
  try {
    response.locals.timezone = request.header(
      headers_1.SupportedRequestHeaders.xTimezone
    );
    next();
  } catch (err) {
    next(err);
  }
};
exports.getSendMissingTimezoneErrorResponseMiddleware = localisedErrorMessage => (
  request,
  response,
  next
) => {
  try {
    const { timezone } = response.locals;
    if (!timezone) {
      return response
        .status(responseCodes_1.ResponseCodes.unprocessableEntity)
        .send({ message: localisedErrorMessage });
    }
    next();
  } catch (err) {
    next(err);
  }
};
exports.sendMissingTimezoneErrorResponseMiddleware = exports.getSendMissingTimezoneErrorResponseMiddleware(
  localisedMissingTimezoneHeaderMessage
);
exports.getValidateTimezoneMiddleware = isValidTimezone => (
  request,
  response,
  next
) => {
  try {
    const { timezone } = response.locals;
    response.locals.validTimezone = isValidTimezone(timezone);
    next();
  } catch (err) {
    next(err);
  }
};
exports.validateTimezoneMiddleware = exports.getValidateTimezoneMiddleware(
  moment_timezone_1.default.tz.zone
);
exports.getSendInvalidTimezoneErrorResponseMiddleware = localisedErrorMessage => (
  request,
  response,
  next
) => {
  try {
    const { validTimezone } = response.locals;
    if (!validTimezone) {
      return response
        .status(responseCodes_1.ResponseCodes.unprocessableEntity)
        .send({ message: localisedErrorMessage });
    }
    next();
  } catch (err) {
    next(err);
  }
};
const localisedInvalidTimezoneMessage = getLocalisedString_1.getLocalisedString(
  messageCategories_1.MessageCategories.failureMessages,
  failureMessages_1.FailureMessageKeys.invalidTimezoneMessage
);
exports.sendInvalidTimezoneErrorResponseMiddleware = exports.getSendInvalidTimezoneErrorResponseMiddleware(
  localisedInvalidTimezoneMessage
);
exports.getDefineCurrentTimeMiddleware = moment => (
  request,
  response,
  next
) => {
  try {
    const { timezone } = response.locals;
    const currentTime = moment().tz(timezone);
    response.locals.currentTime = currentTime;
    next();
  } catch (err) {
    next(err);
  }
};
exports.defineCurrentTimeMiddleware = exports.getDefineCurrentTimeMiddleware(
  moment_timezone_1.default
);
exports.getDefineStartDayMiddleware = dayFormat => (
  request,
  response,
  next
) => {
  try {
    const { currentTime } = response.locals;
    const startDay = currentTime.format(dayFormat);
    response.locals.startDay = startDay;
    next();
  } catch (err) {
    next(err);
  }
};
exports.defineStartDayMiddleware = exports.getDefineStartDayMiddleware(
  createSoloStreakCompleteTaskMiddlewares_1.dayFormat
);
exports.getDefineEndOfDayMiddleware = dayTimeRange => (
  request,
  response,
  next
) => {
  try {
    const { currentTime } = response.locals;
    response.locals.endOfDay = currentTime.endOf(dayTimeRange).toDate();
    next();
  } catch (err) {
    next(err);
  }
};
exports.defineEndOfDayMiddleware = exports.getDefineEndOfDayMiddleware(
  agenda_1.AgendaTimeRanges.day
);
exports.getCreateSoloStreakFromRequestMiddleware = soloStreak => (
  request,
  response,
  next
) => {
  try {
    const { timezone } = response.locals;
    const { name, description, userId } = request.body;
    response.locals.newSoloStreak = new soloStreak({
      name,
      description,
      userId,
      timezone
    });
    next();
  } catch (err) {
    next(err);
  }
};
exports.createSoloStreakFromRequestMiddleware = exports.getCreateSoloStreakFromRequestMiddleware(
  SoloStreak_1.soloStreakModel
);
exports.saveSoloStreakToDatabaseMiddleware = (request, response, next) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const newSoloStreak = response.locals.newSoloStreak;
      response.locals.savedSoloStreak = yield newSoloStreak.save();
      next();
    } catch (err) {
      next(err);
    }
  });
exports.sendFormattedSoloStreakMiddleware = (request, response, next) => {
  try {
    const { savedSoloStreak } = response.locals;
    return response
      .status(responseCodes_1.ResponseCodes.created)
      .send(savedSoloStreak);
  } catch (err) {
    next(err);
  }
};
exports.createSoloStreakMiddlewares = [
  exports.soloStreakRegistrationValidationMiddleware,
  exports.retreiveTimezoneHeaderMiddleware,
  exports.sendMissingTimezoneErrorResponseMiddleware,
  exports.validateTimezoneMiddleware,
  exports.sendInvalidTimezoneErrorResponseMiddleware,
  exports.defineCurrentTimeMiddleware,
  exports.defineStartDayMiddleware,
  exports.defineEndOfDayMiddleware,
  exports.createSoloStreakFromRequestMiddleware,
  exports.saveSoloStreakToDatabaseMiddleware,
  exports.sendFormattedSoloStreakMiddleware
];
//# sourceMappingURL=createSoloStreakMiddlewares.js.map
