import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { UserModel, userModel } from '../../Models/User';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { ChallengeMember } from '@streakoid/streakoid-models/lib/Models/ChallengeMember';

const challengeParamsValidationSchema = {
    challengeId: Joi.string()
        .required()
        .length(24),
};

export const challengeParamsValidationMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    Joi.validate(
        request.params,
        challengeParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetrieveChallengeMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { challengeId } = request.params;
        const challenge = await challengeModel.findOne({ _id: challengeId }).lean();
        if (!challenge) {
            throw new CustomError(ErrorType.NoChallengeFound);
        }
        response.locals.challenge = challenge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetRetrieveChallengeMiddleware, err));
    }
};

export const retrieveChallengeMiddleware = getRetrieveChallengeMiddleware(challengeModel);

export const getRetrieveChallengeMemberInformationMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challenge: Challenge = response.locals.challenge;
        const members = await Promise.all(
            challenge.members.map(async member => {
                const memberInfo: UserModel | null = await userModel.findById(member);
                if (!memberInfo) return null;
                const challengeMember: ChallengeMember = {
                    username: memberInfo.username,
                    userId: memberInfo._id,
                    profileImage: memberInfo.profileImages.originalImageUrl,
                };
                return challengeMember;
            }),
        );
        response.locals.challenge = {
            ...challenge,
            members: members.filter(member => member !== null),
        };
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.GetChallengeMemberInformationMiddleware, err));
    }
};

export const retrieveChallengeMemberInformationMiddleware = getRetrieveChallengeMemberInformationMiddleware(userModel);

export const sendChallengeMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const { challenge } = response.locals;
        response.status(ResponseCodes.success).send(challenge);
    } catch (err) {
        next(new CustomError(ErrorType.SendChallengeMiddleware, err));
    }
};

export const getOneChallengeMiddlewares = [
    challengeParamsValidationMiddleware,
    retrieveChallengeMiddleware,
    retrieveChallengeMemberInformationMiddleware,
    sendChallengeMiddleware,
];
