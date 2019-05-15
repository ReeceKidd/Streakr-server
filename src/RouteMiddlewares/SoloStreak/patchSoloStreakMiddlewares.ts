import * as Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel } from '../../Models/SoloStreak';

const soloStreakBodyValidationSchema = {
    userId: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    completedToday: Joi.boolean()
}

export const soloStreakRequestBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        Joi.validate(request.body, soloStreakBodyValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
    } catch (err) {
        next(err)
    }
}

export const getPatchSoloStreakMiddleware = (soloStreakModel) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const keysToUpdate = request.body
        const updatedSoloStreak = await soloStreakModel.updateOne({ _id: soloStreakId }, { ...keysToUpdate }).lean()
        response.locals.updatedSoloStreak = updatedSoloStreak
        next()
    } catch (err) {
        next(err)
    }
}

export const sendUpdatedPatchMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        return response.send('Hooray')
    } catch (err) {
        next(err)
    }
}

export const patchSoloStreakMiddleware = getPatchSoloStreakMiddleware(soloStreakModel)

export const patchSoloStreakMiddlewares = [
    soloStreakRequestBodyValidationMiddleware,
    patchSoloStreakMiddleware,
    sendUpdatedPatchMiddleware
]

