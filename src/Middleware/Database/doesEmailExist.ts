import { Request, Response, NextFunction } from "express";
import User from "../../Models/User";

const doesUserEmailExist = (findUser = User.findOne) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email } = request.body;
    const user = await findUser({ email });
    if (user)  {
        response.locals.emailExists = true
    };
    next();
  } catch (err) {
    next(err);
  }
};

export { doesUserEmailExist };
