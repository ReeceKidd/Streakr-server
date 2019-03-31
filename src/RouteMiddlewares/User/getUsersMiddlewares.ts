import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

const getUsersValidationSchema = {
    searchQuery: Joi.string().min(1).max(64).required()
}

export const getUsersValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, getUsersValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
}

export const getUsersByUsernameRegexSearchMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const formatUsersMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const sendUsersMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const getUsersMiddlewares = [
    getUsersValidationMiddleware,
    getUsersByUsernameRegexSearchMiddleware,
    formatUsersMiddleware,
    sendUsersMiddleware
]