import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"
import { jwtSecret} from "../../../secret/jwt-secret"

export const getSetJsonWebTokenMiddleware = (signToken: Function, jwtSecret: string, jwtOptions: object) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { minimumUserData } = response.locals
    const jsonWebToken = signToken({ minimumUserData }, jwtSecret, jwtOptions) 
    response.locals.jsonWebToken = jsonWebToken
    next()
  } catch (err) {
    next(err);
  }
};

export const setJsonWebTokenMiddleware = getSetJsonWebTokenMiddleware(jwt.sign, jwtSecret, { expiresIn: "7d"})
