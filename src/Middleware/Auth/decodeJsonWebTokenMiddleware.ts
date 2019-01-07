import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../../../secret/jwt-secret";
import { getDecodedTokenCallback } from "./getDecodedTokenCallback"


export const getDecodeJsonWebTokenMiddleware = (
  verify: Function,
  jsonWebTokenSecret: string,
  getDecodedTokenCallback: Function
) => async (request: Request, response: Response, next: NextFunction) => {
  try {
    const { jsonWebToken } = response.locals;
    const decodedToken = await verify(
      jsonWebToken,
      jsonWebTokenSecret,
      getDecodedTokenCallback
    );
    response.locals.decodedToken = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
};

export const decodeJsonWebTokenMiddleware = getDecodeJsonWebTokenMiddleware(
  jwt.verify,
  jwtSecret,
 getDecodedTokenCallback
);
