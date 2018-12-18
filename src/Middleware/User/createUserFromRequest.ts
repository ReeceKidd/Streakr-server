import { Request, Response, NextFunction } from "express";

const createUserFromRequest = (User) => (request: Request, response: Response, next: NextFunction) => {
    const { hashedPassword } = response.locals
    const { userName, email } = request.body
    response.locals.newUser = new User({userName, email, password: hashedPassword})
    next();
}

export { createUserFromRequest }
