import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel } from '../../Models/SoloStreak';


const getSoloStreakParamsValidationSchema = {
    soloStreakId: Joi.string().required()
}

export const getSoloStreakParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.params, getSoloStreakParamsValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
}

export const getRetreiveSoloStreakMiddleware = soloStreakModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        response.locals.soloStreak = await soloStreakModel.findOne({ _id: soloStreakId })
        next()
    } catch (err) {
        next(err)
    }
}


export const retreiveSoloStreakMiddleware = getRetreiveSoloStreakMiddleware(soloStreakModel)

export const sendSoloStreakMiddleware = (request: Request, response: Response, next: NextFunction) => {

}

export const getSoloStreakMiddlewares = [
    getSoloStreakParamsValidationMiddleware,
    retreiveSoloStreakMiddleware,
    sendSoloStreakMiddleware
]