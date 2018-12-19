import { Request, Response, NextFunction } from "express";

const hashPassword = (hash, salt) => async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { password } = request.body;
    response.locals.hashedPassword = await hash(password, salt);
    next();

  } catch(err){
    next(err)
  }
};

export { hashPassword };
