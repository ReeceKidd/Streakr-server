import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { MessageCategories } from '../../Messages/messageCategories';


const getSoloStreakParamsValidationSchema = {
    soloStreakId: Joi.string().required()
}

export const getSoloStreakParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.params, getSoloStreakParamsValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
}

export const getRetreiveSoloStreakMiddleware = soloStreakModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        response.locals.soloStreak = await soloStreakModel.findOne({ _id: soloStreakId }).lean()
        next()
    } catch (err) {
        next(err)
    }
}

export const retreiveSoloStreakMiddleware = getRetreiveSoloStreakMiddleware(soloStreakModel)

export const getSendSoloStreakDoesNotExistErrorMessageMiddleware = (doesNotExistErrorResponseCode: number, localisedSoloStreakDoesNotExistErrorMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreak } = response.locals
        if (!soloStreak) {
            return response.status(doesNotExistErrorResponseCode).send({ message: localisedSoloStreakDoesNotExistErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedSoloStreakDoesNotExistErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.soloStreakDoesNotExist)

export const sendSoloStreakDoesNotExistErrorMessageMiddleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(ResponseCodes.badRequest, localisedSoloStreakDoesNotExistErrorMessage)

export const getSendSoloStreakMiddleware = (resourceCreatedResponseCode: number) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreak } = response.locals
        return response.status(resourceCreatedResponseCode).send({ ...soloStreak })
    } catch (err) {
        next(err)
    }
}

export const sendSoloStreakMiddleware = getSendSoloStreakMiddleware(ResponseCodes.success)

export const getSoloStreakMiddlewares = [
    getSoloStreakParamsValidationMiddleware,
    retreiveSoloStreakMiddleware,
    sendSoloStreakDoesNotExistErrorMessageMiddleware,
    sendSoloStreakMiddleware
]