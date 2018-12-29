import { Request, Response, NextFunction } from "express";

const getLoginSuccessfulMiddleware = (loginSuccessMessage: string) =>  (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    return response.send({message: loginSuccessMessage});
  } catch (err) {
    next(err);
  }
};

export { getLoginSuccessfulMiddleware };
