import { Request, Response, NextFunction } from "express";
import { User } from "../../Models/User";

const doesUserEmailExist = (findUser) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { email } = request.body;
    const user = await User.findOne({email})
    console.log('Made it')
    if (user)  {
        response.locals.emailExists = true
    };
    next();
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export { doesUserEmailExist };
