import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../../Models/User';

export const getRetreiveUserWithEmailMiddleware = userModel => async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const { email } = request.body;
    const user = await userModel.findOne({ email });
    response.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export const retreiveUserWithEmailMiddleware = getRetreiveUserWithEmailMiddleware(UserModel);
