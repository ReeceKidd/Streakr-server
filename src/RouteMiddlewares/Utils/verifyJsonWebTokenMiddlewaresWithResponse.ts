import { Request, Response, NextFunction } from "express";
import { verifyJsonWebTokenMiddlewares } from "./verifyJsonWebTokenMiddlewares";

import { SuccessMessageKeys } from "../../Messages/successMessages";
import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { VerifyJsonWebTokenResponseLocals } from "./verifyJsonWebTokenMiddlewares";
import { CustomError, ErrorType } from "../../customError";

export const getJsonWebTokenVerificationSuccessfulMiddleware = (
  jsonWebTokenVerificationSuccessfulMessage: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const {
      decodedJsonWebToken
    } = response.locals as VerifyJsonWebTokenResponseLocals;
    const jsonWebTokenVerificationSuccessfulResponse = {
      decodedJsonWebToken,
      message: jsonWebTokenVerificationSuccessfulMessage,
      auth: true
    };
    return response.send(jsonWebTokenVerificationSuccessfulResponse);
  } catch (err) {
    next(
      new CustomError(
        ErrorType.JsonWebTokenVerificationSuccessfulMiddleware,
        err
      )
    );
  }
};

const localisedJsonWebTokenVerificationSuccessMessage = getLocalisedString(
  MessageCategories.successMessages,
  SuccessMessageKeys.jsonWebTokenVerificationSuccessfulMessage
);

export const jsonWebTokenVerificationSuccessfulMiddleware = getJsonWebTokenVerificationSuccessfulMiddleware(
  localisedJsonWebTokenVerificationSuccessMessage
);

export const verifyJsonWebTokenMiddlewaresWithResponse = [
  ...verifyJsonWebTokenMiddlewares,
  jsonWebTokenVerificationSuccessfulMiddleware
];
