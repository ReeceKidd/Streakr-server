import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import { CompleteSoloStreakTaskModel, completeSoloStreakTaskModel } from '../../Models/CompleteSoloStreakTask';
import { MomentHelpers } from '../../helpers/momentHelpers';

const soloStreakParamsValidationSchema = {
    soloStreakId: Joi.string().required(),
};

export const soloStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        soloStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveSoloStreakToRecoverMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { soloStreakId } = request.params;
        const soloStreak = await soloStreakModel.findById(soloStreakId);
        if (!soloStreak) {
            throw new CustomError(ErrorType.RecoverSoloStreakSoloStreakNotFound);
        }
        response.locals.soloStreak = soloStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveSoloStreakToRecoverMiddleware, err));
    }
};

export const retreiveSoloStreakToRecoverMiddleware = getRetreiveSoloStreakToRecoverMiddleware(soloStreakModel);

export const getReplaceSoloStreakCurrentStreakWithLostStreak = (
    soloStreakModel: mongoose.Model<SoloStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const soloStreak: SoloStreak = response.locals.soloStreak;

        const lostStreak = soloStreak.pastStreaks.pop();

        if (!lostStreak) {
            throw new CustomError(ErrorType.RecoverSoloStreakSoloNoLostStreak);
        }
        const recoveredCurrentStreak: CurrentStreak = {
            startDate: lostStreak.startDate,
            numberOfDaysInARow: lostStreak.numberOfDaysInARow += 1,
        };
        const soloStreakWithRestoredCurrentStreak = await soloStreakModel.findByIdAndUpdate(
            soloStreak._id,
            { $set: { currentStreak: recoveredCurrentStreak, pastStreaks: soloStreak.pastStreaks, active: true } },
            { new: true },
        );
        response.locals.soloStreak = soloStreakWithRestoredCurrentStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ReplaceSoloStreakCurrentStreakWithLostStreak, err));
    }
};

export const replaceSoloStreakCurrentStreakWithLostStreakMiddleware = getReplaceSoloStreakCurrentStreakWithLostStreak(
    soloStreakModel,
);

export const getCreateACompleteSoloStreakTaskForPreviousDayMiddleware = (
    completeSoloStreakTaskModel: mongoose.Model<CompleteSoloStreakTaskModel>,
    getTaskCompleteTimeForYesterdayFunction: typeof MomentHelpers.getTaskCompleteTimeForYesterday,
    getTaskCompleteDayFunction: typeof MomentHelpers.getTaskCompleteDay,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const soloStreak: SoloStreak = response.locals.soloStreak;
        const taskCompleteTime = getTaskCompleteTimeForYesterdayFunction({ timezone: user.timezone });
        const taskCompleteDay = getTaskCompleteDayFunction({ taskCompleteTime });
        const completeSoloStreakTask = new completeSoloStreakTaskModel({
            userId: user._id,
            streakId: soloStreak._id,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
        });
        await completeSoloStreakTask.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateACompleteSoloStreakTaskForPreviousDayMiddleware, err));
    }
};

export const createACompleteSoloStreakTaskForPreviousDayMiddleware = getCreateACompleteSoloStreakTaskForPreviousDayMiddleware(
    completeSoloStreakTaskModel,
    MomentHelpers.getTaskCompleteTimeForYesterday,
    MomentHelpers.getTaskCompleteDay,
);

export const getCreateRecoveredSoloStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const soloStreak: SoloStreak = response.locals.soloStreak;

        const recoveredSoloStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.recoveredSoloStreak,
            userId: user._id,
            soloStreakId: soloStreak._id,
            soloStreakName: soloStreak.streakName,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            streakNumberOfDays: soloStreak.currentStreak.numberOfDaysInARow,
        };
        createActivityFeedItemFunction(recoveredSoloStreakActivityFeedItem);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRecoveredSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createRecoveredSoloStreakActivityFeedItemMiddleware = getCreateRecoveredSoloStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateRecoveredSoloStreakTrackingEventMiddleware = (
    createStreakTrackingEventFunction: typeof createStreakTrackingEvent,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const soloStreak: SoloStreak = response.locals.soloStreak;
        await createStreakTrackingEventFunction({
            streakId: soloStreak._id,
            userId: user._id,
            streakType: StreakTypes.solo,
            type: StreakTrackingEventTypes.recoveredStreak,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRecoveredSoloStreakTrackingEventMiddleware, err));
    }
};

export const createRecoveredSoloStreakTrackingEventMiddleware = getCreateRecoveredSoloStreakTrackingEventMiddleware(
    createStreakTrackingEvent,
);

export const sendRecoveredSoloStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { soloStreak } = response.locals;
        response.status(ResponseCodes.success).send(soloStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendRecoveredSoloStreakMiddleware, err));
    }
};

export const recoverSoloStreakMiddlewares = [
    soloStreakParamsValidationMiddleware,
    retreiveSoloStreakToRecoverMiddleware,
    replaceSoloStreakCurrentStreakWithLostStreakMiddleware,
    createACompleteSoloStreakTaskForPreviousDayMiddleware,
    createRecoveredSoloStreakActivityFeedItemMiddleware,
    createRecoveredSoloStreakTrackingEventMiddleware,
    sendRecoveredSoloStreakMiddleware,
];
