import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { jwtSecret } from "../../../secret/jwt-secret";
import { SupportedRequestHeaders } from "../../Server/headers";
import { IMinimumUserData } from "../../Models/User";
import { CustomError, ErrorType } from "../../customError";

export interface VerifyJsonWebTokenResponseLocals {
  jsonWebToken?: string;
  decodedJsonWebToken?: DecodedJsonWebToken;
  jsonWebTokenError?: object;
}

export const getRetreiveJsonWebTokenMiddleware = (
  jsonWebTokenHeader: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const requestJsonWebTokenHeader = request.headers[jsonWebTokenHeader];
    if (!requestJsonWebTokenHeader) {
      throw new CustomError(ErrorType.MissingAccessTokenHeader);
    }
    response.locals.jsonWebToken = requestJsonWebTokenHeader;
    next();
  } catch (err) {
    if (err instanceof CustomError) next(err);
    else next(new CustomError(ErrorType.RetreiveJsonWebTokenMiddleware, err));
  }
};

export const retreiveJsonWebTokenMiddleware = getRetreiveJsonWebTokenMiddleware(
  SupportedRequestHeaders.xAccessToken
);

export interface DecodedJsonWebToken {
  minimumUserData: IMinimumUserData;
}

export const getDecodeJsonWebTokenMiddleware = (
  verify: Function,
  jsonWebTokenSecret: string
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const {
      jsonWebToken
    } = response.locals as VerifyJsonWebTokenResponseLocals;
    try {
      const decodedJsonWebToken = verify(jsonWebToken, jsonWebTokenSecret);
      response.locals.minimumUserData = decodedJsonWebToken.minimumUserData;
      next();
    } catch (err) {
      console.log(err);
      next(new CustomError(ErrorType.VerifyJsonWebTokenError, err));
    }
  } catch (err) {
    console.log("Decode error");
    next(new CustomError(ErrorType.DecodeJsonWebTokenMiddleware, err));
  }
};

export const decodeJsonWebTokenMiddleware = getDecodeJsonWebTokenMiddleware(
  jwt.verify,
  jwtSecret
);

export const verifyJsonWebTokenMiddlewares = [
  retreiveJsonWebTokenMiddleware,
  decodeJsonWebTokenMiddleware
];
