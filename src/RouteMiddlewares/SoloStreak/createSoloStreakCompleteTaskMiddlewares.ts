import { Request, Response, NextFunction } from 'express'
import * as moment from 'moment-timezone'
import * as Joi from 'joi'

import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { SupportedRequestHeaders } from '../../Server/headers';
import { ResponseCodes } from '../../Server/responseCodes';
import { userModel } from '../../Models/User'
import { soloStreakModel, SoloStreak } from '../../Models/SoloStreak';
import { completeTaskModel, TypesOfStreak } from '../../Models/CompleteTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';


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

export const getRetreiveTimeZoneHeaderMiddleware = timeZoneHeader => (request: Request, response: Response, next: NextFunction) => {
    try {
        response.locals.timeZone = request.header(timeZoneHeader)
        next()
    } catch (err) {
        next(err)
    }
}

export const retreiveTimeZoneHeaderMiddleware = getRetreiveTimeZoneHeaderMiddleware(SupportedRequestHeaders.xTimeZone)

export const getSendMissingTimeZoneErrorResponseMiddleware = (unprocessableEntityCode, localisedErrorMessage) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timeZone } = response.locals
        if (!timeZone) {
            return response.status(unprocessableEntityCode).send({ message: localisedErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedMissingTimeZoneHeaderMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.missingTimeZoneHeaderMessage)

export const sendMissingTimeZoneErrorResponseMiddleware = getSendMissingTimeZoneErrorResponseMiddleware(ResponseCodes.unprocessableEntity, localisedMissingTimeZoneHeaderMessage)

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

export const getSendInvalidTimeZoneErrorResponseMiddleware = (unprocessableEntityCode: number, localisedErrorMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { validTimeZone } = response.locals
        if (!validTimeZone) {
            return response.status(unprocessableEntityCode).send({ message: localisedErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedInvalidTimeZoneMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.invalidTimeZoneMessage)

export const sendInvalidTimeZoneErrorResponseMiddleware = getSendInvalidTimeZoneErrorResponseMiddleware(ResponseCodes.unprocessableEntity, localisedInvalidTimeZoneMessage)

export const getRetreiveUserMiddleware = userModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { minimumUserData } = response.locals
        const user = await userModel.findOne({ _id: minimumUserData._id }).lean()
        response.locals.user = user
        next()
    } catch (err) {
        next(err)
    }
}

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel)

export const getSendUserDoesNotExistErrorMiddlware = (unprocessableEntityCode: number, localisedUserDoesNotExistErrorMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { user } = response.locals
        if (!user) {
            return response.status(unprocessableEntityCode).send({ message: localisedUserDoesNotExistErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedUserDoesNotExistErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.userDoesNotExistMessage)

export const sendUserDoesNotExistErrorMiddleware = getSendUserDoesNotExistErrorMiddlware(ResponseCodes.unprocessableEntity, localisedUserDoesNotExistErrorMessage)

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

export const setTaskCompleteTimeMiddleware = getSetTaskCompleteTimeMiddleware(moment)

export const getSetDayTaskWasCompletedMiddleware = (dayFormat) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { taskCompleteTime } = response.locals
        const taskCompleteDay = taskCompleteTime.format(dayFormat)
        response.locals.taskCompleteDay = taskCompleteDay
        next()
    } catch (err) {
        next(err)
    }
}

export const dayFormat = "YYYY-MM-DD"

export const setDayTaskWasCompletedMiddleware = getSetDayTaskWasCompletedMiddleware(dayFormat)

export const getHasTaskAlreadyBeenCompletedTodayMiddleware = completeTaskModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const { taskCompleteDay, user } = response.locals
        const taskAlreadyCompletedToday = await completeTaskModel.findOne({ userId: user._id, streakId: soloStreakId, taskCompleteDay })
        response.locals.taskAlreadyCompletedToday = taskAlreadyCompletedToday
        next()
    } catch (err) {
        next(err)
    }
}

export const hasTaskAlreadyBeenCompletedTodayMiddleware = getHasTaskAlreadyBeenCompletedTodayMiddleware(completeTaskModel)

export const getSendTaskAlreadyCompletedTodayErrorMiddleware = (unprocessableEntityResponseCode: number, localisedTaskAlreadyCompletedTodayErrorMiddlewareMessage: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { taskAlreadyCompletedToday } = response.locals
        if (taskAlreadyCompletedToday) {
            return response.status(unprocessableEntityResponseCode).send({ message: localisedTaskAlreadyCompletedTodayErrorMiddlewareMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedTaskAlreadyCompletedTodayErrorMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.taskAlreadyCompleted)

export const sendTaskAlreadyCompletedTodayErrorMiddleware = getSendTaskAlreadyCompletedTodayErrorMiddleware(ResponseCodes.unprocessableEntity, localisedTaskAlreadyCompletedTodayErrorMessage)

export const defineTaskCompleteMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        const { taskCompleteTime, taskCompleteDay, user } = response.locals
        const completeTaskDefinition = {
            userId: user._id,
            streakId: soloStreakId,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
            streakType: TypesOfStreak.soloStreak
        }
        response.locals.completeTaskDefinition = completeTaskDefinition
        next()
    } catch (err) {
        next(err)
    }
}

export const getSaveTaskCompleteMiddleware = (completeTaskModel) => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { completeTaskDefinition } = response.locals
        const completeTask = await new completeTaskModel(completeTaskDefinition).save()
        response.locals.completeTask = completeTask
        next()
    } catch (err) {
        next(err)
    }
}

export const getStreakMaintainedMiddleware = soloStreakModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { soloStreakId } = request.params
        await soloStreakModel.updateOne({ _id: soloStreakId }, { completedToday: true, $inc: { "currentStreak.numberOfDaysInARow": 1 } })
        next()
    } catch (err) {
        next(err)
    }
}

export const streakMaintainedMiddleware = getStreakMaintainedMiddleware(soloStreakModel)

export const saveTaskCompleteMiddleware = getSaveTaskCompleteMiddleware(completeTaskModel)

export const sendTaskCompleteResponseMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        const { completeTask } = response.locals
        return response.status(ResponseCodes.success).send(completeTask)
    } catch (err) {
        next(err)
    }
}

export const createSoloStreakCompleteTaskMiddlewares = [
    soloStreakTaskCompleteParamsValidationMiddleware,
    soloStreakExistsMiddleware,
    sendSoloStreakDoesNotExistErrorMessageMiddleware,
    retreiveTimeZoneHeaderMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    validateTimeZoneMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware,
    retreiveUserMiddleware,
    sendUserDoesNotExistErrorMiddleware,
    setTaskCompleteTimeMiddleware,
    setDayTaskWasCompletedMiddleware,
    hasTaskAlreadyBeenCompletedTodayMiddleware,
    sendTaskAlreadyCompletedTodayErrorMiddleware,
    defineTaskCompleteMiddleware,
    saveTaskCompleteMiddleware,
    streakMaintainedMiddleware,
    sendTaskCompleteResponseMiddleware
]