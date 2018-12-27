import { Request, Response, NextFunction } from "express";

const getDoesUserNameExistMiddleware = (UserModel) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userName } = request.body;
    const user = await UserModel.findOne({ userName });
    if (user)  {
        response.locals.userNameExists = true
    };
    next();
  } catch (err) {
    next(err);
  }
};

export { getDoesUserNameExistMiddleware  };