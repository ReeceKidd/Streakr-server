import { Request, Response, NextFunction } from 'express';
import { SupportedHeaders } from '../../Server/headers';
import { LoginResponseLocals } from '../../Routes/Auth/login';
import { VerifyJsonWebTokenResponseLocals } from 'Utils/verifyUsersJsonWebToken';


export const getRetreiveJsonWebTokenMiddleware = (jsonWebTokenHeader: string) => (
  request: Request, response: Response, next: NextFunction) => {
  try {
    (response.locals as LoginResponseLocals | VerifyJsonWebTokenResponseLocals).jsonWebToken = request.headers[jsonWebTokenHeader].toString()
    next();
  } catch (err) {
    next(err);
  }
};

export const retreiveJsonWebTokenMiddleware = getRetreiveJsonWebTokenMiddleware(SupportedHeaders.xAccessToken);
