import { Request, Response, NextFunction } from "express";
import * as Joi from 'joi'
import { getValidationErrorMessageSenderMiddleware } from "../../SharedMiddleware/validationErrorMessageSenderMiddleware";
import { soloStreakModel } from "../../Models/SoloStreak";

const getSoloStreaksValidationSchema = {
    userId: Joi.string().required()
}

export const getSoloStreaksValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.params, getSoloStreaksValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
}

export const getFindSoloStreaksMiddleware = soloStreakModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { userId } = request.params
        response.locals.soloStreaks = await soloStreakModel.find({
            userId
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
    findSoloStreaksMiddleware,
    sendSoloStreaksMiddleware
]