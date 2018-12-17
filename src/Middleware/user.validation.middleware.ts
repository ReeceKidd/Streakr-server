import { Request, Response } from "express";
import { ErrorMessageHelper } from "../Utils/errorMessage.helper";

const emailKey = "email";
const userNameKey = "userName";

export class UserValidationMiddleware {


  public static emailExistsValidation(
    request: Request,
    response: Response,
    next: Function
  ) {
    const { emailExists } = response.locals;
    const { email } = request.body.email;
    if (emailExists) {
      return response.status(400).send({
        message: ErrorMessageHelper.generateAlreadyExistsMessage(
          emailKey,
          email
        )
      });
    }
    next();
  }

  public static userNameExistsValidation(
    request: Request,
    response: Response,
    next: Function
  ) {
    const { userNameExists } = response.locals;
    const { userName } = request.body;
    if (userNameExists) {
      return response.status(400).send({
        message: ErrorMessageHelper.generateAlreadyExistsMessage(
          userNameKey,
          userName
        )
      });
    } else next();
  }
}
