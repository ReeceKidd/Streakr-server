import { default as User } from "../../Models/User";
import { Request, Response, NextFunction } from "express";

export class UserDatabaseHelper {
  public static injectDependencies(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    response.locals.userModel = User;
    next();
  }

  public static async saveUserToDatabase(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
      const { newUser } = response.locals;
      try {
        const user = await newUser.save();
        return response.send(user)
      } catch(err){
        next(err)
      }
      // response.locals.user = user;
      // next();
  }

  public static doesUserEmailExist(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { email } = request.body;
    const { userModel } = response.locals;
    userModel.findOne(
      { email },
      UserDatabaseHelper.doesEmailExist(response, next)
    );
  }

  public static doesEmailExist = (response, next) => (err, email) => {
    if (err) return response.send(err);
    if (email) response.locals.emailExists = true;
    next();
  };

  public static doesUserNameExist(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { userName } = request.body;
    const { userModel } = response.locals;

    userModel.findOne(
      { userName: userName },
      UserDatabaseHelper.doesUserNameExistCallBack(response, next)
    );
  }

  public static doesUserNameExistCallBack = (response, next) => (
    err,
    userName
  ) => {
    if (err) return response.send(err);
    if (userName) response.locals.userNameExists = true;
    next();
  };
  
}
