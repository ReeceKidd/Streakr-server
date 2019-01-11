import { Request, Response, NextFunction } from "express";
import { ErrorMessageHelper } from "../../../Utils/errorMessage.helper";
import { emailKey } from "../../../Constants/Keys/keys";

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

const emailExistsValidationMiddleware = getEmailExistsValidationMiddleware(ErrorMessageHelper.generateAlreadyExistsMessage, emailKey)

export {  getEmailExistsValidationMiddleware, emailExistsValidationMiddleware  };
