import { Request, Response, NextFunction } from "express";
import * as Joi from 'joi'

import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel } from "../../Models/User";
import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { FailureMessageKeys } from "../../Messages/failureMessages";

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