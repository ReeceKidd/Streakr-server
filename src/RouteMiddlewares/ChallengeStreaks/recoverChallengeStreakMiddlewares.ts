import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import {
    completeChallengeStreakTaskModel,
    CompleteChallengeStreakTaskModel,
} from '../../Models/CompleteChallengeStreakTask';
import { MomentHelpers } from '../../helpers/momentHelpers';
import { CoinTransactionHelpers } from '../../helpers/CoinTransactionHelpers';
import { coinChargeValues } from '../../helpers/coinChargeValues';
import { CoinCharges } from '@streakoid/streakoid-models/lib/Types/CoinCharges';
import { RecoverChallengeStreakCharge } from '@streakoid/streakoid-models/lib/Models/CoinChargeTypes';
import { UserModel, userModel } from '../../Models/User';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { LongestChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestChallengeStreak';
import { challengeModel, ChallengeModel } from '../../Models/Challenge';

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

export const getRetreiveChallengeStreakToRecoverMiddleware = (
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { challengeStreakId } = request.params;
        const challengeStreak = await challengeStreakModel.findById(challengeStreakId);
        if (!challengeStreak) {
            throw new CustomError(ErrorType.RecoverChallengeStreakChallengeStreakNotFound);
        }
        response.locals.challengeStreak = challengeStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveChallengeStreakToRecoverMiddleware, err));
    }
};

export const retreiveChallengeStreakToRecoverMiddleware = getRetreiveChallengeStreakToRecoverMiddleware(
    challengeStreakModel,
);

export const getRecoverChallengeStreakRetreiveChallengeMiddleware = (
    challengeModel: mongoose.Model<ChallengeModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;

        const challenge = await challengeModel.findById(challengeStreak.challengeId);
        if (!challenge) {
            throw new CustomError(ErrorType.RecoverChallengeStreakChallengeNotFound);
        }
        response.locals.challenge = challenge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RecoverChallengeStreakRetreiveChallengeMiddleware, err));
    }
};

export const recoverChallengeStreakRetreiveChallengeMiddleware = getRecoverChallengeStreakRetreiveChallengeMiddleware(
    challengeModel,
);

export const getChargeUserCoinsToRecoverChallengeStreakMiddleware = (
    chargeUserCoins: typeof CoinTransactionHelpers.chargeUsersCoins,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const coinsToCharge = coinChargeValues[CoinCharges.recoverChallengeStreak];
        if (user.coins < coinsToCharge) {
            throw new CustomError(ErrorType.RecoverChallengeStreakUserDoesNotHaveEnoughCoins);
        }
        const coinChargeType: RecoverChallengeStreakCharge = {
            coinChargeType: CoinCharges.recoverChallengeStreak,
            challengeStreakId: challengeStreak._id,
            challengeId: challengeStreak.challengeId,
            challengeName: challengeStreak.challengeName,
        };
        response.locals.user = await chargeUserCoins({ userId: user._id, coinsToCharge, coinChargeType });
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ChargeUserCoinsToRecoverChallengeStreakMiddleware, err));
    }
};

export const chargeUserCoinsToRecoverChallengeStreakMiddleware = getChargeUserCoinsToRecoverChallengeStreakMiddleware(
    CoinTransactionHelpers.chargeUsersCoins,
);

export const getReplaceChallengeStreakCurrentStreakWithLostStreak = (
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;

        const lostStreak = challengeStreak.pastStreaks.pop();

        if (!lostStreak) {
            throw new CustomError(ErrorType.RecoverChallengeStreakChallengeNoLostStreak);
        }
        const recoveredCurrentStreak: CurrentStreak = {
            startDate: lostStreak.startDate,
            numberOfDaysInARow: lostStreak.numberOfDaysInARow += 1,
        };

        const challengeStreakWithRestoredCurrentStreak = await challengeStreakModel.findByIdAndUpdate(
            challengeStreak._id,
            {
                $set: {
                    currentStreak: recoveredCurrentStreak,
                    pastStreaks: challengeStreak.pastStreaks,
                    active: true,
                    totalTimesTracked: challengeStreak.totalTimesTracked + 1,
                },
            },
            { new: true },
        );
        response.locals.challengeStreak = challengeStreakWithRestoredCurrentStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ReplaceChallengeStreakCurrentStreakWithLostStreak, err));
    }
};

export const replaceChallengeStreakCurrentStreakWithLostStreakMiddleware = getReplaceChallengeStreakCurrentStreakWithLostStreak(
    challengeStreakModel,
);

export const getIncreaseTotalStreakCompletesForUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const user: User = response.locals.user;

        response.locals.user = await userModel.findByIdAndUpdate(
            user._id,
            {
                $inc: {
                    totalStreakCompletes: 1,
                },
            },
            { new: true },
        );

        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RecoverChallengeStreakIncreaseTotalStreakCompletesForUserMiddleware, err));
    }
};

export const increaseTotalStreakCompletesForUserMiddleware = getIncreaseTotalStreakCompletesForUserMiddleware(
    userModel,
);

