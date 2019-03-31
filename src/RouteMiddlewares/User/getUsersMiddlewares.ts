import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { userModel } from '../../Models/User';
import { networkInterfaces } from 'os';

export const minimumSeachQueryLength = 1
export const maximumSearchQueryLength = 64

const getUsersValidationSchema = {
    searchQuery: Joi.string()
        .min(minimumSeachQueryLength)
        .max(maximumSearchQueryLength)
        .required()
}

export const retreiveUsersValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, getUsersValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
}

export const getRetreiveUsersByUsernameRegexSearchMiddleware = userModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { searchQuery } = request.body
        response.locals.users = await userModel.find({ userName: { $regex: searchQuery } })
        next()
    } catch (err) {
        next(err)
    }
}

export const retreiveUsersByUsernameRegexSearchMiddleware = getRetreiveUsersByUsernameRegexSearchMiddleware(userModel)

export const formatUsersMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { users } = response.locals
        response.locals.formattedUsers = users.map(user => {
            return {
                ...user,
                password: undefined
            }
        })
        next()
    } catch (err) {
        next(err)
    }
}

export const sendUsersMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const getUsersMiddlewares = [
    retreiveUsersValidationMiddleware,
    retreiveUsersByUsernameRegexSearchMiddleware,
    formatUsersMiddleware,
    sendUsersMiddleware
]