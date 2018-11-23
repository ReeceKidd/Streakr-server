import { Request, Response } from "express";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";
import { ErrorMessageHelper } from "../Utils/errorMessage.helper";

const emailKey = 'email'
const userNameKey = 'userName'

export class UserValidationMiddleware {
 
  public static injectDependencies(request: Request, response: Response, next: Function){
    response.locals.doesUserEmailExist = UserDatabaseHelper.doesUserEmailExist
    response.locals.doesUserNameExist = UserDatabaseHelper.doesUserNameExist
    next();
  }
  
  public static async setEmailExists(request: Request, response: Response, next: Function){
    const { email, doesUserEmailExist } = response.locals;
    response.locals.emailExists = await doesUserEmailExist(email)
    next()
  }

  public static async setUserNameExists(request: Request, response: Response, next: Function){
    const { userName, doesUserNameExist } = response.locals;
    response.locals.userNameExists = await doesUserNameExist(
      userName
    );
    next()
  }

  public static emailExistsValidation(request: Request, response: Response, next: Function){
    const { emailAlreadyExists, email } = response.locals;
    if (emailAlreadyExists) {
      return response.status(400).send({ message: ErrorMessageHelper.generateAlreadyExistsMessage(emailKey, email) });
    }
    next()
  }

  public static userNameExistsValidation(request: Request, response: Response, next: Function){
    const { userNameAlreadyExists, userName } = response.locals;
    if (userNameAlreadyExists) {
      return response.status(400).send({ message: ErrorMessageHelper.generateAlreadyExistsMessage(userNameKey, userName) });
    } else next();
  }

 
}

