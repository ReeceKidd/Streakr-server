import { Request, Response, NextFunction } from "express";

const saveUserToDatabase = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { newUser } = response.locals;
    const user = await newUser.save();
    console.log('Passed')
    return response.send(user);
  
  } catch (err) {
    console.log(err)
    next(err);
  }
};

export { saveUserToDatabase }
