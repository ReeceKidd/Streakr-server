import { Request, Response, NextFunction } from "express";

const getDoesUserEmailExistMiddleware = (UserModel) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email } = request.body;
    const user = await UserModel.findOne({email})
    if (user)  {
        response.locals.emailExists = true
    };
    next();
  } catch (err) {
    next(err);
  }
};

export { getDoesUserEmailExistMiddleware };
