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
    const { minimumUserData } = response.locals as LoginResponseLocals
    const jsonWebToken: string = signToken({ minimumUserData }, jwtSecret, jwtOptions);
    (response.locals as LoginResponseLocals).jsonWebToken = jsonWebToken;
    next();
  } catch (err) {
    next(err);
  }
};

export const setJsonWebTokenMiddleware = getSignJsonWebTokenMiddleware(jwt.sign, jwtSecret, { expiresIn: '7d' });
