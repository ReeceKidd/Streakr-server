import {User } from "../../Models/User";
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
    try {
      const { newUser } = response.locals;
      const user = await newUser.save();
      console.log(user)
      response.locals.user = user
      next()
    } catch (err) {
      return response.send(err)
    }
  }

  public static doesUserEmailExist(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { email } = request.body;
    const { userModel } = response.locals;
    userModel.findOne(
      { email: email },
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
    const { userModel } = response.locals.userModel;

    userModel.findOne({ userName: userName }, (err, user) => {
      if (err) response.send(err);
      if (!user) response.locals.userNameExsits = false;
      response.locals.userNameExsits = true;
    });
  }

  public static deleteUser(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { _id, userModel } = response.locals;
    userModel.remove({ _id }, err => {
      if (err) return response.send(err);
      response.locals.userDeleted = true;
    });
  }

  public static updateUser(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { _id, updateObject, userModel } = response.locals;
    userModel.findOneAndUpdate(
      { _id },
      updateObject,
      { new: true },
      (err, user) => {
        if (err) return response.send(err);
        response.locals.updatedUser = user;
      }
    );
  }
}
