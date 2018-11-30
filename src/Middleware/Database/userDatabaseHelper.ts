import UserModel from "../../Models/User"
import { Request, Response, NextFunction } from "express"

export class UserDatabaseHelper {

  public static injectDependencies(request: Request, response: Response, next: NextFunction){
    response.locals.userModel = UserModel
  }

  public static saveUserToDatabase(request: Request, response: Response, next: NextFunction) {
    const { newUser } = response.locals
      newUser.save((err, user) => {
       response.send(err)
        response.locals.user = user
        next()
      });
  }


  public static doesUserEmailExist(request: Request, response: Response, next: NextFunction) {
    const {email } = request.body
    const { userModel } = response.locals
      userModel.findOne({email: email}, (err, user) => {
        if (err) response.send(err)
        if (!user) response.locals.emailExists = false// Make this a function
        response.locals.emailExists = true
        next()
      });
  }

  
  public static doesUserNameExist(request: Request, response: Response, next: NextFunction) {
    const {userName} = request.body
    const {userModel} = response.locals.userModel

      userModel.findOne({userName: userName}, (err, user) => {
        if (err) response.send(err)
        if (!user) response.locals.userNameExsits = false
        response.locals.userNameExsits = true
    });
  }

  public static deleteUser(request: Request, response: Response, next: NextFunction) {
    const { _id, userModel } = response.locals
      userModel.remove({ _id }, err => {
        if (err) return response.send(err);
        response.locals.userDeleted = true
      });
  }

  public static updateUser(
   request: Request, 
   response: Response, 
   next: NextFunction
  ) {
    const {_id, updateObject, userModel } = response.locals
      userModel.findOneAndUpdate(
        { _id },
        updateObject,
        { new: true },
        (err, user) => {
          if(err) return response.send(err)
          response.locals.updatedUser = user
        }
      );
  }
}
