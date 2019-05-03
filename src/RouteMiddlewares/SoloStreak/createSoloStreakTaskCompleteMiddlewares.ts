import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'
import * as moment from 'moment-timezone'

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { SupportedRequestHeaders } from '../../Server/headers';
import { ResponseCodes } from '../../Server/responseCodes';
import { soloStreakModel } from '../../Models/SoloStreak';
import { ITask } from '../../Models/User'

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

export const retreiveSoloStreakMiddleware = getRetreiveSoloStreakMiddleware(soloStreakModel)

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

export const getSetTaskCompleteTimeMiddleware = moment => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timeZone } = response.locals
        const taskCompleteTime = moment().tz(timeZone)
        response.locals.taskCompleteTime = taskCompleteTime
        next()
    } catch (err) {
        next(err)
    }
}

export const setCurrentTimeMiddleware = getSetTaskCompleteTimeMiddleware(moment)

export const getSetDayTaskWasCompletedMiddleware = (dayFormat) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { taskCompleteTime } = response.locals
        const dayTaskWasCompleted = taskCompleteTime.format(dayFormat)
        response.locals.dayTaskWasCompleted = dayTaskWasCompleted
        next()
    } catch (err) {
        next(err)
    }
}

const dayFormat = "YYYY-MM-DD"

export const setDayTaskWasCompletedMiddleware = getSetDayTaskWasCompletedMiddleware(dayFormat)

export const hasTaskAlreadyBeenCompletedTodayMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreak, dayTaskWasCompleted } = response.locals
        const taskAlreadyCompletedToday = soloStreak.calendar.find(completeTask => {
            return completeTask.dayTaskWasCompleted === dayTaskWasCompleted
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
        const { taskCompleteTime, dayTaskWasCompleted } = response.locals
        const taskComplete: ITask = {
            taskCompleteTime: taskCompleteTime.toDate(),
            dayTaskWasCompleted,
            wasCompleted: true
        }
        response.locals.updatedSoloStreak = await soloStreakModel.findOneAndUpdate(
            { _id: soloStreakId },
            { $push: { calendar: taskComplete } },
            { new: true })
            .lean()
        next()
    } catch (err) {
        next(err)
    }
}

export const addTaskCompleteToSoloStreakMiddleware = getAddTaskCompleteToSoloStreakMiddleware(soloStreakModel)

export const sendUpdatedSoloStreakMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { updatedSoloStreak } = response.locals
        return response.status(ResponseCodes.success).send(updatedSoloStreak)
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
    setCurrentTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    hasTaskAlreadyBeenCompletedTodayMiddleware,
    sendTaskAlreadyCompletedTodayErrorMiddleware,
    addTaskCompleteToSoloStreakMiddleware,
    sendUpdatedSoloStreakMiddleware
]