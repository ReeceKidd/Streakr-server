import { Request, Response, NextFunction } from "express";

const saveUserToDatabase = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { newUser } = response.locals;
    const user = await newUser.save();
    return response.send(user);
  } catch (err) {
    next(err);
  }
};

export { saveUserToDatabase }
