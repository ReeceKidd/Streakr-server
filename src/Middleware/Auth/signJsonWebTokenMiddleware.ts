import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../../../secret/jwt-secret';
import { LoginResponseLocals } from '../../Routes/Auth/login';

export const getSignJsonWebTokenMiddleware = (signToken: Function, jwtSecret: string, jwtOptions: object) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const locals: LoginResponseLocals = response.locals
    const { minimumUserData } = locals
    const jsonWebToken = signToken({ minimumUserData }, jwtSecret, jwtOptions);
    locals.jsonWebToken = jsonWebToken;
    next();
  } catch (err) {
    next(err);
  }
};

export const setJsonWebTokenMiddleware = getSignJsonWebTokenMiddleware(jwt.sign, jwtSecret, { expiresIn: '7d' });
