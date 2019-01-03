import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"
import { jwtSecret} from "../../../secret/jwt-secret"

export const getVerifyJsonWebTokenMiddleware = (verify: Function, jsonWebTokenSecret: string) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { token } = response.locals
    verify(token, jsonWebTokenSecret, (err, decodedToken) => {
        if(err) next(err)
        response.locals.decodedToken = decodedToken
        next()
    });
  } catch (err) {
    next(err)
  }
};

export const verifyJsonWebTokenMiddleware = getVerifyJsonWebTokenMiddleware(jwt.verify, jwtSecret)