export const getIncreaseLongestChallengeStreakForUserMiddleware = ({
    userModel,
}: {
    userModel: mongoose.Model<UserModel>;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const challenge: Challenge = response.locals.challenge;

        if (user.longestChallengeStreak.numberOfDays < challengeStreak.currentStreak.numberOfDaysInARow) {
            const longestChallengeStreak: LongestChallengeStreak = {
                challengeStreakId: challengeStreak._id,
                challengeId: challenge._id,
                challengeName: challenge.name,
                numberOfDays: challengeStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(challengeStreak.createdAt),
            };
            response.locals.user = await userModel.findByIdAndUpdate(
                user._id,
                {
                    $set: { longestChallengeStreak },
                },
                { new: true },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RecoverChallengeStreakIncreaseLongestChallengeStreakForUserMiddleware, err));
    }
};

export const increaseLongestChallengeStreakForUserMiddleware = getIncreaseLongestChallengeStreakForUserMiddleware({
    userModel,
});

export const getIncreaseLongestChallengeStreakForChallengeStreakMiddleware = ({
    challengeStreakModel,
}: {
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const challenge: Challenge = response.locals.challenge;
        if (challengeStreak.longestChallengeStreak.numberOfDays < challengeStreak.currentStreak.numberOfDaysInARow) {
            const longestChallengeStreak: LongestChallengeStreak = {
                challengeStreakId: challengeStreak._id,
                challengeId: challenge._id,
                challengeName: challenge.name,
                numberOfDays: challengeStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(challengeStreak.createdAt),
            };
            response.locals.challengeStreak = await challengeStreakModel.findByIdAndUpdate(
                challengeStreak._id,
                {
                    $set: { longestChallengeStreak },
                },
                { new: true },
            );
        }
        next();
    } catch (err) {
        next(
            new CustomError(
                ErrorType.RecoverChallengeStreakIncreaseLongestChallengeStreakForChallengeStreakMiddleware,
                err,
            ),
        );
    }
};

export const increaseLongestChallengeStreakForChallengeStreakMiddleware = getIncreaseLongestChallengeStreakForChallengeStreakMiddleware(
    {
        challengeStreakModel,
    },
);

export const getCreateACompleteChallengeStreakTaskForPreviousDayMiddleware = (
    completeChallengeStreakTaskModel: mongoose.Model<CompleteChallengeStreakTaskModel>,
    getTaskCompleteTimeForYesterdayFunction: typeof MomentHelpers.getTaskCompleteTimeForYesterday,
    getTaskCompleteDayFunction: typeof MomentHelpers.getTaskCompleteDay,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const taskCompleteTime = getTaskCompleteTimeForYesterdayFunction({ timezone: user.timezone });
        const taskCompleteDay = getTaskCompleteDayFunction({ taskCompleteTime });
        const completeChallengeStreakTask = new completeChallengeStreakTaskModel({
            userId: user._id,
            challengeStreakId: challengeStreak._id,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
        });
        await completeChallengeStreakTask.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateACompleteChallengeStreakTaskForPreviousDayMiddleware, err));
    }
};

export const createACompleteChallengeStreakTaskForPreviousDayMiddleware = getCreateACompleteChallengeStreakTaskForPreviousDayMiddleware(
    completeChallengeStreakTaskModel,
    MomentHelpers.getTaskCompleteTimeForYesterday,
    MomentHelpers.getTaskCompleteDay,
);

export const getCreateRecoveredChallengeStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;

        const recoveredChallengeStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.recoveredChallengeStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            challengeStreakId: challengeStreak._id,
            challengeId: challengeStreak.challengeId,
            challengeName: challengeStreak.challengeName,
            streakNumberOfDays: challengeStreak.currentStreak.numberOfDaysInARow,
        };
        createActivityFeedItemFunction(recoveredChallengeStreakActivityFeedItem);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRecoveredChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createRecoveredChallengeStreakActivityFeedItemMiddleware = getCreateRecoveredChallengeStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateRecoveredChallengeStreakTrackingEventMiddleware = (
    createStreakTrackingEventFunction: typeof createStreakTrackingEvent,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        await createStreakTrackingEventFunction({
            streakId: challengeStreak._id,
            userId: user._id,
            streakType: StreakTypes.challenge,
            type: StreakTrackingEventTypes.recoveredStreak,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRecoveredChallengeStreakTrackingEventMiddleware, err));
    }
};

export const createRecoveredChallengeStreakTrackingEventMiddleware = getCreateRecoveredChallengeStreakTrackingEventMiddleware(
    createStreakTrackingEvent,
);

export const sendRecoveredChallengeStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { challengeStreak } = response.locals;
        response.status(ResponseCodes.success).send(challengeStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendRecoveredChallengeStreakMiddleware, err));
    }
};

export const recoverChallengeStreakMiddlewares = [
    challengeStreakParamsValidationMiddleware,
    retreiveChallengeStreakToRecoverMiddleware,
    recoverChallengeStreakRetreiveChallengeMiddleware,
    chargeUserCoinsToRecoverChallengeStreakMiddleware,
    replaceChallengeStreakCurrentStreakWithLostStreakMiddleware,
    increaseTotalStreakCompletesForUserMiddleware,
    increaseLongestChallengeStreakForUserMiddleware,
    increaseLongestChallengeStreakForChallengeStreakMiddleware,
    createACompleteChallengeStreakTaskForPreviousDayMiddleware,
    createRecoveredChallengeStreakActivityFeedItemMiddleware,
    createRecoveredChallengeStreakTrackingEventMiddleware,
    sendRecoveredChallengeStreakMiddleware,
];
