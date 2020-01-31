import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { incompleteSoloStreakTaskModel, IncompleteSoloStreakTaskModel } from '../../Models/IncompleteSoloStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { SoloStreak, User, ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';
import { ActivityFeedItemModel } from '../../../src/Models/ActivityFeedItem';
import { activityFeedItemModel } from '../../../src/Models/ActivityFeedItem';

export const incompleteSoloStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    soloStreakId: Joi.string().required(),
};

export const incompleteSoloStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        incompleteSoloStreakTaskBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getSoloStreakExistsMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { soloStreakId } = request.body;
        const soloStreak = await soloStreakModel.findOne({ _id: soloStreakId });
        if (!soloStreak) {
            throw new CustomError(ErrorType.CreateIncompleteSoloStreakTaskSoloStreakDoesNotExist);
        }
        response.locals.soloStreak = soloStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteSoloStreakTaskSoloStreakExistsMiddleware, err));
    }
};

export const soloStreakExistsMiddleware = getSoloStreakExistsMiddleware(soloStreakModel);

export const ensureSoloStreakTaskHasBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const soloStreak: SoloStreak = response.locals.soloStreak;
        if (!soloStreak.completedToday) {
            throw new CustomError(ErrorType.SoloStreakHasNotBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureSoloStreakTaskHasBeenCompletedTodayMiddleware, err));
    }
};

export const getResetStreakStartDateMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const soloStreak: SoloStreak = response.locals.soloStreak;
        if (soloStreak.currentStreak.numberOfDaysInARow === 1) {
            response.locals.soloStreak = await soloStreakModel
                .findByIdAndUpdate(
                    soloStreak._id,
                    {
                        currentStreak: {
                            startDate: null,
                            numberOfDaysInARow: 0,
                        },
                    },
                    { new: true },
                )
                .lean();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.ResetStreakStartDateMiddleware, err));
    }
};

export const resetStreakStartDateMiddleware = getResetStreakStartDateMiddleware(soloStreakModel);

export const getRetreiveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.CreateIncompleteSoloStreakTaskUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteSoloStreakTaskRetreiveUserMiddleware, err));
    }
};

export const retreiveUserMiddleware = getRetreiveUserMiddleware(userModel);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getSetTaskIncompleteTimeMiddleware = (moment: any) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const timezone = response.locals.timezone;
        const taskIncompleteTime = moment().tz(timezone);
        response.locals.taskIncompleteTime = taskIncompleteTime;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetTaskIncompleteTimeMiddleware, err));
    }
};

export const setTaskIncompleteTimeMiddleware = getSetTaskIncompleteTimeMiddleware(moment);

export const getSetDayTaskWasIncompletedMiddleware = (dayFormat: string) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { taskIncompleteTime } = response.locals;
        const taskIncompleteDay = taskIncompleteTime.format(dayFormat);
        response.locals.taskIncompleteDay = taskIncompleteDay;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SetDayTaskWasIncompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasIncompletedMiddleware = getSetDayTaskWasIncompletedMiddleware(dayFormat);

export const createIncompleteSoloStreakTaskDefinitionMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { userId, soloStreakId } = request.body;
        const { taskIncompleteTime, taskIncompleteDay } = response.locals;
        const incompleteSoloStreakTaskDefinition = {
            userId,
            streakId: soloStreakId,
            taskIncompleteTime: taskIncompleteTime.toDate(),
            taskIncompleteDay,
        };
        response.locals.incompleteSoloStreakTaskDefinition = incompleteSoloStreakTaskDefinition;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteSoloStreakTaskDefinitionMiddleware, err));
    }
};

export const getSaveTaskIncompleteMiddleware = (
    incompleteSoloStreakTaskModel: mongoose.Model<IncompleteSoloStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { incompleteSoloStreakTaskDefinition } = response.locals;
        const incompleteSoloStreakTask = await new incompleteSoloStreakTaskModel(
            incompleteSoloStreakTaskDefinition,
        ).save();
        response.locals.incompleteSoloStreakTask = incompleteSoloStreakTask;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveTaskIncompleteMiddleware, err));
    }
};

export const saveTaskIncompleteMiddleware = getSaveTaskIncompleteMiddleware(incompleteSoloStreakTaskModel);

export const getIncompleteSoloStreakMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const soloStreak: SoloStreak = response.locals.soloStreak;
        if (soloStreak.currentStreak.numberOfDaysInARow !== 0) {
            await soloStreakModel.updateOne(
                { _id: soloStreak._id },
                {
                    completedToday: false,
                    $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                    active: false,
                },
            );
        } else {
            await soloStreakModel.updateOne(
                { _id: soloStreak._id },
                {
                    completedToday: false,
                    'currentStreak.numberOfDaysInARow': 0,
                    active: false,
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncompleteSoloStreakMiddleware, err));
    }
};

export const incompleteSoloStreakMiddleware = getIncompleteSoloStreakMiddleware(soloStreakModel);

export const getSendTaskIncompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteSoloStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(incompleteSoloStreakTask);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendTaskIncompleteResponseMiddleware, err));
    }
};

export const sendTaskIncompleteResponseMiddleware = getSendTaskIncompleteResponseMiddleware(ResponseCodes.created);

export const getCreateIncompleteSoloStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const soloStreak: SoloStreak = response.locals.soloStreak;
        const newActivity = new activityFeedItemModel({
            activityFeedItemType: ActivityFeedItemTypes.incompletedSoloStreak,
            userId: user._id,
            subjectId: soloStreak._id,
        });
        await newActivity.save();
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createIncompleteSoloStreakActivitFeedItemMiddleware = getCreateIncompleteSoloStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const createIncompleteSoloStreakTaskMiddlewares = [
    incompleteSoloStreakTaskBodyValidationMiddleware,
    soloStreakExistsMiddleware,
    ensureSoloStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    retreiveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    createIncompleteSoloStreakTaskDefinitionMiddleware,
    saveTaskIncompleteMiddleware,
    incompleteSoloStreakMiddleware,
    sendTaskIncompleteResponseMiddleware,
    createIncompleteSoloStreakActivitFeedItemMiddleware,
];
