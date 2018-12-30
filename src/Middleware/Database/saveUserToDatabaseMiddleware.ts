import { Request, Response, NextFunction } from "express";

const getSaveUserToDatabaseMiddleware  = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { newUser } = response.locals;
    response.locals.savedUser = await newUser.save();
    next()
  } catch (err) {
    next(err);
  }
};

const saveUserToDatabaseMiddleware = getSaveUserToDatabaseMiddleware

export { getSaveUserToDatabaseMiddleware, saveUserToDatabaseMiddleware }
