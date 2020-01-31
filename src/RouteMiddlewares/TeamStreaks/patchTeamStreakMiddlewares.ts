import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import StreakStatus from '@streakoid/streakoid-sdk/lib/StreakStatus';
import { ActivityFeedItemModel, activityFeedItemModel } from '../../../src/Models/ActivityFeedItem';
import { User, ActivityFeedItemTypes } from '@streakoid/streakoid-sdk/lib';

const teamStreakParamsValidationSchema = {
    teamStreakId: Joi.string().required(),
};

export const teamStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        teamStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const teamStreakBodyValidationSchema = {
    creatorId: Joi.string(),
    streakName: Joi.string(),
    streakDescription: Joi.string(),
    numberOfMinutes: Joi.number(),
    timezone: Joi.string(),
    currentStreak: Joi.object(),
    pastStreaks: Joi.array(),
    status: Joi.string().valid(Object.keys(StreakStatus)),
    completedToday: Joi.boolean(),
    active: Joi.boolean(),
};

export const teamStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        teamStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { teamStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedTeamStreak = await teamStreakModel.findByIdAndUpdate(
            teamStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedTeamStreak) {
            throw new CustomError(ErrorType.UpdatedTeamStreakNotFound);
        }
        response.locals.updatedTeamStreak = updatedTeamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchTeamStreakMiddleware, err));
    }
};

export const patchTeamStreakMiddleware = getPatchTeamStreakMiddleware(teamStreakModel);

export const sendUpdatedTeamStreakMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { updatedTeamStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedTeamStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedTeamStreakMiddleware, err));
    }
};

export const getCreateArchivedTeamStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const user: User = response.locals.user;
            const { teamStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.archivedTeamStreak,
                userId: user._id,
                subjectId: teamStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateArchivedTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createArchivedTeamStreakActivityFeedItemMiddleware = getCreateArchivedTeamStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateRestoredTeamStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.live) {
            const user: User = response.locals.user;
            const { teamStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.restoredTeamStreak,
                userId: user._id,
                subjectId: teamStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRestoredTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createRestoredTeamStreakActivityFeedItemMiddleware = getCreateRestoredTeamStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateDeletedTeamStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.deleted) {
            const user: User = response.locals.user;
            const { teamStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.deletedTeamStreak,
                userId: user._id,
                subjectId: teamStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateDeletedTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createDeletedTeamStreakActivityFeedItemMiddleware = getCreateDeletedTeamStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateEditedTeamStreakNameActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakName } = request.body;
        if (streakName) {
            const user: User = response.locals.user;
            const { teamStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.editedTeamStreakName,
                userId: user._id,
                subjectId: teamStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEditedTeamStreakNameActivityFeedItemMiddleware, err));
    }
};

export const createEditedTeamStreakNameActivityFeedItemMiddleware = getCreateEditedTeamStreakNameActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateEditedTeamStreakDescriptionActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { streakDescription } = request.body;
        if (streakDescription) {
            const user: User = response.locals.user;
            const { teamStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.editedTeamStreakDescription,
                userId: user._id,
                subjectId: teamStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateEditedTeamStreakDescriptionActivityFeedItemMiddleware, err));
    }
};

export const createEditedTeamStreakDescriptionActivityFeedItemMiddleware = getCreateEditedTeamStreakDescriptionActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const patchTeamStreakMiddlewares = [
    teamStreakParamsValidationMiddleware,
    teamStreakRequestBodyValidationMiddleware,
    patchTeamStreakMiddleware,
    sendUpdatedTeamStreakMiddleware,
    createArchivedTeamStreakActivityFeedItemMiddleware,
    createRestoredTeamStreakActivityFeedItemMiddleware,
    createDeletedTeamStreakActivityFeedItemMiddleware,
    createEditedTeamStreakNameActivityFeedItemMiddleware,
    createEditedTeamStreakDescriptionActivityFeedItemMiddleware,
];
