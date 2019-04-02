import { Request, Response, NextFunction } from "express";

export const addFriendValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const retreiveUserMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const userExistsValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const addFriendMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const sendSuccessMessageMiddleware = (request: Request, response: Response, next: NextFunction) => {

}


export const addFriendMiddlewares = [
    addFriendValidationMiddleware,
    retreiveUserMiddleware,
    userExistsValidationMiddleware,
    addFriendMiddleware,
    sendSuccessMessageMiddleware
]