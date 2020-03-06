import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { CustomError, ErrorType } from '../../customError';

const getSoloStreakParamsValidationSchema = {
    soloStreakId: Joi.string().required(),
};

export const getSoloStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        getSoloStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveSoloStreakMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { soloStreakId } = request.params;
        const soloStreak = await soloStreakModel.findOne({ _id: soloStreakId }).lean();
        if (!soloStreak) {
            throw new CustomError(ErrorType.GetSoloStreakNoSoloStreakFound);
        }
        response.locals.soloStreak = soloStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveSoloStreakMiddleware, err));
    }
};

export const retreiveSoloStreakMiddleware = getRetreiveSoloStreakMiddleware(soloStreakModel);

export const sendSoloStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { soloStreak } = response.locals;
        response.send(soloStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendSoloStreakMiddleware, err));
    }
};

export const getOneSoloStreakMiddlewares = [
    getSoloStreakParamsValidationMiddleware,
    retreiveSoloStreakMiddleware,
    sendSoloStreakMiddleware,
];
