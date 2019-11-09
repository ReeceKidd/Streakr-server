import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { AgendaJobNames } from '@streakoid/streakoid-sdk/lib';
import { dailyJobModel, DailyJobModel } from '../../../src/Models/DailyJob';

const getDailyJobsQueryValidationSchema = {
    agendaJobId: Joi.string(),
    jobName: Joi.string().valid(Object.keys(AgendaJobNames)),
    timezone: Joi.string(),
};

export const getDailyJobsQueryValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.query,
        getDailyJobsQueryValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getFindDailyJobsMiddleware = (dailyJobModel: mongoose.Model<DailyJobModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { agendaJobId, jobName, timezone } = request.query;

        const query: {
            agendaJobId?: string;
            jobName?: string;
            timezone?: string;
        } = {};

        if (agendaJobId) {
            query.agendaJobId = agendaJobId;
        }
        if (jobName) {
            query.jobName = jobName;
        }
        if (timezone) {
            query.timezone = timezone;
        }

        response.locals.dailyJobs = await dailyJobModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindDailyJobsMiddleware, err));
    }
};

export const findDailyJobsMiddleware = getFindDailyJobsMiddleware(dailyJobModel);

export const sendDailyJobsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { dailyJobs } = response.locals;
        response.status(ResponseCodes.success).send(dailyJobs);
    } catch (err) {
        next(new CustomError(ErrorType.SendDailyJobsMiddleware, err));
    }
};

export const getAllDailyJobsMiddlewares = [
    getDailyJobsQueryValidationMiddleware,
    findDailyJobsMiddleware,
    sendDailyJobsMiddleware,
];
