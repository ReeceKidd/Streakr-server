import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as moment from 'moment-timezone'

import agenda, { AgendaJobs, AgendaProcessTimes, AgendaTimeRanges } from '../../../config/Agenda'

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { IUser } from "../../Models/User";
import { ISoloStreak, soloStreakModel } from "../../Models/SoloStreak";
import { ResponseCodes } from '../../Server/responseCodes';
import { SupportedRequestHeaders } from '../../Server/headers';
import { getLocalisedString } from '../../Messages/getLocalisedString';
import { MessageCategories } from '../../Messages/messageCategories';
import { FailureMessageKeys } from '../../Messages/failureMessages';

export interface SoloStreakRegistrationRequestBody {
    userId: string,
    name: string,
    description: string,
    createdAt: Date,
    modifiedAt: Date
}

export interface SoloStreakResponseLocals {
    user?: IUser,
    newSoloStreak?: ISoloStreak,
    savedSoloStreak?: ISoloStreak,
}


const soloStreakRegisterstrationValidationSchema = {
    userId: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
};

export const soloStreakRegistrationValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(request.body, soloStreakRegisterstrationValidationSchema, getValidationErrorMessageSenderMiddleware(request, response, next));
};

const localisedMissingTimeZoneHeaderMessage = getLocalisedString(MessageCategories.failureMessages, FailureMessageKeys.missingTimeZoneHeaderMessage)

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

export const getSetEndOfDayMiddleware = moment => (request: Request, response: Response, next: NextFunction) => {
    try {
        const { timeZone } = response.locals
        response.locals.endOfDay = moment().tz(timeZone).endOf(AgendaTimeRanges.day).toDate()
        next()
    } catch (err) {
        next(err)
    }
}

export const setEndOfDayMiddleware = getSetEndOfDayMiddleware(moment)

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
        const newSoloStreak: ISoloStreak = response.locals.newSoloStreak;
        response.locals.savedSoloStreak = await newSoloStreak.save();
        next();
    } catch (err) {
        next(err);
    }
};

export const getCreateDailySoloStreakCompleteChecker = agenda => async (request: Request, response: Response, next: NextFunction) => {
    try {
        const { endOfDay } = response.locals
        const { userId } = request.body
        await agenda.start()
        await agenda.schedule(endOfDay, AgendaJobs.soloStreakCompleteTracker, { userId })
        await agenda.processEvery(AgendaProcessTimes.oneDays)
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
    retreiveTimeZoneHeaderMiddleware,
    sendMissingTimeZoneErrorResponseMiddleware,
    validateTimeZoneMiddleware,
    sendInvalidTimeZoneErrorResponseMiddleware,
    setEndOfDayMiddleware,
    createSoloStreakFromRequestMiddleware,
    saveSoloStreakToDatabaseMiddleware,
    createDailySoloStreakCompleteChecker,
    sendFormattedSoloStreakMiddleware
];
