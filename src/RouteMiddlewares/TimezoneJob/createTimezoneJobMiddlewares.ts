import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { timezoneJobModel, TimezoneJobModel } from '../../Models/TimezoneJob';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakTypes, GroupStreakTypes, AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

const createTimezoneJobBodyValidationSchema = {
    jobName: Joi.string()
        .valid(Object.keys(AgendaJobNames))
        .required(),
    timezone: Joi.string().required(),
    localisedJobCompleteTime: Joi.string().required(),
    streakType: Joi.string()
        .valid(Object.keys(StreakTypes))
        .required(),
    numberOfStreaks: Joi.number().required(),
    groupStreakType: Joi.string().valid(Object.keys(GroupStreakTypes)),
};

export const createTimezoneJobBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createTimezoneJobBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const validateTimezoneJobBody = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { streakType, groupStreakType } = request.body;
        if (streakType === StreakTypes.soloStreak && groupStreakType) {
            throw new CustomError(ErrorType.ValidateTimezoneJobBodyGroupStreakTypeShouldNotBeDefined);
        }
        if (streakType === StreakTypes.groupMemberStreak && !groupStreakType) {
            throw new CustomError(ErrorType.ValidateTimezoneJobBodyGroupStreakTypeMustBeDefined);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.ValidateTimezoneJobBody, err));
    }
};

export const getSaveTimezoneJobToDatabaseMiddleware = (timezoneJob: mongoose.Model<TimezoneJobModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const {
            jobName,
            timezone,
            localisedJobCompleteTime,
            streakType,
            numberOfStreaks,
            groupStreakType,
        } = request.body;
        const newTimezoneJob = new timezoneJob({
            jobName,
            timezone,
            localisedJobCompleteTime,
            streakType,
            numberOfStreaks,
            groupStreakType,
        });
        response.locals.savedTimezoneJob = await newTimezoneJob.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateTimezoneJobFromRequestMiddleware, err));
    }
};

export const saveTimezoneJobToDatabaseMiddleware = getSaveTimezoneJobToDatabaseMiddleware(timezoneJobModel);

export const sendFormattedTimezoneJobMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedTimezoneJob } = response.locals;
        response.status(ResponseCodes.created).send(savedTimezoneJob);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedTimezoneJobMiddleware, err));
    }
};

export const createTimezoneJobMiddlewares = [
    createTimezoneJobBodyValidationMiddleware,
    validateTimezoneJobBody,
    saveTimezoneJobToDatabaseMiddleware,
    sendFormattedTimezoneJobMiddleware,
];
