import { Request, Response, NextFunction } from "express";

const  getEmailExistsValidationMiddleware  = (generateAlreadyExistsMessage, emailKey) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { emailExists } = response.locals;
    const { email } = request.body;
    if (emailExists) {
      return response.status(400).send({
        message: generateAlreadyExistsMessage(
          emailKey,
          email
        )
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

export {  getEmailExistsValidationMiddleware  };
