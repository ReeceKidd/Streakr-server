import { Request, Response, NextFunction } from 'express';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';

import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';
import { UserModel, userModel } from '../../../src/Models/User';
import { User, Challenge } from '@streakoid/streakoid-sdk/lib';

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
            .findOneAndUpdate({ _id: challengeId }, { $push: { members: userId } })
            .lean();
        response.locals.challenge = challenge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.AddUserToChallengeMiddleware, err));
    }
};

export const addUserToChallengeMembersMiddleware = getAddUserToChallengeMembersMiddleware(challengeModel);

export const getAddChallengeBadgeToUserBadgesMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challenge: Challenge = response.locals.challenge;
        await userModel.findOneAndUpdate({ _id: user._id }, { $push: { badges: challenge.badgeId } });
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.AddChallengeBadgeToUserBadgesMiddleware, err));
    }
};

export const addChallengeBadgeToUserBadgesMiddleware = getAddChallengeBadgeToUserBadgesMiddleware(userModel);

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
            badgeId: challenge.badgeId,
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
    } catch (err) {
        next(new CustomError(ErrorType.SendFormattedChallengeStreakMiddleware, err));
    }
};

export const createChallengeStreakMiddlewares = [
    createChallengeStreakBodyValidationMiddleware,
    doesChallengeExistMiddleware,
    doesUserExistMiddleware,
    isUserAlreadyInChallengeMiddleware,
    addUserToChallengeMembersMiddleware,
    addChallengeBadgeToUserBadgesMiddleware,
    createChallengeStreakMiddleware,
    sendFormattedChallengeStreakMiddleware,
];
