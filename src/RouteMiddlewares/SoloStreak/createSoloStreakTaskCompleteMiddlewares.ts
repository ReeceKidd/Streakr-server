import { Request, Response, NextFunction } from 'express'
import * as moment from 'moment-timezone'
import * as Joi from 'joi'

import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { SupportedRequestHeaders } from '../../Server/headers';
import { ResponseCodes } from '../../Server/responseCodes';
import { ITask, userModel } from '../../Models/User'
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel, ISoloStreak } from '../../Models/SoloStreak';


export const soloStreakTaskCompleteParamsValidationSchema = {
    soloStreakId: Joi.string().required()
}

export const soloStreakTaskCompleteParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    Joi.validate(request.params, soloStreakTaskCompleteParamsValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next))
}

export const getSoloStreakExistsMiddleware = soloStreakModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const soloStreak = await soloStreakModel.findOne({ _id: soloStreakId })
        response.locals.soloStreak = soloStreak
        next()
    } catch (err) {
        next(err)
    }
}

export const soloStreakExistsMiddleware = getSoloStreakExistsMiddleware(soloStreakModel)

export const getSendSoloStreakDoesNotExistErrorMessageMiddleware = (unprocessableEntityStatusCode: number, localisedSoloStreakDoesNotExistErrorMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreak } = response.locals
        if (!soloStreak) {
            return response.status(unprocessableEntityStatusCode).send({ message: localisedSoloStreakDoesNotExistErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedSoloStreakDoesNotExistMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.soloStreakDoesNotExist)

export const sendSoloStreakDoesNotExistErrorMessageMiddleware = getSendSoloStreakDoesNotExistErrorMessageMiddleware(ResponseCodes.unprocessableEntity, localisedSoloStreakDoesNotExistMessage)

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

export const getRetreiveUserCalendarMiddleware = userModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { minimumUserData } = response.locals
        const user = await userModel.findOne({ _id: minimumUserData._id }).lean()
        response.locals.calendar = user.calendar
        next()
    } catch (err) {
        next(err)
    }
}

export const retreiveUserCalendarMiddleware = getRetreiveUserCalendarMiddleware(userModel)

export const getUserCalendarDoesNotExistErrorMiddlware = (localisedCalendarDoesNotExistErrorMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { calendar } = response.locals
        if (!calendar) {
            return response.status(ResponseCodes.unprocessableEntity).send({ message: localisedCalendarDoesNotExistErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedCalendarDoesNotExistErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.calendarDoesNotExistMessage)

export const sendUserCalendarDoesNotExistErrorMiddleware = getUserCalendarDoesNotExistErrorMiddlware(localisedCalendarDoesNotExistErrorMessage)

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
        const calendar = response.locals.calendar as ITask[]
        const soloStreak = response.locals.soloStreak as ISoloStreak
        const { dayTaskWasCompleted } = response.locals
        const taskAlreadyCompletedToday = calendar.find(completeTask => {
            return completeTask.dayTaskWasCompleted === dayTaskWasCompleted && completeTask.streakId === soloStreak.id
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

export const defineTaskCompleteMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const { taskCompleteTime, dayTaskWasCompleted } = response.locals
        const taskComplete: ITask = {
            streakId: soloStreakId,
            taskCompleteTime: taskCompleteTime.toDate(),
            dayTaskWasCompleted
        }
        response.locals.taskComplete = taskComplete
        next()
    } catch (err) {
        next(err)
    }
}

export const getAddTaskCompleteToUserCalendarMiddleware = (userModel) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { taskComplete, minimumUserData } = response.locals
        await userModel.updateOne(
            { _id: minimumUserData._id },
            { $push: { calendar: taskComplete } }
        )
        next()
    } catch (err) {
        next(err)
    }
}

export const addTaskCompleteToUserCalendarMiddleware = getAddTaskCompleteToUserCalendarMiddleware(userModel)

export const getAddTaskCompleteToSoloStreakActivityLogMiddleware = (soloStreakModel) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const { taskComplete } = response.locals
        await soloStreakModel.updateOne(
            { _id: soloStreakId },
            { $push: { activityLog: taskComplete } }
        )
        next()
    } catch (err) {
        next(err)
    }
}

export const addTaskCompleteToSoloStreakActivityLogMiddleware = getAddTaskCompleteToSoloStreakActivityLogMiddleware(soloStreakModel)

export const sendTaskCompleteResponseMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { taskComplete } = response.locals
        return response.status(ResponseCodes.success).send(taskComplete)
    } catch (err) {
        next(err)
    }
}

export const createSoloStreakTaskCompleteMiddlewares = [
    soloStreakTaskCompleteParamsValidationMiddleware,
    soloStreakExistsMiddleware,
    sendSoloStreakDoesNotExistErrorMessageMiddleware,
    retreiveTimeZoneHeaderMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    validateTimeZoneMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware,
    retreiveUserCalendarMiddleware,
    sendUserCalendarDoesNotExistErrorMiddleware,
    setCurrentTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    hasTaskAlreadyBeenCompletedTodayMiddleware,
    sendTaskAlreadyCompletedTodayErrorMiddleware,
    defineTaskCompleteMiddleware,
    addTaskCompleteToUserCalendarMiddleware,
    addTaskCompleteToSoloStreakActivityLogMiddleware,
    sendTaskCompleteResponseMiddleware
]