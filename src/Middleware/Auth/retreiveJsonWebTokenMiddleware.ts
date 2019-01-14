import { Request, Response, NextFunction } from 'express';

export const jsonWebTokenHeaderName = 'x-access-token';

export const getRetreiveJsonWebTokenMiddleware = (jsonWebTokenHeaderName: string) => (
  request: Request, response: Response, next: NextFunction) => {
  try {
    const jsonWebToken = request.headers[jsonWebTokenHeaderName];
    response.locals.jsonWebToken = jsonWebToken;
    next();
  } catch (err) {
    next(err);
  }
};

export const retreiveJsonWebTokenMiddleware = getRetreiveJsonWebTokenMiddleware(jsonWebTokenHeaderName);