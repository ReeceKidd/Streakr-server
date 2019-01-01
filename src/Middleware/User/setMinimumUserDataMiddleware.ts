import { Request, Response, NextFunction } from "express";

export const getSetMinimumUserDataMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { user } = response.locals;
    const minimumUserData = {
        userName: user.userName,
        email: user.email
    }
    response.locals.minimumUserData = minimumUserData
    next()
  } catch (err) {
    next(err);
  }
};

export const setMinimumUserDataMiddleware = getSetMinimumUserDataMiddleware

