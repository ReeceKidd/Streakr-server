import { Document } from "mongoose";
import UserModel from "../models/User";
import { resolve } from "url";
import { reject } from "bcrypt/promises";
import { Request, Response } from "express";

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

  public static deleteUser(_id: string) {
    return new Promise((resolve, reject) => {
      UserModel.remove({ _id }, err => {
        if (err) reject(err);
        resolve({ message: DELETE_USER_MESSAGE });
      });
    });
  }

  public static async doesUserExist(request: Request, response: Response, next: Function) {
    const { email } = request.body
    const userExists = await new Promise((resolve, reject) => {UserModel.findOne({email}, (err, user) => {
      reject(err);
      resolve(user);
    })
    if(userExists) response.status(400).send({message: `User with email "${email}" already exists`})
    next()
  })}

  public static updateUser(_id: string, updateObject: object) {
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
