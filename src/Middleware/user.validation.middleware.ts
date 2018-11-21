import { Request, Response } from "express";
import { UserDatabaseHelper } from "../DatabaseHelpers/userDatabaseHelper";
import { ErrorMessageHelper } from "../Utils/errorMessage.helper";

const emailKey = 'email'
const userNameKey = 'userName'

export class UserValidationMiddleware {
 
  public static injectDependencies(request: Request, response: Response, next: Function){
    request.body.doesUserEmailExist = UserDatabaseHelper.doesUserEmailExist
    request.body.doesUserNameExist = UserDatabaseHelper.doesUserNameExist
    next();
  }
  
  public static async setEmailExists(request: Request, response: Response, next: Function){
    const { email, doesUserEmailExist } = request.body;
    request.body.emailExists = await doesUserEmailExist(email)
    next()
  }

  public static async setUserNameExists(request: Request, response: Response, next: Function){
    const { userName, doesUserNameExist } = request.body;
    request.body.userNameExists = await doesUserNameExist(
      userName
    );
    next()
  }

  public static emailExistsValidation(request: Request, response: Response, next: Function){
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

