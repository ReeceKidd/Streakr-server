import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

export const SALT_ROUNDS = 10


export default class PasswordHelper {

  public static injectDependencies(request: Request, response: Response, next: NextFunction){
    response.locals.hashPassword = bcrypt.hash
    response.locals.comparePassword = bcrypt.compare
    next()
  }

  public static async setHashedPassword(
   request: Request, response: Response, next: NextFunction
  ) {
    const { password } = request.body
    const { hashPassword } = response.locals
    const hashedPassword = await new Promise((resolve, reject) => {
      hashPassword(password, SALT_ROUNDS, (err, hash) => {
        if (err) reject(err);
        resolve(hash);
      });
    });
    response.locals.hashedPassword = hashedPassword
    next()
  }

  // public static comparePasswordToHashedPassword(password: string, dbHash: string, comparePassword= bcrypt.compare, ) {
  //   console.log(password, dbHash)
  //   return new Promise((resolve, reject) => {
  //     comparePassword(password, dbHash, (err, match) => {
  //       if (match) {
  //         resolve(match)
  //       } else {
  //         reject(err)
  //       }
  //     });
  //   })
  // }
}
