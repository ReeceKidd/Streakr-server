import { Request, Response, NextFunction } from "express";

const emailKey = "email";

const emailExistsValidation = (generateAlreadyExistsMessage) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { emailExists } = response.locals;
    const { email } = request.body;
    if (emailExists) {
      response.status(400).send({
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

export { emailExistsValidation, emailKey };
