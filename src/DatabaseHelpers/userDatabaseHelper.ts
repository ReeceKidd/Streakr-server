import { Document } from "mongoose";
import UserModel from "../Models/User";

const DELETE_USER_MESSAGE = '"Successfully deleted user" ';

export class UserDatabaseHelper {
  public static saveUserToDatabase(newUser: Document) {
    return new Promise((resolve, reject) => {
      newUser.save(async (err, user) => {
        if (err) reject(err);
        resolve(user);
      });
    });
  }


  public static doesUserEmailExist(email: string): Promise<boolean>{
    return new Promise((resolve, reject) => {
      UserModel.findOne({email: email}, (err, user) => {
        if (err) reject(err);
        if (!user) resolve(false);
        resolve(true);
      });
    });
  }

  
  public static doesUserNameExist(userName: string): Promise<boolean>{
    return new Promise((resolve, reject) => {
      UserModel.findOne({userName: userName}, (err, user) => {
        if (err) reject(err);
        if (!user) resolve(false);
        resolve(true);
      });
    });
  }

  public static deleteUser(_id: string): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      UserModel.remove({ _id }, err => {
        if (err) reject(err);
        resolve({ message: DELETE_USER_MESSAGE });
      });
    });
  }

  public static updateUser(
    _id: string,
    updateObject: object
  ): Promise<Document> {
    return new Promise((resolve, reject) => {
      UserModel.findOneAndUpdate(
        { _id },
        updateObject,
        { new: true },
        (err, user) => {
          reject(err);
          resolve(user);
        }
      );
    });
  }
}
