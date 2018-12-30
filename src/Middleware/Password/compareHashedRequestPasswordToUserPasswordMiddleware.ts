import { Request, Response, NextFunction } from "express";
import {compare } from 'bcryptjs'

const getCompareHashedRequestPasswordToUserPasswordMiddleware = (compare ) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { hashedPassword } = response.locals;
    const { password } = response.locals.user
    response.locals.passwordMatch = await compare(hashedPassword, password)
    next();
  } catch(err){
    next(err)
  }
};

const compareHashedRequestPasswordToUserPasswordMiddleware = getCompareHashedRequestPasswordToUserPasswordMiddleware(compare)

export { getCompareHashedRequestPasswordToUserPasswordMiddleware, compareHashedRequestPasswordToUserPasswordMiddleware };