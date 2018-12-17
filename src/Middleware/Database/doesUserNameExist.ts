import { Request, Response, NextFunction } from "express";

const doesUserNameExist = (findUser) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { userName } = request.body;
    const user = await findUser({ userName });
    if (user)  {
        response.locals.userNameExists = true
    };
    next();
  } catch (err) {
    next(err);
  }
};

export { doesUserNameExist };