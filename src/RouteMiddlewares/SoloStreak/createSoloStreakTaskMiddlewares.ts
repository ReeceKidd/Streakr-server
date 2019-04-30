import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'
import * as moment from 'moment-timezone'

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { SupportedRequestHeaders } from '../../Server/headers';
import { ResponseCodes } from '../../Server/responseCodes';

const soloStreakTaskValidationSchema = {
    soloStreakId: Joi.string().required(),
};

export const soloStreakTaskCompletedParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.params, soloStreakTaskValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};

export const retreiveTimeZoneHeaderMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        response.locals.timeZone = request.header(SupportedRequestHeaders.xTimeZone)
        next()
    } catch (err) {
        next(err)
    }
}

export const getSendMissingTimeZoneErrorResponseMiddleware = localisedErrorMessage => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timeZone } = response.locals
        if (!timeZone) {
            return response.status(ResponseCodes.unprocessableEntity).send({ message: localisedErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedMissingTimeZoneHeaderMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.missingTimeZoneHeaderMessage)

export const sendMissingTimeZoneErrorResponseMiddleware = getSendMissingTimeZoneErrorResponseMiddleware(localisedMissingTimeZoneHeaderMessage)

export const getValidateTimeZoneMiddleware = isValidTimeZone => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timeZone } = response.locals
        response.locals.validTimeZone = isValidTimeZone(timeZone)
        next()
    } catch (err) {
        next(err)
    }
}

export const validateTimeZoneMiddleware = getValidateTimeZoneMiddleware(moment.tz.zone)

export const getSendInvalidTimeZoneErrorResponseMiddleware = localisedErrorMessage => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { validTimeZone } = response.locals
        if (!validTimeZone) {
            return response.status(ResponseCodes.unprocessableEntity).send({ message: localisedErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedInvalidTimeZoneMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.invalidTimeZoneMessage)

export const sendInvalidTimeZoneErrorResponseMiddleware = getSendInvalidTimeZoneErrorResponseMiddleware(localisedInvalidTimeZoneMessage)

export const createSoloStreakTaskMiddlewares = [
    soloStreakTaskCompletedParamsValidationMiddleware,
    retreiveTimeZoneHeaderMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    validateTimeZoneMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware
]