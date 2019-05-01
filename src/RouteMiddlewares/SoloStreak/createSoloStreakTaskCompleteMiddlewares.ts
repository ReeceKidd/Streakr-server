import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'
import * as moment from 'moment-timezone'

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { SupportedRequestHeaders } from '../../Server/headers';
import { ResponseCodes } from '../../Server/responseCodes';
import { soloStreakModel, ITaskComplete } from '../../Models/SoloStreak';

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

export const getRetreiveSoloStreakMiddleware = soloStreakModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const soloStreak = await soloStreakModel.findOne({ _id: soloStreakId }).lean()
        response.locals.soloStreak = soloStreak
        next()
    } catch (err) {
        next(err)
    }
}

export const getSendSoloStreakDoesNotExistErrorMiddlware = (localisedSoloStreakDoesNotExistErrorMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreak } = response.locals
        if (!soloStreak) {
            return response.status(ResponseCodes.unprocessableEntity).send({ message: localisedSoloStreakDoesNotExistErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedSoloStreakDoesNotExistErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.soloStreakDoesNotExistMessage)

export const sendSoloStreakDoesNotExistErrorMiddleware = getSendSoloStreakDoesNotExistErrorMiddlware(localisedSoloStreakDoesNotExistErrorMessage)

export const retreiveSoloStreakMiddleware = getRetreiveSoloStreakMiddleware(soloStreakModel)

export const getSetCurrentTimeMiddleware = moment => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timeZone } = response.locals
        response.locals.currentTime = moment().tz(timeZone).toDate()
        next()
    } catch (err) {
        next(err)
    }
}

export const setCurrentTimeMiddleware = getSetCurrentTimeMiddleware(moment)

export const hasTaskAlreadyBeenCompletedTodayMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreak, currentTime } = response.locals
        const taskAlreadyCompletedToday = soloStreak.calendar.find(completeTask => {
            console.log(completeTask)
            const completeTaskDay = completeTask.date.getDay()
            console.log(completeTaskDay)
            const currentDay = currentTime.getDay()
            console.log(currentDay)
            completeTaskDay === currentDay
        })
        response.locals.taskAlreadyCompletedToday = taskAlreadyCompletedToday
        next()
    } catch (err) {
        next(err)
    }
}

export const getSendTaskAlreadyCompletedTodayErrorMiddleware = (localisedTaskAlreadyCompletedTodayErrorMiddlewareMessage) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { taskAlreadyCompletedToday } = response.locals
        if (taskAlreadyCompletedToday) {
            return response.status(ResponseCodes.unprocessableEntity).send({ message: localisedTaskAlreadyCompletedTodayErrorMiddlewareMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedTaskAlreadyCompletedTodayErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.taskAlreadyCompleted)

export const sendTaskAlreadyCompletedTodayErrorMiddleware = getSendTaskAlreadyCompletedTodayErrorMiddleware(localisedTaskAlreadyCompletedTodayErrorMessage)

export const getAddTaskCompleteToSoloStreakMiddleware = (soloStreakModel) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const { currentTime } = response.locals
        console.log(currentTime)
        const taskComplete: ITaskComplete = {
            date: currentTime as Date
        }
        response.locals.updatedSoloStreak = await soloStreakModel.update({ _id: soloStreakId }, { $push: { calendar: taskComplete } })
        next()
    } catch (err) {
        next(err)
    }
}

export const addTaskCompleteToSoloStreakMiddleware = getAddTaskCompleteToSoloStreakMiddleware(soloStreakModel)

export const sendUpdatedSoloStreak = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { updatedSoloStreak } = response.locals
        return response.send(updatedSoloStreak)
    } catch (err) {
        next(err)
    }
}

export const createSoloStreakTaskCompleteMiddlewares = [
    soloStreakTaskCompletedParamsValidationMiddleware,
    retreiveTimeZoneHeaderMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    validateTimeZoneMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware,
    retreiveSoloStreakMiddleware,
    sendSoloStreakDoesNotExistErrorMiddleware,
    hasTaskAlreadyBeenCompletedTodayMiddleware,
    sendTaskAlreadyCompletedTodayErrorMiddleware,
    addTaskCompleteToSoloStreakMiddleware
]