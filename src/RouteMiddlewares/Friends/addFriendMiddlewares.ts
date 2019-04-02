import { Request, Response, NextFunction } from "express";
import * as Joi from 'joi'

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";

const addFriendValidationSchema = {
    userId: Joi.string().required(),
    friendId: Joi.string().required()
}

export const addFriendValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.body, addFriendValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
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