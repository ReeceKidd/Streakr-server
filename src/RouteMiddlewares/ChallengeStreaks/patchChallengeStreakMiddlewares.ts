import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import { ActivityFeedItemTypes, User, StreakStatus, ChallengeStreak } from '@streakoid/streakoid-sdk/lib';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { ActivityFeedItemModel, activityFeedItemModel } from '../../../src/Models/ActivityFeedItem';
import { challengeModel, ChallengeModel } from '../../../src/Models/Challenge';

const challengeStreakParamsValidationSchema = {
    challengeStreakId: Joi.string().required(),
};

export const challengeStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        challengeStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

const challengeStreakBodyValidationSchema = {
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

export const challengeStreakRequestBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        challengeStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getPatchChallengeStreakMiddleware = (challengeStreakModel: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { challengeStreakId } = request.params;
        const keysToUpdate = request.body;
        const updatedChallengeStreak = await challengeStreakModel.findByIdAndUpdate(
            challengeStreakId,
            { ...keysToUpdate },
            { new: true },
        );
        if (!updatedChallengeStreak) {
            throw new CustomError(ErrorType.UpdatedChallengeStreakNotFound);
        }
        response.locals.updatedChallengeStreak = updatedChallengeStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.PatchChallengeStreakMiddleware, err));
    }
};

export const patchChallengeStreakMiddleware = getPatchChallengeStreakMiddleware(challengeStreakModel);

export const getRemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware = (
    challengeModel: mongoose.Model<ChallengeModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const updatedChallengeStreak: ChallengeStreak = response.locals.updatedChallengeStreak;
        const { status } = request.body;
        if (status && status === StreakStatus.deleted) {
            const challenge = await challengeModel.findById(updatedChallengeStreak.challengeId);
            const membersWithoutCurrentUser =
                challenge && challenge.members.filter(member => member !== updatedChallengeStreak.userId);
            await challengeModel.findByIdAndUpdate(
                updatedChallengeStreak.challengeId,
                { members: membersWithoutCurrentUser },
                { new: true },
            );
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        next(new CustomError(ErrorType.RemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware, err));
    }
};

export const removeUserFromChallengeIfChallengeStreakIsDeletedMiddleware = getRemoveUserFromChallengeIfChallengeStreakIsDeletedMiddleware(
    challengeModel,
);

export const sendUpdatedChallengeStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { updatedChallengeStreak } = response.locals;
        response.status(ResponseCodes.success).send(updatedChallengeStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendUpdatedChallengeStreakMiddleware, err));
    }
};

export const getCreateArchivedChallengeStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.archived) {
            const user: User = response.locals.user;
            const { challengeStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.archivedChallengeStreak,
                userId: user._id,
                subjectId: challengeStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateArchivedChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createArchivedChallengeStreakActivityFeedItemMiddleware = getCreateArchivedChallengeStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateRestoredChallengeStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.live) {
            const user: User = response.locals.user;
            const { challengeStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.restoredChallengeStreak,
                userId: user._id,
                subjectId: challengeStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRestoredChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createRestoredChallengeStreakActivityFeedItemMiddleware = getCreateRestoredChallengeStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const getCreateDeletedChallengeStreakActivityFeedItemMiddleware = (
    activityFeedItemModel: mongoose.Model<ActivityFeedItemModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { status } = request.body;
        if (status === StreakStatus.deleted) {
            const user: User = response.locals.user;
            const { challengeStreakId } = request.params;
            const newActivity = new activityFeedItemModel({
                activityFeedItemType: ActivityFeedItemTypes.deletedChallengeStreak,
                userId: user._id,
                subjectId: challengeStreakId,
            });
            await newActivity.save();
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateDeletedChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createDeletedChallengeStreakActivityFeedItemMiddleware = getCreateDeletedChallengeStreakActivityFeedItemMiddleware(
    activityFeedItemModel,
);

export const patchChallengeStreakMiddlewares = [
    challengeStreakParamsValidationMiddleware,
    challengeStreakRequestBodyValidationMiddleware,
    patchChallengeStreakMiddleware,
    removeUserFromChallengeIfChallengeStreakIsDeletedMiddleware,
    sendUpdatedChallengeStreakMiddleware,
    createArchivedChallengeStreakActivityFeedItemMiddleware,
    createRestoredChallengeStreakActivityFeedItemMiddleware,
    createDeletedChallengeStreakActivityFeedItemMiddleware,
];
