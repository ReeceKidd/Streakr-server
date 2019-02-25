import { Request, Response, NextFunction } from 'express';
import { userModel } from '../../Models/User';
import { LoginRequestBody, LoginResponseLocals } from '../../Routes/Auth/login';

export const getRetreiveUserWithEmailMiddleware = userModel => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { email } = request.body as LoginRequestBody;
    const user = await userModel.findOne({ email });
    (response.locals as LoginResponseLocals).user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const retreiveUserWithEmailMiddleware = getRetreiveUserWithEmailMiddleware(userModel);
