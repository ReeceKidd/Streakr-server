import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';
import { UserModel, userModel } from '../../../src/Models/User';
import {
    User,
    Challenge,
    ActivityFeedItemTypes,
    ChallengeStreak,
    ActivityFeedItemType,
} from '@streakoid/streakoid-models/lib';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';

const createChallengeStreakBodyValidationSchema = {
    challengeId: Joi.string().required(),
    userId: Joi.string().required(),
};

export const createChallengeStreakBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        createChallengeStreakBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getDoesChallengeExistMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { challengeId } = request.body;
        const challenge = await challengeModel.findOne({ _id: challengeId }).lean();
        if (!challenge) {
            throw new CustomError(ErrorType.CreateChallengeStreakChallengeDoesNotExist);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.DoesChallengeExistMiddleware, err));
    }
};

export const doesChallengeExistMiddleware = getDoesChallengeExistMiddleware(challengeModel);

export const getDoesUserExistMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.CreateChallengeStreakUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateChallengeStreakDoesUserExistMiddleware, err));
    }
};

export const doesUserExistMiddleware = getDoesUserExistMiddleware(userModel);

export const getIsUserAlreadyInChallengeMiddleware = (challenge: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, challengeId } = request.body;
        const userIsAlreadyInChallenge = await challenge.findOne({
            _id: challengeId,
            members: userId,
        });
        if (userIsAlreadyInChallenge) {
            throw new CustomError(ErrorType.UserIsAlreadyInChallenge);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.IsUserAlreadyInChallengeMiddleware, err));
    }
};

export const isUserAlreadyInChallengeMiddleware = getIsUserAlreadyInChallengeMiddleware(challengeModel);

export const getAddUserToChallengeMembersMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId, challengeId } = request.body;
        const challenge = await challengeModel
            .findOneAndUpdate({ _id: challengeId }, { $push: { members: userId } }, { new: true })
            .lean();
        response.locals.challenge = challenge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.AddUserToChallengeMiddleware, err));
    }
};

export const addUserToChallengeMembersMiddleware = getAddUserToChallengeMembersMiddleware(challengeModel);

export const getIncreaseNumberOfMembersInChallengeMiddleware = (
    challengeModel: mongoose.Model<ChallengeModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { challengeId } = request.body;
        const { challenge } = response.locals;
        response.locals.challenge = await challengeModel
            .findOneAndUpdate(
                { _id: challengeId },
                { $set: { numberOfMembers: challenge.members.length } },
                { new: true },
            )
            .lean();
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.IncreaseNumberOfMembersInChallengeMiddleware, err));
    }
};

export const increaseNumberOfMembersInChallengeMiddleware = getIncreaseNumberOfMembersInChallengeMiddleware(
    challengeModel,
);

export const getCreateChallengeStreakMiddleware = (challengeStreak: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challenge: Challenge = response.locals.challenge;
        const { timezone } = response.locals;
        const { userId } = request.body;
        const newChallengeStreak = new challengeStreak({
            userId,
            challengeId: challenge._id,
            timezone,
        });
        response.locals.savedChallengeStreak = await newChallengeStreak.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateChallengeStreakFromRequestMiddleware, err));
    }
};

export const createChallengeStreakMiddleware = getCreateChallengeStreakMiddleware(challengeStreakModel);

export const sendFormattedChallengeStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { savedChallengeStreak } = response.locals;
        response.status(ResponseCodes.created).send(savedChallengeStreak);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedChallengeStreakMiddleware, err));
    }
};

export const getCreateJoinChallengeActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.savedChallengeStreak;
        const challenge: Challenge = response.locals.challenge;
        const joinChallengeActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.joinedChallenge,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            challengeStreakId: challengeStreak._id,
            challengeId: challenge._id,
            challengeName: challenge.name,
        };
        await createActivityFeedItemFunction(joinChallengeActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreateJoinChallengeActivityFeedItemMiddleware, err));
    }
};

export const createJoinChallengeActivityFeedItemMiddleware = getCreateJoinChallengeActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const createChallengeStreakMiddlewares = [
    createChallengeStreakBodyValidationMiddleware,
    doesChallengeExistMiddleware,
    doesUserExistMiddleware,
    isUserAlreadyInChallengeMiddleware,
    addUserToChallengeMembersMiddleware,
    increaseNumberOfMembersInChallengeMiddleware,
    createChallengeStreakMiddleware,
    sendFormattedChallengeStreakMiddleware,
    createJoinChallengeActivityFeedItemMiddleware,
];
