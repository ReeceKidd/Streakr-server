import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { soloStreakModel, SoloStreakModel } from '../../Models/SoloStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { ActivityFeedItemModel, activityFeedItemModel } from '../../../src/Models/ActivityFeedItem';
import { User, StreakStatus, ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

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

const soloStreakBodyValidationSchema = {
    streakName: Joi.string(),
    status: Joi.string(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number(),
    completedToday: Joi.boolean(),
    timezone: Joi.string(),
    active: Joi.boolean(),
    currentStreak: Joi.object(),
    pastStreaks: Joi.array(),
};

export const soloStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        soloStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchSoloStreakMiddleware = (soloStreakModel: mongoose.Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { soloStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedSoloStreak = await soloStreakModel.findByIdAndUpdate(
            soloStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedSoloStreak) {
            throw new CustomError(ErrorType.UpdatedSoloStreakNotFound);
        }
        response.locals.updatedSoloStreak = updatedSoloStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchSoloStreakMiddleware, err));
    }
};

export const patchSoloStreakMiddleware = getPatchSoloStreakMiddleware(soloStreakModel);

export const sendUpdatedSoloStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { updatedSoloStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedSoloStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedSoloStreakMiddleware, err));
    }
};

export const getCreateArchivedSoloStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const user: User = response.locals.user;
            const { soloStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.archivedSoloStreak,
                userId: user._id,
                subjectId: soloStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateArchivedSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createArchivedSoloStreakActivityFeedItemMiddleware = getCreateArchivedSoloStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateRestoredSoloStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.live) {
            const user: User = response.locals.user;
            const { soloStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.restoredSoloStreak,
                userId: user._id,
                subjectId: soloStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRestoredSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createRestoredSoloStreakActivityFeedItemMiddleware = getCreateRestoredSoloStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateDeletedSoloStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.deleted) {
            const user: User = response.locals.user;
            const { soloStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.deletedSoloStreak,
                userId: user._id,
                subjectId: soloStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateDeletedSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createDeletedSoloStreakActivityFeedItemMiddleware = getCreateDeletedSoloStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateEditedSoloStreakNameActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakName } = request.body;
        if (streakName) {
            const user: User = response.locals.user;
            const { soloStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.editedSoloStreakName,
                userId: user._id,
                subjectId: soloStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEditedSoloStreakNameActivityFeedItemMiddleware, err));
    }
};

export const createEditedSoloStreakNameActivityFeedItemMiddleware = getCreateEditedSoloStreakNameActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateEditedSoloStreakDescriptionActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakDescription } = request.body;
        if (streakDescription) {
            const user: User = response.locals.user;
            const { soloStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.editedSoloStreakDescription,
                userId: user._id,
                subjectId: soloStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEditedSoloStreakDescriptionActivityFeedItemMiddleware, err));
    }
};

export const createEditedSoloStreakDescriptionActivityFeedItemMiddleware = getCreateEditedSoloStreakDescriptionActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const patchSoloStreakMiddlewares = [
    soloStreakParamsValidationMiddleware,
    soloStreakRequestBodyValidationMiddleware,
    patchSoloStreakMiddleware,
    sendUpdatedSoloStreakMiddleware,
    createArchivedSoloStreakActivityFeedItemMiddleware,
    createRestoredSoloStreakActivityFeedItemMiddleware,
    createDeletedSoloStreakActivityFeedItemMiddleware,
    createEditedSoloStreakNameActivityFeedItemMiddleware,
    createEditedSoloStreakDescriptionActivityFeedItemMiddleware,
];
