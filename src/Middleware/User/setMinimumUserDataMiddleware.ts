import { Request, Response, NextFunction } from 'express';
import { IMinimumUserData } from '../../Models/User';
import { LoginResponseLocals } from '../../Routes/Auth/login';

export const setMinimumUserDataMiddleware = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { user } = response.locals as LoginResponseLocals;
    const minimumUserData: IMinimumUserData = {
      _id: user._id,
      userName: user.userName,
    };
    response.locals.minimumUserData = minimumUserData;
    next();
  } catch (err) {
    next(err);
  }
};
