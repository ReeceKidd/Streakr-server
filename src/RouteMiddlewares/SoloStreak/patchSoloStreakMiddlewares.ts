import * as Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';

const soloStreakBodyValidationSchema = {
    userId: Joi.string(),
    name: Joi.string(),
    description: Joi.string(),
    completedToday: Joi.boolean()
}

export const soloStreakRequestBodyValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.body, soloStreakBodyValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
}

export const getPatchSoloStreakMiddleware = (soloStreakModel) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const keysToUpdate = request.body
        const updatedSoloStreak = await soloStreakModel.findByIdAndUpdate(soloStreakId, { ...keysToUpdate }, { new: true })
        response.locals.updatedSoloStreak = updatedSoloStreak
        next()
    } catch (err) {
        next(err)
    }
}

export const getSoloStreakDoesNotExistErrorMessageMiddleware = (badRequestReponseCode: number, localisedSoloStreakDoesNotExistErrorMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { updatedSoloStreak } = response.locals
        if (!updatedSoloStreak) {
            return response.status(badRequestReponseCode).send({ message: localisedSoloStreakDoesNotExistErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedSoloStreakDoesNotExistErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.soloStreakDoesNotExist)

export const soloStreakDoesNotExistErrorMessageMiddleware = getSoloStreakDoesNotExistErrorMessageMiddleware(ResponseCodes.badRequest, localisedSoloStreakDoesNotExistErrorMessage)

export const getSendUpdatedSoloStreakMiddleware = (updatedResourceResponseCode: number) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { updatedSoloStreak } = response.locals
        return response.status(updatedResourceResponseCode).send({ data: updatedSoloStreak })
    } catch (err) {
        next(err)
    }
}

export const sendUpdatedSoloStreakMiddleware = getSendUpdatedSoloStreakMiddleware(ResponseCodes.success)

export const patchSoloStreakMiddleware = getPatchSoloStreakMiddleware(soloStreakModel)

export const patchSoloStreakMiddlewares = [
    soloStreakRequestBodyValidationMiddleware,
    patchSoloStreakMiddleware,
    soloStreakDoesNotExistErrorMessageMiddleware,
    sendUpdatedSoloStreakMiddleware
]

