import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

export const minimumSeachQueryLength = 1
export const maximumSearchQueryLength = 64

const getUsersValidationSchema = {
    searchQuery: Joi.string()
        .min(minimumSeachQueryLength)
        .max(maximumSearchQueryLength)
        .required()
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