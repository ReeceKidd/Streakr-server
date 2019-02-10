import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { jwtSecret } from '../../../secret/jwt-secret';

export const getDecodeJsonWebTokenMiddleware = (
  verify: Function,
  jsonWebTokenSecret: string,
) => (request: Request, response: Response, next: NextFunction) => {
  try {
    const { jsonWebToken } = response.locals;
    try {
      response.locals.decodedToken = verify(
        jsonWebToken,
        jsonWebTokenSecret,
      );
      next();
    } catch (err) {
      return response.send(err)
    }
  } catch (err) {
    next(err);
  }
};

export const decodeJsonWebTokenMiddleware = getDecodeJsonWebTokenMiddleware(jwt.verify, jwtSecret);
