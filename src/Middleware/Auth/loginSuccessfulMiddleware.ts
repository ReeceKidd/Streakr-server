import { Request, Response, NextFunction } from "express";
import {loginSuccessMessage } from "../../Messages/success.messages"

const getLoginSuccessfulMiddleware = (loginSuccessMessage: string) =>  (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const {token} = response.locals
    return response.send({message: loginSuccessMessage, token});
  } catch (err) {
    next(err);
  }
};

export { getLoginSuccessfulMiddleware };

export const loginSuccessfulMiddleware = getLoginSuccessfulMiddleware(loginSuccessMessage)
