import * as bcrypt from "bcryptjs";
import { Request, Response, NextFunction } from "express";

export const SALT_ROUNDS = 10;

export class PasswordHelper {
  public static injectDependencies(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    response.locals.hash = bcrypt.hash;
    response.locals.SALT = SALT_ROUNDS
    response.locals.comparePassword = bcrypt.compare;
    next();
  }

  public static async setHashedPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { hash, SALT } = response.locals
    const { password } = request.body
    response.locals.hashedPassword = await hash(password, SALT)
    next()
  }

}


