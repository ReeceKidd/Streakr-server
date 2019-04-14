import { Request, Response, NextFunction } from "express";
import * as Joi from 'joi'

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel } from "../../Models/User";
import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { FailureMessageKeys } from "../../Messages/failureMessages";
import { SuccessMessageKeys } from "../../Messages/successMessages";

const addFriendValidationSchema = {
    userId: Joi.string().required(),
    friendId: Joi.string().required()
}

export const addFriendValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.body, addFriendValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
}

export const getRetreiveUserMiddleware = userModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId });
        response.locals.user = user;
        next();
    } catch (err) {
        next(err);
    }
}

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel)

export const getUserExistsValidationMiddleware = userDoesNotExistMessage => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = response.locals;
        if (!user) {
            return response.status(400).send({
                message: userDoesNotExistMessage,
            });
        }
        next();
    } catch (err) {
        next(err);
    }
}

const localisedUserDoesNotExistMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.userDoesNotExistMessage)

export const userExistsValidationMiddleware = getUserExistsValidationMiddleware(localisedUserDoesNotExistMessage)

export const getFriendAlreadyExistsMiddleware = friendAlreadyExistsErrorMessage => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { friendId } = request.body
        const { user } = response.locals
        const { friends } = user
        if (friends.includes(friendId)) {
            return response.status(400).send({
                message: friendAlreadyExistsErrorMessage
            })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedFriendAlreadyExistsMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.friendAlreadyExists)

export const friendAlreadyExistsMiddleware = getFriendAlreadyExistsMiddleware(localisedFriendAlreadyExistsMessage)

export const getAddFriendMiddleware = userModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { userId, friendId } = request.body
        const updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $addToSet: { friends: friendId } })
        response.locals.updatedUser = updatedUser
        next()
    } catch (err) {
        next(err)
    }
}

export const addFriendMiddleware = getAddFriendMiddleware(userModel)

export const getRetreiveFriendsDetailsMiddleware = userModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { updatedUser } = response.locals
        const { friends } = updatedUser
        response.locals.friends = await userModel.find({ _id: { $in: friends } })
        next()
    } catch (err) {
        next(err)
    }
}

export const retreiveFriendsDetailsMiddleware = getRetreiveFriendsDetailsMiddleware(userModel)

export const formatFriendsMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { friends } = response.locals
        response.locals.formattedFriends = friends.map(friend => {
            return {
                userName: friend.userName
            }
        }
        )
        next()
    } catch (err) {
        next(err)
    }
}

export const getSendFriendAddedSuccessMessageMiddleware = addFriendSuccessMessage => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { formattedFriends } = response.locals
        response.send({ message: addFriendSuccessMessage, friends: formattedFriends })
    } catch (err) {
        next(err)
    }
}

const localisedSuccessfullyAddedFriendMessage = getLocalisedString(MessageCategories.successMessages, SuccessMessageKeys.successfullyAddedFriend)

export const sendFriendAddedSuccessMessageMiddleware = getSendFriendAddedSuccessMessageMiddleware(localisedSuccessfullyAddedFriendMessage)

export const addFriendMiddlewares = [
    addFriendValidationMiddleware,
    retreiveUserMiddleware,
    userExistsValidationMiddleware,
    friendAlreadyExistsMiddleware,
    addFriendMiddleware,
    retreiveFriendsDetailsMiddleware,
    formatFriendsMiddleware,
    sendFriendAddedSuccessMessageMiddleware
]