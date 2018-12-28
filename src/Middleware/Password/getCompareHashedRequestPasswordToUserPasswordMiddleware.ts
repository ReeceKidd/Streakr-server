import { Request, Response, NextFunction } from "express";

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

export { getCompareHashedRequestPasswordToUserPasswordMiddleware };