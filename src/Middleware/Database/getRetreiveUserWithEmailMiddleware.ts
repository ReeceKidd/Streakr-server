import { Request, Response, NextFunction } from "express";

const getRetreiveUserWithEmailMiddleware = UserModel => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email } = request.body;
    const user = await UserModel.findOne({ email });
    response.locals.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

export { getRetreiveUserWithEmailMiddleware };
