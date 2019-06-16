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
var GetSoloStreaksQueryParamaters;
(function(GetSoloStreaksQueryParamaters) {
  GetSoloStreaksQueryParamaters["userId"] = "userId";
})(
  (GetSoloStreaksQueryParamaters =
    exports.GetSoloStreaksQueryParamaters ||
    (exports.GetSoloStreaksQueryParamaters = {}))
);
const getSoloStreaksValidationSchema = {
  userId: Joi.string().required()
};
exports.getSoloStreaksValidationMiddleware = (request, response, next) => {
  Joi.validate(
    request.query,
    getSoloStreaksValidationSchema,
    validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(
      request,
      response,
      next
    )
  );
};
exports.getFindSoloStreaksMiddleware = soloStreakModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { userId } = request.query;
      response.locals.soloStreaks = yield soloStreakModel.find({
        userId
      });
      next();
    } catch (err) {
      next(err);
    }
  });
exports.findSoloStreaksMiddleware = exports.getFindSoloStreaksMiddleware(
  SoloStreak_1.soloStreakModel
);
exports.sendSoloStreaksMiddleware = (request, response, next) => {
  try {
    const { soloStreaks } = response.locals;
    response
      .status(responseCodes_1.ResponseCodes.success)
      .send({ soloStreaks });
  } catch (err) {
    next(err);
  }
};
exports.getSoloStreaksMiddlewares = [
  exports.getSoloStreaksValidationMiddleware,
  exports.findSoloStreaksMiddleware,
  exports.sendSoloStreaksMiddleware
];
//# sourceMappingURL=getSoloStreaksMiddlewares.js.map
