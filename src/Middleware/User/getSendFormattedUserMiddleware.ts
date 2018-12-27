import { Request, Response, NextFunction } from "express";

const getSendFormattedUserMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { savedUser } = response.locals;
    savedUser.password = undefined
    return response.send(savedUser);
  } catch (err) {
    next(err);
  }
};

export { getSendFormattedUserMiddleware };
