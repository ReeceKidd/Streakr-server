"use strict";
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
const jwt = __importStar(require("jsonwebtoken"));
const jwt_secret_1 = require("../../../secret/jwt-secret");
const headers_1 = require("../../Server/headers");
const getLocalisedString_1 = require("../../Messages/getLocalisedString");
const messageCategories_1 = require("../../Messages/messageCategories");
const failureMessages_1 = require("../../Messages/failureMessages");
const responseCodes_1 = require("../../Server/responseCodes");
exports.getRetreiveJsonWebTokenMiddleware = jsonWebTokenHeader => (
  request,
  response,
  next
) => {
  try {
    const requestJsonWebTokenHeader = request.headers[jsonWebTokenHeader];
    response.locals.jsonWebToken = requestJsonWebTokenHeader;
    next();
  } catch (err) {
    next(err);
  }
};
exports.retreiveJsonWebTokenMiddleware = exports.getRetreiveJsonWebTokenMiddleware(
  headers_1.SupportedRequestHeaders.xAccessToken
);
exports.getJsonWebTokenDoesNotExistResponseMiddleware = (
  jsonWebTokenValidationErrorObject,
  unauthorizedStatusCode
) => (request, response, next) => {
  try {
    const { jsonWebToken } = response.locals;
    if (!jsonWebToken)
      return response
        .status(unauthorizedStatusCode)
        .send(jsonWebTokenValidationErrorObject);
    next();
  } catch (err) {
    next(err);
  }
};
const localisedMissingJsonWebTokenMessage = getLocalisedString_1.getLocalisedString(
  messageCategories_1.MessageCategories.failureMessages,
  failureMessages_1.FailureMessageKeys.missingJsonWebTokenMessage
);
exports.jsonWebTokenDoesNotExistResponseMiddleware = exports.getJsonWebTokenDoesNotExistResponseMiddleware(
  { auth: false, message: localisedMissingJsonWebTokenMessage },
  responseCodes_1.ResponseCodes.unautohorized
);
exports.getDecodeJsonWebTokenMiddleware = (verify, jsonWebTokenSecret) => (
  request,
  response,
  next
) => {
  try {
    const { jsonWebToken } = response.locals;
    try {
      response.locals.decodedJsonWebToken = verify(
        jsonWebToken,
        jsonWebTokenSecret
      );
      next();
    } catch (err) {
      response.locals.jsonWebTokenError = err;
      next();
    }
  } catch (err) {
    next(err);
  }
};
exports.decodeJsonWebTokenMiddleware = exports.getDecodeJsonWebTokenMiddleware(
  jwt.verify,
  jwt_secret_1.jwtSecret
);
exports.getJsonWebTokenErrorResponseMiddleware = (
  unauthorizedErrorMessage,
  unauthorizedStatusCode
) => (request, response, next) => {
  try {
    const { jsonWebTokenError } = response.locals;
    if (jsonWebTokenError) {
      const jsonWebTokenErrorResponse = {
        message: unauthorizedErrorMessage,
        auth: false
      };
      return response
        .status(unauthorizedStatusCode)
        .send(jsonWebTokenErrorResponse);
    }
    next();
  } catch (err) {
    next(err);
  }
};
const localisedUnauthorizedErrorMessage = getLocalisedString_1.getLocalisedString(
  messageCategories_1.MessageCategories.failureMessages,
  failureMessages_1.FailureMessageKeys.unauthorisedMessage
);
exports.jsonWebTokenErrorResponseMiddleware = exports.getJsonWebTokenErrorResponseMiddleware(
  localisedUnauthorizedErrorMessage,
  responseCodes_1.ResponseCodes.unautohorized
);
exports.setMinimumUserDataOnResponseLocals = (request, response, next) => {
  try {
    response.locals.minimumUserData =
      response.locals.decodedJsonWebToken.minimumUserData;
    next();
  } catch (err) {
    next(err);
  }
};
exports.verifyJsonWebTokenMiddlewares = [
  exports.retreiveJsonWebTokenMiddleware,
  exports.jsonWebTokenDoesNotExistResponseMiddleware,
  exports.decodeJsonWebTokenMiddleware,
  exports.jsonWebTokenErrorResponseMiddleware,
  exports.setMinimumUserDataOnResponseLocals
];
//# sourceMappingURL=verifyJsonWebTokenMiddlewares.js.map
