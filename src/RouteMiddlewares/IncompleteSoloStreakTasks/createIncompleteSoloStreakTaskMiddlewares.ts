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
import { createActivityFeedItem } from '../../../src/helpers/createActivityFeedItem';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { SoloStreakCompleteCoinSource } from '@streakoid/streakoid-models/lib/Models/CoinSources';
import { CoinSourcesTypes } from '@streakoid/streakoid-models/lib/Types/CoinSourcesTypes';
import { coinValues } from '../../helpers/coinValues';
import { SoloStreakCompleteOidXpSource } from '@streakoid/streakoid-models/lib/Models/OidXpSources';
import { OidXpSourcesTypes } from '@streakoid/streakoid-models/lib/Types/OidXpSourcesTypes';
import { oidXpValues } from '../../helpers/oidXpValues';
import { CoinTransactionHelpers } from '../../helpers/CoinTransactionHelpers';
import { OidXpTransactionHelpers } from '../../helpers/OidXpTransactionHelpers';

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

export const getRetrieveUserMiddleware = (userModel: mongoose.Model<UserModel>) => async (
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
        else next(new CustomError(ErrorType.CreateIncompleteSoloStreakTaskRetrieveUserMiddleware, err));
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
        next(new CustomError(ErrorType.IncompleteSoloStreakTaskDecreaseTotalStreakCompletesForUserMiddleware, err));
    }
};

export const decreaseTotalStreakCompletesForUserMiddleware = getDecreaseTotalStreakCompletesForUserMiddleware(
    userModel,
);

export const getDecreaseTotalTimesTrackedForSoloStreakMiddleware = (soloStreak: typeof soloStreakModel) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const { soloStreakId } = request.body;
        response.locals.soloStreak = await soloStreak.findByIdAndUpdate(
            soloStreakId,
            {
                $inc: { totalTimesTracked: -1 },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.DecreaseTotalTimesTrackedForSoloStreakMiddleware, err));
    }
};

export const decreaseTotalTimesTrackedForSoloStreakMiddleware = getDecreaseTotalTimesTrackedForSoloStreakMiddleware(
    soloStreakModel,
);

export const getChargeCoinsToUserForIncompletingSoloStreakMiddleware = (
    chargeUserCoins: typeof CoinTransactionHelpers.chargeUsersCoins,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, soloStreakId } = request.body;
        const source: SoloStreakCompleteCoinSource = {
            coinSourceType: CoinSourcesTypes.soloStreakComplete,
            soloStreakId,
        };
        response.locals.user = await chargeUserCoins({
            userId,
            source,
            coins: coinValues[CoinSourcesTypes.soloStreakComplete],
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.ChargeCoinsToUserForIncompletingSoloStreakMiddleware, err));
    }
};

export const chargeCoinsToUserForIncompletingSoloStreakMiddleware = getChargeCoinsToUserForIncompletingSoloStreakMiddleware(
    CoinTransactionHelpers.chargeUsersCoins,
);

export const getChargeOidXpToUserForIncompletingSoloStreakMiddleware = (
    chargeUserOidXp: typeof OidXpTransactionHelpers.chargeUserOidXp,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { userId, soloStreakId } = request.body;
        const source: SoloStreakCompleteOidXpSource = {
            oidXpSourceType: OidXpSourcesTypes.soloStreakComplete,
            soloStreakId,
        };
        response.locals.user = await chargeUserOidXp({
            userId,
            source,
            oidXp: oidXpValues[OidXpSourcesTypes.soloStreakComplete],
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.ChargeOidXpToUserForIncompletingSoloStreakMiddleware, err));
    }
};

export const chargeOidXpToUserForIncompletingSoloStreakMiddleware = getChargeOidXpToUserForIncompletingSoloStreakMiddleware(
    OidXpTransactionHelpers.chargeUserOidXp,
);

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
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const soloStreak: SoloStreak = response.locals.soloStreak;
        const incompletedSoloStreakActivityFeedItem: ActivityFeedItemType = {
            activityFeedItemType: ActivityFeedItemTypes.incompletedSoloStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            soloStreakId: soloStreak._id,
            soloStreakName: soloStreak.streakName,
        };
        await createActivityFeedItemFunction(incompletedSoloStreakActivityFeedItem);
    } catch (err) {
        next(new CustomError(ErrorType.CreateIncompleteSoloStreakActivityFeedItemMiddleware, err));
    }
};

export const createIncompleteSoloStreakActivitFeedItemMiddleware = getCreateIncompleteSoloStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const createIncompleteSoloStreakTaskMiddlewares = [
    incompleteSoloStreakTaskBodyValidationMiddleware,
    soloStreakExistsMiddleware,
    ensureSoloStreakTaskHasBeenCompletedTodayMiddleware,
    resetStreakStartDateMiddleware,
    retrieveUserMiddleware,
    setTaskIncompleteTimeMiddleware,
    setDayTaskWasIncompletedMiddleware,
    createIncompleteSoloStreakTaskDefinitionMiddleware,
    saveTaskIncompleteMiddleware,
    incompleteSoloStreakMiddleware,
    decreaseTotalStreakCompletesForUserMiddleware,
    decreaseTotalTimesTrackedForSoloStreakMiddleware,
    chargeCoinsToUserForIncompletingSoloStreakMiddleware,
    chargeOidXpToUserForIncompletingSoloStreakMiddleware,
    sendTaskIncompleteResponseMiddleware,
    createIncompleteSoloStreakActivitFeedItemMiddleware,
];
