import { Request, Response } from "express";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";
import { ErrorMessageHelper } from "../Utils/errorMessage.helper";

const emailKey = 'email'
const userNameKey = 'userName'

export class UserValidationMiddleware {
 
  public static doesUserEmailExist(request: Request, response: Response, next: Function){
    const { email } = request.body;
    request.body.emailAlreadyExists = UserDatabaseHelper.doesUserEmailExist(
      email
    );
    next()
  }

  public static async doesUserNameExist(request: Request, response: Response, next: Function){
    const { userName } = request.body;
    request.body.userNameAlreadyExists = await UserDatabaseHelper.doesUserNameExist(
      userName
    );
    next()
  }

  public static userEmailExistsValidation(request: Request, response: Response, next: Function){
    const { emailAlreadyExists, email } = request.body;
    if (emailAlreadyExists) {
      return response.status(400).send({ message: ErrorMessageHelper.generateAlreadyExistsMessage(emailKey, email) });
    }
    next()
  }

  public static userNameExistsValidation(request: Request, response: Response, next: Function){
    const { userNameAlreadyExists, userName } = request.body;
    if (userNameAlreadyExists) {
      return response.status(400).send({ message: ErrorMessageHelper.generateAlreadyExistsMessage(userNameKey, userName) });
    } else next();
  }

 
}

