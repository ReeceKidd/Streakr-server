import { Request, Response, NextFunction } from "express";
import {default as User } from "../Models/User";

export class UserUtils {

    public static async createUserFromRequest(request: Request, response: Response, next:NextFunction){
        const { hashedPassword } = response.locals
        const { userName, email, password} = request.body
        response.locals.newUser = new User({userName, email, password: hashedPassword})
        next();
      }

}

