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
const User_1 = require("../../Models/User");
const responseCodes_1 = require("../../Server/responseCodes");
exports.minimumSeachQueryLength = 1;
exports.maximumSearchQueryLength = 64;
const getUsersValidationSchema = {
  searchQuery: Joi.string()
    .min(exports.minimumSeachQueryLength)
    .max(exports.maximumSearchQueryLength)
    .required()
};
exports.retreiveUsersValidationMiddleware = (request, response, next) => {
  Joi.validate(
    request.query,
    getUsersValidationSchema,
    validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(
      request,
      response,
      next
    )
  );
};
exports.setSearchQueryToLowercaseMiddleware = (request, response, next) => {
  try {
    const { searchQuery } = request.query;
    response.locals.lowerCaseSearchQuery = searchQuery.toLowerCase();
    next();
  } catch (err) {
    next(err);
  }
};
exports.getRetreiveUsersByUsernameRegexSearchMiddleware = userModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { lowerCaseSearchQuery } = response.locals;
      response.locals.users = yield userModel.find({
        userName: { $regex: lowerCaseSearchQuery }
      });
      next();
    } catch (err) {
      next(err);
    }
  });
exports.retreiveUsersByUsernameRegexSearchMiddleware = exports.getRetreiveUsersByUsernameRegexSearchMiddleware(
  User_1.userModel
);
exports.formatUsersMiddleware = (request, response, next) => {
  try {
    const { users } = response.locals;
    response.locals.formattedUsers = users.map(user => {
      return Object.assign({}, user.toObject(), { password: undefined });
    });
    next();
  } catch (err) {
    next(err);
  }
};
exports.sendFormattedUsersMiddleware = (request, response, next) => {
  try {
    const { formattedUsers } = response.locals;
    return response
      .status(responseCodes_1.ResponseCodes.success)
      .send({ users: formattedUsers });
  } catch (err) {
    next(err);
  }
};
exports.getUsersMiddlewares = [
  exports.retreiveUsersValidationMiddleware,
  exports.setSearchQueryToLowercaseMiddleware,
  exports.retreiveUsersByUsernameRegexSearchMiddleware,
  exports.formatUsersMiddleware,
  exports.sendFormattedUsersMiddleware
];
//# sourceMappingURL=getUsersMiddlewares.js.map
