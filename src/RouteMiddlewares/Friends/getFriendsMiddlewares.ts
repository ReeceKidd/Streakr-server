import { Request, Response, NextFunction } from "express";
import * as Joi from 'joi'

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel } from "../../Models/User";
import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { FailureMessageKeys } from "../../Messages/failureMessages";

const getFriendsValidationSchema = {
    userId: Joi.string().required()
}

export const getFriendsValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.params, getFriendsValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
}

export const getRetreiveUserMiddleware = userModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { userId } = request.params
        const user = await userModel.findOne({ _id: userId })
        response.locals.user = user
        next()
    } catch (err) {
        next(err)
    }
}

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel)

export const getUserExistsValidationMiddleware = userDoesNotExistMessage => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = response.locals
        if (!user) {
            return response.status(400).send({
                message: userDoesNotExistMessage,
            });
        }
        next();
    } catch (err) {
        next(err);
    }
};

const localisedUserDoesNotExistMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.userDoesNotExistMessage)

export const userExistsValidationMiddleware = getUserExistsValidationMiddleware(localisedUserDoesNotExistMessage)

export const getRetreiveFriendsMiddleware = userModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = response.locals
        const { friends } = user
        response.locals.friends = await Promise.all(friends.map(friendId => {
            return userModel.findOne({ _id: friendId })
        }))
        next()
    } catch (err) {
        next(err)
    }
}

export const retreiveFriendsMiddleware = getRetreiveFriendsMiddleware(userModel)

export const formatFriendsMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { friends } = response.locals
        const formattedFriends = friends.map(friend => {
            return {
                ...friend.toObject(),
                password: undefined
            }
        })
        response.locals.formattedFriends = formattedFriends
        next()
    } catch (err) {
        next(err)
    }
}

export const sendFormattedFriendsMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { formattedFriends } = response.locals
        return response.send(formattedFriends)
    } catch (err) {
        next(err)
    }
}

export const getFriendsMiddlewares = [
    getFriendsValidationMiddleware,
    retreiveUserMiddleware,
    userExistsValidationMiddleware,
    retreiveFriendsMiddleware,
    formatFriendsMiddleware,
    sendFormattedFriendsMiddleware
]