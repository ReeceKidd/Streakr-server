import { Request, Response } from "express";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";
import { ErrorMessageHelper } from "../Utils/errorMessage.helper";

const emailKey = "email";
const userNameKey = "userName";

export class UserValidationMiddleware {
  public static injectDependencies(
    request: Request,
    response: Response,
    next: Function
  ) {
    response.locals.doesUserEmailExist = UserDatabaseHelper.doesUserEmailExist;
    response.locals.doesUserNameExist = UserDatabaseHelper.doesUserNameExist;
    next();
  }

  public static async doesEmailExist(
    request: Request,
    response: Response,
    next: Function
  ) {
    const { email } = request.body;
    const { doesUserEmailExist } = response.locals;
    const result = await doesUserEmailExist(email);
    response.locals.emailExists = result;
    next();
  }

  public static async doesUserNameExist(
    request: Request,
    response: Response,
    next: Function
  ) {
    const { userName } = request.body;
    const { doesUserNameExist } = response.locals;
    response.locals.userNameExists = await doesUserNameExist(userName);
    next();
  }

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
