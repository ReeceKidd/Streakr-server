import { Request, Response, NextFunction } from "express";
import { UserModel } from "../../Models/User";

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

const doesUserNameExistMiddleware = getDoesUserNameExistMiddleware(UserModel)

export { getDoesUserNameExistMiddleware, doesUserNameExistMiddleware };