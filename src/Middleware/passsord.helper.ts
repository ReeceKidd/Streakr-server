import * as bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";

export const SALT_ROUNDS = 10;

export class PasswordHelper {
  public static injectDependencies(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    response.locals.hash = bcrypt.hash;
    response.locals.comparePassword = bcrypt.compare;
    next();
  }

  public static setHashedPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { hash } = response.locals;
    const { password } = request.body;
    console.log(password)
  }
}
