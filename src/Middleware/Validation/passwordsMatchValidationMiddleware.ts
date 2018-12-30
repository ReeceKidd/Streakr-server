import { Request, Response, NextFunction } from "express";
import { loginUnsuccessfulMessage} from "../../Messages/failure.messages"

const getPasswordsMatchValidationMiddleware =(loginUnsuccessfulMessage) => (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const { passwordsMatch } = response.locals;
    if (!passwordsMatch) {
      return response.status(400).send({
        message: loginUnsuccessfulMessage
      });
    }
    next();
  } catch (err) {
    next(err);
  }
};

const passwordsMatchValidationMiddleware = getPasswordsMatchValidationMiddleware(loginUnsuccessfulMessage)

export {  getPasswordsMatchValidationMiddleware, passwordsMatchValidationMiddleware  };
