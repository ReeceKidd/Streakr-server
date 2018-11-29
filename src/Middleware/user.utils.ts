import { Request, Response, NextFunction } from "express";
import {default as User } from "../Models/User";

export class UserUtils {

    public static createUserFromRequest(request: Request, response: Response, next:NextFunction){
        const { userName, email} = request.body
        const { hashedPassword } = response.locals
        response.locals.user = new User({userName, email, hashedPassword})
        next();
      }

}