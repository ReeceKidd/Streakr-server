import { Request, Response, NextFunction } from "express";

const  getPasswordsMatchValidationMiddleware =(loginErrorMessage) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { passwordsMatch } = response.locals;
    if (!passwordsMatch) {
      return response.status(400).send({
        message: loginErrorMessage
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export {  getPasswordsMatchValidationMiddleware  };
