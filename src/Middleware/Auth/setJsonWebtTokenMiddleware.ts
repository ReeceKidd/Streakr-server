import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken"
import { jwtSecret} from "../../../secret/jwt-secret"

export const getSetJsonWebtTokenMiddleware = (signFunction: Function, jwtSecret: string) =>  (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { minimumUserData } = response.locals
    const token = jwt.sign({ user: minimumUserData }, jwtSecret);
    response.locals.token = token
    next()
  } catch (err) {
    next(err);
  }
};

export const setJwtTokenMiddleware = getSetJsonWebtTokenMiddleware(jwt.sign, jwtSecret)
