import { default as User } from "../../Models/User";
import { Request, Response, NextFunction } from "express";

export class UserDatabaseHelper {
  public static injectDependencies(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    response.locals.findUser = User.findOne;
    response.locals.setEmailExists = UserDatabaseHelper.setEmailExists
    response.locals.setUserNameExists = UserDatabaseHelper.setUserNameExists
    next();
  }

  public static doesUserEmailExist(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { email } = request.body;
    const { findUser, setEmailExists } = response.locals;
    findUser(
      { email },
      setEmailExists(response, next)
    );
  }

  public static setEmailExists = (response, next) => (err, email) => {
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
    const { findUser, setUserNameExists } = response.locals;

    findUser(
      { userName: userName },
      setUserNameExists(response, next)
    );
  }

  public static setUserNameExists = (response, next) => (
    err,
    userName
  ) => {
    if (err) return response.send(err);
    if (userName) response.locals.userNameExists = true;
    next();
  };

    // public static async saveUserToDatabase(
  //   request: Request,
  //   response: Response,
  //   next: NextFunction
  // ) {
  //     const { newUser } = response.locals;
  //     try {
  //       const user = await newUser.save();
  //       return response.send(user)
  //     } catch(err){
  //       next(err)
  //     }
  //     // response.locals.user = user;
  //     // next();
  // }
  
}
