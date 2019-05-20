import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as moment from 'moment-timezone'

import agenda, { AgendaJobs, AgendaProcessTimes, AgendaTimeRanges } from '../../../config/Agenda'

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { User } from "../../Models/User";
import { SoloStreak, soloStreakModel } from "../../Models/SoloStreak";
import { agendaJobModel } from '../../Models/AgendaJob';
import { ResponseCodes } from '../../Server/responseCodes';
import { SupportedRequestHeaders } from '../../Server/headers';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';
import { dayFormat } from './createSoloStreakCompleteTaskMiddlewares';

export interface SoloStreakRegistrationRequestBody {
    userId: string,
    name: string,
    description: string,
    createdAt: Date,
    modifiedAt: Date
}

export interface SoloStreakResponseLocals {
    user?: User,
    newSoloStreak?: SoloStreak,
    savedSoloStreak?: SoloStreak,
}


const soloStreakRegisterstrationValidationSchema = {
    userId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
};

export const soloStreakRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, soloStreakRegisterstrationValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};

const localisedMissingTimezoneHeaderMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.missingTimezoneHeaderMessage)

export const retreiveTimezoneHeaderMiddleware = (request: Request, response: Response, next: NextFunction) => {
    try {
        response.locals.timezone = request.header(SupportedRequestHeaders.xTimezone)
        next()
    } catch (err) {
        next(err)
    }
}

export const getSendMissingTimezoneErrorResponseMiddleware = localisedErrorMessage => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timezone } = response.locals
        if (!timezone) {
            return response.status(ResponseCodes.unprocessableEntity).send({ message: localisedErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

export const sendMissingTimezoneErrorResponseMiddleware = getSendMissingTimezoneErrorResponseMiddleware(localisedMissingTimezoneHeaderMessage)

export const getValidateTimezoneMiddleware = isValidTimezone => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timezone } = response.locals
        response.locals.validTimezone = isValidTimezone(timezone)
        next()
    } catch (err) {
        next(err)
    }
}

export const validateTimezoneMiddleware = getValidateTimezoneMiddleware(moment.tz.zone)

export const getSendInvalidTimezoneErrorResponseMiddleware = localisedErrorMessage => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { validTimezone } = response.locals
        if (!validTimezone) {
            return response.status(ResponseCodes.unprocessableEntity).send({ message: localisedErrorMessage })
        }
        next()
    } catch (err) {
        next(err)
    }
}

const localisedInvalidTimezoneMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.invalidTimezoneMessage)

export const sendInvalidTimezoneErrorResponseMiddleware = getSendInvalidTimezoneErrorResponseMiddleware(localisedInvalidTimezoneMessage)

export const getDefineCurrentTimeMiddleware = moment => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timezone } = response.locals
        const currentTime = moment().tz(timezone)
        response.locals.currentTime = currentTime
        next()
    } catch (err) {
        next(err)
    }
}

export const defineCurrentTimeMiddleware = getDefineCurrentTimeMiddleware(moment)

export const getDefineStartDayMiddleware = (dayFormat: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { currentTime } = response.locals
        const startDay = currentTime.format(dayFormat)
        response.locals.startDay = startDay
        next()
    } catch (err) {
        next(err)
    }
}

export const defineStartDayMiddleware = getDefineStartDayMiddleware(dayFormat)

export const getDefineEndOfDayMiddleware = (dayTimeRange: string) => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { currentTime } = response.locals
        response.locals.endOfDay = currentTime.endOf(dayTimeRange).toDate()
        next()
    } catch (err) {
        next(err)
    }
}

export const defineEndOfDayMiddleware = getDefineEndOfDayMiddleware(AgendaTimeRanges.day)

export const getCreateSoloStreakFromRequestMiddleware = soloStreak => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { name, description, userId } = request.body
        response.locals.newSoloStreak = new soloStreak({ name, description, userId });
        next();
    } catch (err) {
        next(err)
    }
};

export const createSoloStreakFromRequestMiddleware = getCreateSoloStreakFromRequestMiddleware(soloStreakModel);


export const saveSoloStreakToDatabaseMiddleware = async (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const newSoloStreak: SoloStreak = response.locals.newSoloStreak;
        response.locals.savedSoloStreak = await newSoloStreak.save();
        next();
    } catch (err) {
        next(err);
    }
};

export const getDoesTimezoneAlreadyExistMiddleware = agendaJobModel => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timezone } = response.locals
        const doesTimezoneAlreadyExist = await agendaJobModel.findOne({ "data.timezone": timezone })
        response.locals.doesTimezoneAlreadyExist = doesTimezoneAlreadyExist
        next()
    } catch (err) {
        next(err)
    }
}

export const doesTimezoneAlreadyExistMiddleware = getDoesTimezoneAlreadyExistMiddleware(agendaJobModel)

export const getCreateDailySoloStreakCompleteChecker = agenda => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { endOfDay, timezone, doesTimezoneAlreadyExist } = response.locals
        if (!doesTimezoneAlreadyExist) {
            const { userId } = request.body
            await agenda.start()
            await agenda.schedule(endOfDay, AgendaJobs.soloStreakCompleteTracker, { userId, timezone })
            await agenda.processEvery(AgendaProcessTimes.oneDays)
        }
        next()
    } catch (err) {
        next(err)
    }
}

export const createDailySoloStreakCompleteChecker = getCreateDailySoloStreakCompleteChecker(agenda)

export const sendFormattedSoloStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
) => {
    try {
        const { savedSoloStreak } = response.locals as SoloStreakResponseLocals;
        return response.status(ResponseCodes.created).send(savedSoloStreak);
    } catch (err) {
        next(err);
    }
};

export const createSoloStreakMiddlewares = [
    soloStreakRegistrationValidationMiddleware,
    retreiveTimezoneHeaderMiddleware,
    sendMissingTimezoneErrorResponseMiddleware,
    validateTimezoneMiddleware,
    sendInvalidTimezoneErrorResponseMiddleware,
    defineCurrentTimeMiddleware,
    defineStartDayMiddleware,
    defineEndOfDayMiddleware,
    createSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    doesTimezoneAlreadyExistMiddleware,
    createDailySoloStreakCompleteChecker,
    sendFormattedSoloStreakMiddleware
];
