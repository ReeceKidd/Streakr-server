import { Request, Response, NextFunction } from 'express';
import moment from 'moment-timezone';
import * as Joi from 'joi';
import * as mongoose from 'mongoose';

import { ResponseCodes } from '../../Server/responseCodes';

import { userModel, UserModel } from '../../Models/User';
import { challengeStreakModel, ChallengeStreakModel } from '../../Models/ChallengeStreak';
import {
    incompleteChallengeStreakTaskModel,
    IncompleteChallengeStreakTaskModel,
} from '../../Models/IncompleteChallengeStreakTask';
import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { CustomError, ErrorType } from '../../customError';
import { ChallengeModel, challengeModel } from '../../../src/Models/Challenge';
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { CoinTransactionHelpers } from '../../helpers/CoinTransactionHelpers';
import { CoinSourcesTypes } from '@streakoid/streakoid-models/lib/Types/CoinSourcesTypes';
import { ChallengeStreakCompleteCoinSource } from '@streakoid/streakoid-models/lib/Models/CoinSources';
import { coinValues } from '../../helpers/coinValues';
import { OidXpTransactionHelpers } from '../../helpers/OidXpTransactionHelpers';
import { ChallengeStreakCompleteOidXpSource } from '@streakoid/streakoid-models/lib/Models/OidXpSources';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { oidXpValues } from '../../helpers/oidXpValues';

export const incompleteChallengeStreakTaskBodyValidationSchema = {
    userId: Joi.string().required(),
    challengeStreakId: Joi.string().required(),
};

export const incompleteChallengeStreakTaskBodyValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.body,
        incompleteChallengeStreakTaskBodyValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getChallengeStreakExistsMiddleware = (
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { challengeStreakId } = request.body;
        const challengeStreak = await challengeStreakModel.findOne({ _id: challengeStreakId });
        if (!challengeStreak) {
            throw new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskChallengeStreakDoesNotExist);
        }
        response.locals.challengeStreak = challengeStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskChallengeStreakExistsMiddleware, err));
    }
};

export const challengeStreakExistsMiddleware = getChallengeStreakExistsMiddleware(challengeStreakModel);

export const ensureChallengeStreakTaskHasBeenCompletedTodayMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        if (!challengeStreak.completedToday) {
            throw new CustomError(ErrorType.ChallengeStreakHasNotBeenCompletedToday);
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.EnsureChallengeStreakTaskHasBeenCompletedTodayMiddleware, err));
    }
};

export const getResetStreakStartDateMiddleware = (challengeStreakModel: mongoose.Model<ChallengeStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        if (challengeStreak.currentStreak.numberOfDaysInARow === 1) {
            response.locals.challengeStreak = await challengeStreakModel
                .findByIdAndUpdate(
                    challengeStreak._id,
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
        next(new CustomError(ErrorType.ResetChallengeStreakStartDateMiddleware, err));
    }
};

export const resetStreakStartDateMiddleware = getResetStreakStartDateMiddleware(challengeStreakModel);

export const getRetrieveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        const user = await userModel.findOne({ _id: userId }).lean();
        if (!user) {
            throw new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskUserDoesNotExist);
        }
        response.locals.user = user;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskRetrieveUserMiddleware, err));
    }
};

export const retrieveUserMiddleware = getRetrieveUserMiddleware(userModel);

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
        next(new CustomError(ErrorType.SetChallengeTaskIncompleteTimeMiddleware, err));
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
        next(new CustomError(ErrorType.SetDayChallengeTaskWasIncompletedMiddleware, err));
    }
};

export const dayFormat = 'YYYY-MM-DD';

export const setDayTaskWasIncompletedMiddleware = getSetDayTaskWasIncompletedMiddleware(dayFormat);

export const getSaveTaskIncompleteMiddleware = (
    incompleteChallengeStreakTaskModel: mongoose.Model<IncompleteChallengeStreakTaskModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, challengeStreakId } = request.body;
        const { taskIncompleteTime, taskIncompleteDay } = response.locals;
        const incompleteChallengeStreakTask = new incompleteChallengeStreakTaskModel({
            userId,
            challengeStreakId,
            taskIncompleteTime: taskIncompleteTime.toDate(),
            taskIncompleteDay,
        });
        response.locals.incompleteChallengeStreakTask = await incompleteChallengeStreakTask.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SaveChallengeTaskIncompleteMiddleware, err));
    }
};

export const saveTaskIncompleteMiddleware = getSaveTaskIncompleteMiddleware(incompleteChallengeStreakTaskModel);

export const getIncompleteChallengeStreakMiddleware = (
    challengeStreakModel: mongoose.Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        if (challengeStreak.currentStreak.numberOfDaysInARow !== 0) {
            await challengeStreakModel.updateOne(
                { _id: challengeStreak._id },
                {
                    completedToday: false,
                    $inc: { 'currentStreak.numberOfDaysInARow': -1 },
                    active: false,
                },
            );
        } else {
            await challengeStreakModel.updateOne(
                { _id: challengeStreak._id },
                {
                    completedToday: false,
                    'currentStreak.numberOfDaysInARow': 0,
                    active: false,
                },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.IncompleteChallengeStreakMiddleware, err));
    }
};

export const incompleteChallengeStreakMiddleware = getIncompleteChallengeStreakMiddleware(challengeStreakModel);

export const getDecreaseTotalStreakCompletesForUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { userId } = request.body;
        response.locals.user = await userModel.findByIdAndUpdate(
            userId,
            {
                $inc: { totalStreakCompletes: -1 },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(
            new CustomError(ErrorType.IncompleteChallengeStreakTaskDecreaseTotalStreakCompletesForUserMiddleware, err),
        );
    }
};

export const decreaseTotalStreakCompletesForUserMiddleware = getDecreaseTotalStreakCompletesForUserMiddleware(
    userModel,
);

export const getRetrieveChallengeMiddleware = (challengeModel: mongoose.Model<ChallengeModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const challenge = await challengeModel.findOne({ _id: challengeStreak.challengeId }).lean();
        if (!challenge) {
            throw new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskChallengeDoesNotExist);
        }
        response.locals.challenge = challenge;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.CreateIncompleteChallengeStreakTaskRetrieveChallengeMiddleware, err));
    }
};

export const retrieveChallengeMiddleware = getRetrieveChallengeMiddleware(challengeModel);

export const getDecreaseTotalTimesTrackedForChallengeStreakMiddleware = (
    challengeStreak: typeof challengeStreakModel,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { challengeStreakId } = request.body;
        response.locals.challengeStreak = await challengeStreak.findByIdAndUpdate(
            challengeStreakId,
            {
                $inc: { totalTimesTracked: -1 },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.DecreaseTotalTimesTrackedForChallengeStreakMiddleware, err));
    }
};

export const decreaseTotalTimesTrackedForChallengeStreakMiddleware = getDecreaseTotalTimesTrackedForChallengeStreakMiddleware(
    challengeStreakModel,
);

export const getChargeCoinsToUserForIncompletingChallengeStreakMiddleware = (
    chargeUserCoins: typeof CoinTransactionHelpers.chargeUsersCoins,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, challengeStreakId } = request.body;
        const challenge: Challenge = response.locals.challenge;
        const source: ChallengeStreakCompleteCoinSource = {
            coinSourceType: CoinSourcesTypes.challengeStreakComplete,
            challengeId: challenge._id,
            challengeName: challenge.name,
            challengeStreakId,
        };
        const coins = coinValues[CoinSourcesTypes.challengeStreakComplete];
        response.locals.user = await chargeUserCoins({
            userId,
            source,
            coins,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.ChargeCoinsToUserForIncompletingChallengeStreakMiddleware, err));
    }
};

export const chargeCoinsToUserForIncompletingChallengeStreakMiddleware = getChargeCoinsToUserForIncompletingChallengeStreakMiddleware(
    CoinTransactionHelpers.chargeUsersCoins,
);

export const getChargeOidXpToUserForIncompletingChallengeStreakMiddleware = (
    chargeUserOidXp: typeof OidXpTransactionHelpers.chargeUserOidXp,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, challengeStreakId } = request.body;
        const challenge: Challenge = response.locals.challenge;
        const source: ChallengeStreakCompleteOidXpSource = {
            oidXpSourceType: OidXpSourcesTypes.challengeStreakComplete,
            challengeId: challenge._id,
            challengeName: challenge.name,
            challengeStreakId,
        };
        response.locals.user = await chargeUserOidXp({
            userId,
            source,
            oidXp: oidXpValues[OidXpSourcesTypes.challengeStreakComplete],
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.ChargeOidXpToUserForIncompletingChallengeStreakMiddleware, err));
    }
};

export const chargeOidXpToUserForIncompletingChallengeStreakMiddleware = getChargeOidXpToUserForIncompletingChallengeStreakMiddleware(
    OidXpTransactionHelpers.chargeUserOidXp,
);

export const getSendTaskIncompleteResponseMiddleware = (resourceCreatedResponseCode: number) => (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { incompleteChallengeStreakTask } = response.locals;
        response.status(resourceCreatedResponseCode).send(incompleteChallengeStreakTask);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.SendChallengeTaskIncompleteResponseMiddleware, err));
    }
};

export const sendTaskIncompleteResponseMiddleware = getSendTaskIncompleteResponseMiddleware(ResponseCodes.created);

export const getCreateIncompleteChallengeStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const challengeStreak: ChallengeStreak = response.locals.challengeStreak;
        const challenge: Challenge = response.locals.challenge;
        const incompletedChallengeStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.incompletedChallengeStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            challengeStreakId: challengeStreak._id,
            challengeId: challengeStreak.challengeId,
            challengeName: challenge && challenge.name,
        };
        createActivityFeedItemFunction(incompletedChallengeStreakActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteChallengeStreakActivityFeedItemMiddleware, err));
    }
};

export const createIncompleteChallengeStreakActivityFeedItemMiddleware = getCreateIncompleteChallengeStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const createIncompleteChallengeStreakTaskMiddlewares = [
    incompleteChallengeStreakTaskBodyValidationMiddleware,
    challengeStreakExistsMiddleware,
    ensureChallengeStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    retrieveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    saveTaskIncompleteMiddleware,
    incompleteChallengeStreakMiddleware,
    decreaseTotalStreakCompletesForUserMiddleware,
    retrieveChallengeMiddleware,
    decreaseTotalTimesTrackedForChallengeStreakMiddleware,
    chargeCoinsToUserForIncompletingChallengeStreakMiddleware,
    chargeOidXpToUserForIncompletingChallengeStreakMiddleware,
    sendTaskIncompleteResponseMiddleware,
    createIncompleteChallengeStreakActivityFeedItemMiddleware,
];
