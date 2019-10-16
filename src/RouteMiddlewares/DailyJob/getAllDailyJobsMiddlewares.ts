import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';

const getDailyJobsQueryValidationSchema = {
    agendaJobId: Joi.string(),
    jobName: Joi.string(),
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

export const getFindDailyJobsMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
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

        response.locals.dailyJobs = await soloStreakModel.find(query);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.FindDailyJobsMiddleware, err));
    }
};

export const findDailyJobsMiddleware = getFindDailyJobsMiddleware(soloStreakModel);

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
