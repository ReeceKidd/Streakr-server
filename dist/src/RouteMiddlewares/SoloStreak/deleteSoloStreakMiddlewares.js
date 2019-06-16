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
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const validationErrorMessageSenderMiddleware_1 = require("../../SharedMiddleware/validationErrorMessageSenderMiddleware");
const SoloStreak_1 = require("../../Models/SoloStreak");
const responseCodes_1 = require("../../Server/responseCodes");
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const messageCategories_1 = require("../../Messages/messageCategories");
const failureMessages_1 = require("../../Messages/failureMessages");
const soloStreakParamsValidationSchema = {
  soloStreakId: Joi.string().required()
};
exports.soloStreakParamsValidationMiddleware = (request, response, next) => {
  Joi.validate(
    request.params,
    soloStreakParamsValidationSchema,
    validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(
      request,
      response,
      next
    )
  );
};
exports.getDeleteSoloStreakMiddleware = soloStreakModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { soloStreakId } = request.params;
      const deletedSoloStreak = yield soloStreakModel.findByIdAndDelete(
        soloStreakId
      );
      response.locals.deletedSoloStreak = deletedSoloStreak;
      next();
    } catch (err) {
      next(err);
    }
  });
exports.deleteSoloStreakMiddleware = exports.getDeleteSoloStreakMiddleware(
  SoloStreak_1.soloStreakModel
);
exports.getSoloStreakNotFoundMiddleware = (
  badRequestResponseCode,
  localisedSoloStreakDoesNotExistErrorMessage
) => (request, response, next) => {
  try {
    const { deletedSoloStreak } = response.locals;
    if (!deletedSoloStreak) {
      return response
        .status(badRequestResponseCode)
        .send({ message: localisedSoloStreakDoesNotExistErrorMessage });
    }
    next();
  } catch (err) {
    next(err);
  }
};
const localisedSoloStreakDoesNotExistErrorMessage = getLocalisedString_1.getLocalisedString(
  messageCategories_1.MessageCategories.failureMessages,
  failureMessages_1.FailureMessageKeys.soloStreakDoesNotExist
);
exports.soloStreakNotFoundMiddleware = exports.getSoloStreakNotFoundMiddleware(
  responseCodes_1.ResponseCodes.badRequest,
  localisedSoloStreakDoesNotExistErrorMessage
);
exports.getSendSoloStreakDeletedResponseMiddleware = successfulDeletetionResponseCode => (
  request,
  response,
  next
) => {
  try {
    return response.status(successfulDeletetionResponseCode).send();
  } catch (err) {
    next(err);
  }
};
exports.sendSoloStreakDeletedResponseMiddleware = exports.getSendSoloStreakDeletedResponseMiddleware(
  responseCodes_1.ResponseCodes.deleted
);
exports.deleteSoloStreakMiddlewares = [
  exports.soloStreakParamsValidationMiddleware,
  exports.deleteSoloStreakMiddleware,
  exports.soloStreakNotFoundMiddleware,
  exports.sendSoloStreakDeletedResponseMiddleware
];
//# sourceMappingURL=deleteSoloStreakMiddlewares.js.map
