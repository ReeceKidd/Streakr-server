import { Request, Response, NextFunction } from 'express';
import { compare } from 'bcryptjs';
import { LoginRequestBody, LoginResponseLocals } from '../../Routes/Auth/login';

export const getCompareRequestPasswordToUserHashedPasswordMiddleware = compare => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const requestPassword = (request.body as LoginRequestBody).password;
    const { password } = (response.locals as LoginResponseLocals).user;
    response.locals.passwordMatchesHash = await compare(requestPassword, password);
    next()
  } catch (err) {
    next(err);
  }
};

export const compareRequestPasswordToUserHashedPasswordMiddleware = getCompareRequestPasswordToUserHashedPasswordMiddleware(compare);
