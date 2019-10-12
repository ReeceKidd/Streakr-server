import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { dailyJobModel, DailyJobModel } from '../../Models/DailyJob';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { StreakTypes, AgendaJobNames } from '@streakoid/streakoid-sdk/lib';

const createDailyJobBodyValidationSchema = {
    agendaJobId: Joi.string().required(),
    jobName: Joi.string()
        .valid(Object.keys(AgendaJobNames))
        .required(),
    timezone: Joi.string().required(),
    localisedJobCompleteTime: Joi.string().required(),
    streakType: Joi.string()
        .valid(Object.keys(StreakTypes))
        .required(),
    wasSuccessful: Joi.boolean().required(),
};

export const createDailyJobBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createDailyJobBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSaveDailyJobToDatabaseMiddleware = (dailyJob: mongoose.Model<DailyJobModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { jobName, timezone, localisedJobCompleteTime, streakType, wasSuccessful } = request.body;
        const newDailyJob = new dailyJob({
            jobName,
            timezone,
            localisedJobCompleteTime,
            streakType,
            wasSuccessful,
        });
        response.locals.savedDailyJob = await newDailyJob.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateDailyJobFromRequestMiddleware, err));
    }
};

export const saveDailyJobToDatabaseMiddleware = getSaveDailyJobToDatabaseMiddleware(dailyJobModel);

export const sendFormattedDailyJobMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { savedDailyJob } = response.locals;
        response.status(ResponseCodes.created).send(savedDailyJob);
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedDailyJobMiddleware, err));
    }
};

export const createDailyJobMiddlewares = [
    createDailyJobBodyValidationMiddleware,
    saveDailyJobToDatabaseMiddleware,
    sendFormattedDailyJobMiddleware,
];
