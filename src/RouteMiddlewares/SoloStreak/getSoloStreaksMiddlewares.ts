import { Request, Response, NextFunction } from "express";
import * as Joi from 'joi'
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { userModel, IUser } from "../../Models/User";
import { soloStreakModel } from "../../Models/SoloStreak";

import { getLocalisedString } from "../../Messages/getLocalisedString";
import { MessageCategories } from "../../Messages/messageCategories";
import { FailureMessageKeys } from "../../Messages/failureMessages";

const getSoloStreaksValidationSchema = {
    userId: Joi.string().required()
}

export const getSoloStreaksValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.params, getSoloStreaksValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
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

export const getFindSoloStreaksMiddleware = soloStreakModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = response.locals
        response.locals.soloStreaks = await soloStreakModel.find({
            userId: user._id
        })
        next()
    } catch (err) {
        next(err)
    }
}

export const findSoloStreaksMiddleware = getFindSoloStreaksMiddleware(soloStreakModel)

export const sendSoloStreaksMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreaks } = response.locals
        response.send({ soloStreaks })
    } catch (err) {
        next(err)
    }
}

export const getSoloStreaksMiddlewares = [
    getSoloStreaksValidationMiddleware,
    retreiveUserMiddleware,
    userExistsValidationMiddleware,
    findSoloStreaksMiddleware,
    sendSoloStreaksMiddleware
]