import * as Joi from 'joi'
import { Request, Response, NextFunction } from 'express'

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';

const soloStreakParamsValidationSchema = {
    soloStreakId: Joi.string().required()
}

export const soloStreakParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.params, soloStreakParamsValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
}

export const getDeleteSoloStreakMiddleware = (soloStreakModel) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const deletedSoloStreak = await soloStreakModel.findByIdAndDelete(soloStreakId)
        response.locals.deletedSoloStreak = deletedSoloStreak
        next()
    } catch (err) {
        next(err)
    }
}

export const deleteSoloStreakMiddleware = getDeleteSoloStreakMiddleware(soloStreakModel)


export const getSoloStreakNotFoundMiddleware = (badRequestResponseCode, localisedSoloStreakDoesNotExistErrorMessage) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { deletedSoloStreak } = response.locals
        if (!deletedSoloStreak) {
            return response.status(badRequestResponseCode).send({ message: localisedSoloStreakDoesNotExistErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedSoloStreakDoesNotExistErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.soloStreakDoesNotExist)

export const soloStreakNotFoundMiddleware = getSoloStreakNotFoundMiddleware(ResponseCodes.badRequest, localisedSoloStreakDoesNotExistErrorMessage)

export const getSendSoloStreakDeletedResponseMiddleware = (successfulDeletetionResponseCode) => (request: Request, response: Response, next: NextFunction) => {
    try {
        return response.status(successfulDeletetionResponseCode).send()
    } catch (err) {
        next(err)
    }
}

export const sendSoloStreakDeletedResponseMiddleware = getSendSoloStreakDeletedResponseMiddleware(ResponseCodes.deleted)

export const deleteSoloStreakMiddlewares = [
    soloStreakParamsValidationMiddleware,
    deleteSoloStreakMiddleware,
    soloStreakNotFoundMiddleware,
    sendSoloStreakDeletedResponseMiddleware
]