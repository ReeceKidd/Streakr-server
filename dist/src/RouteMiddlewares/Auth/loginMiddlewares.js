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
const bcryptjs_1 = require("bcryptjs");
const jwt = __importStar(require("jsonwebtoken"));
const jwt_secret_1 = require("../../../secret/jwt-secret");
const failureMessages_1 = require("../../Messages/failureMessages");
const successMessages_1 = require("../../Messages/successMessages");
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const messageCategories_1 = require("../../Messages/messageCategories");
const validationErrorMessageSenderMiddleware_1 = require("../../SharedMiddleware/validationErrorMessageSenderMiddleware");
const User_1 = require("../../Models/User");
const responseCodes_1 = require("../../Server/responseCodes");
const loginValidationSchema = {
  email: Joi.string()
    .email()
    .required(),
  password: Joi.string()
    .min(6)
    .required()
};
exports.loginRequestValidationMiddleware = (request, response, next) => {
  Joi.validate(
    request.body,
    loginValidationSchema,
    validationErrorMessageSenderMiddleware_1.getValidationErrorMessageSenderMiddleware(
      request,
      response,
      next
    )
  );
};
exports.getRetreiveUserWithEmailMiddleware = userModel => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const { email } = request.body;
      const user = yield userModel.findOne({ email });
      response.locals.user = user;
      next();
    } catch (err) {
      next(err);
    }
  });
exports.retreiveUserWithEmailMiddleware = exports.getRetreiveUserWithEmailMiddleware(
  User_1.userModel
);
exports.getUserExistsValidationMiddleware = userDoesNotExistMessage => (
  request,
  response,
  next
) => {
  try {
    const { user } = response.locals;
    if (!user) {
      return response.status(responseCodes_1.ResponseCodes.badRequest).send({
        message: userDoesNotExistMessage
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};
const localisedUserDoesNotExistMessage = getLocalisedString_1.getLocalisedString(
  messageCategories_1.MessageCategories.failureMessages,
  failureMessages_1.FailureMessageKeys.loginUnsuccessfulMessage
);
exports.userExistsValidationMiddleware = exports.getUserExistsValidationMiddleware(
  localisedUserDoesNotExistMessage
);
exports.getCompareRequestPasswordToUserHashedPasswordMiddleware = compare => (
  request,
  response,
  next
) =>
  __awaiter(this, void 0, void 0, function*() {
    try {
      const requestPassword = request.body.password;
      const { password } = response.locals.user;
      response.locals.passwordMatchesHash = yield compare(
        requestPassword,
        password
      );
      next();
    } catch (err) {
      next(err);
    }
  });
exports.compareRequestPasswordToUserHashedPasswordMiddleware = exports.getCompareRequestPasswordToUserHashedPasswordMiddleware(
  bcryptjs_1.compare
);
exports.getPasswordsMatchValidationMiddleware = loginUnsuccessfulMessage => (
  request,
  response,
  next
) => {
  try {
    const { passwordMatchesHash } = response.locals;
    if (!passwordMatchesHash) {
      return response.status(responseCodes_1.ResponseCodes.badRequest).send({
        message: loginUnsuccessfulMessage
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};
const localisedLoginUnsuccessfulMessage = getLocalisedString_1.getLocalisedString(
  messageCategories_1.MessageCategories.failureMessages,
  failureMessages_1.FailureMessageKeys.loginUnsuccessfulMessage
);
exports.passwordsMatchValidationMiddleware = exports.getPasswordsMatchValidationMiddleware(
  localisedLoginUnsuccessfulMessage
);
exports.setMinimumUserDataMiddleware = (request, response, next) => {
  try {
    const { user } = response.locals;
    const minimumUserData = {
      _id: user._id,
      userName: user.userName
    };
    response.locals.minimumUserData = minimumUserData;
    next();
  } catch (err) {
    next(err);
  }
};
exports.getSetJsonWebTokenExpiryInfoMiddleware = (expiresIn, unitOfTime) => (
  request,
  response,
  next
) => {
  try {
    response.locals.expiry = {
      expiresIn,
      unitOfTime
    };
    next();
  } catch (err) {
    next(err);
  }
};
const oneMonthInSeconds = 2629746;
const unitOfTime = "seconds";
exports.setJsonWebTokenExpiryInfoMiddleware = exports.getSetJsonWebTokenExpiryInfoMiddleware(
  oneMonthInSeconds,
  unitOfTime
);
exports.getSetJsonWebTokenMiddleware = (signToken, jwtSecret) => (
  request,
  response,
  next
) => {
  try {
    const { minimumUserData, expiry } = response.locals;
    const jwtOptions = { expiresIn: expiry.expiresIn };
    const jsonWebToken = signToken({ minimumUserData }, jwtSecret, jwtOptions);
    response.locals.jsonWebToken = jsonWebToken;
    next();
  } catch (err) {
    next(err);
  }
};
exports.setJsonWebTokenMiddleware = exports.getSetJsonWebTokenMiddleware(
  jwt.sign,
  jwt_secret_1.jwtSecret
);
exports.getLoginSuccessfulMiddleware = loginSuccessMessage => (
  request,
  response,
  next
) => {
  try {
    const { jsonWebToken, expiry } = response.locals;
    return response
      .status(responseCodes_1.ResponseCodes.success)
      .send({ jsonWebToken, message: loginSuccessMessage, expiry });
  } catch (err) {
    next(err);
  }
};
const localisedLoginSuccessMessage = getLocalisedString_1.getLocalisedString(
  messageCategories_1.MessageCategories.successMessages,
  successMessages_1.SuccessMessageKeys.loginSuccessMessage
);
exports.loginSuccessfulMiddleware = exports.getLoginSuccessfulMiddleware(
  localisedLoginSuccessMessage
);
exports.loginMiddlewares = [
  exports.loginRequestValidationMiddleware,
  exports.retreiveUserWithEmailMiddleware,
  exports.userExistsValidationMiddleware,
  exports.compareRequestPasswordToUserHashedPasswordMiddleware,
  exports.passwordsMatchValidationMiddleware,
  exports.setMinimumUserDataMiddleware,
  exports.setJsonWebTokenExpiryInfoMiddleware,
  exports.setJsonWebTokenMiddleware,
  exports.loginSuccessfulMiddleware
];
//# sourceMappingURL=loginMiddlewares.js.map
