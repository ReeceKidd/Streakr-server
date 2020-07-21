import * as Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';

import { getValidationErrorMessageSenderMiddleware } from '../../SharedMiddleware/validationErrorMessageSenderMiddleware';
import { teamMemberStreakModel, TeamMemberStreakModel } from '../../Models/TeamMemberStreak';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import {
    ActivityFeedItemType,
    RecoveredTeamMemberStreakActivityFeedItem,
} from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import { createActivityFeedItem } from '../../helpers/createActivityFeedItem';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import { createStreakTrackingEvent } from '../../helpers/createStreakTrackingEvent';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import {
    completeTeamMemberStreakTaskModel,
    CompleteTeamMemberStreakTaskModel,
} from '../../Models/CompleteTeamMemberStreakTask';
import { MomentHelpers } from '../../helpers/momentHelpers';
import { CoinTransactionHelpers } from '../../helpers/CoinTransactionHelpers';
import { coinChargeValues } from '../../helpers/coinChargeValues';
import { CoinCharges } from '@streakoid/streakoid-models/lib/Types/CoinCharges';
import { RecoverTeamMemberStreakCharge } from '@streakoid/streakoid-models/lib/Models/CoinChargeTypes';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { teamStreakModel, TeamStreakModel } from '../../Models/TeamStreak';
import { UserModel, userModel } from '../../Models/User';
import { LongestTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamMemberStreak';

const teamMemberStreakParamsValidationSchema = {
    teamMemberStreakId: Joi.string().required(),
};

export const teamMemberStreakParamsValidationMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    Joi.validate(
        request.params,
        teamMemberStreakParamsValidationSchema,
        getValidationErrorMessageSenderMiddleware(request, response, next),
    );
};

export const getRetreiveTeamMemberStreakToRecoverMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const { teamMemberStreakId } = request.params;
        const teamMemberStreak = await teamMemberStreakModel.findById(teamMemberStreakId);
        if (!teamMemberStreak) {
            throw new CustomError(ErrorType.RecoverTeamMemberStreakTeamMemberStreakNotFound);
        }
        response.locals.teamMemberStreak = teamMemberStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetreiveTeamMemberStreakToRecoverMiddleware, err));
    }
};

export const retreiveTeamMemberStreakToRecoverMiddleware = getRetreiveTeamMemberStreakToRecoverMiddleware(
    teamMemberStreakModel,
);

export const getRetrieveTeamStreakToRecoverMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const teamStreak = await teamStreakModel.findById(teamMemberStreak.teamStreakId);
        if (!teamStreak) {
            throw new CustomError(ErrorType.RecoverTeamMemberStreakTeamStreakNotFound);
        }
        response.locals.teamStreak = teamStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RetrieveTeamStreakToRecoverMiddleware, err));
    }
};

export const retrieveTeamStreakToRecoverMiddleware = getRetrieveTeamStreakToRecoverMiddleware(teamStreakModel);

export const getChargeUserCoinsToRecoverTeamMemberStreakMiddleware = (
    chargeUserCoins: typeof CoinTransactionHelpers.chargeUsersCoins,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const coinsToCharge = coinChargeValues[CoinCharges.recoverTeamMemberStreak];
        if (user.coins < coinsToCharge) {
            throw new CustomError(ErrorType.RecoverTeamMemberStreakUserDoesNotHaveEnoughCoins);
        }
        const coinChargeType: RecoverTeamMemberStreakCharge = {
            coinChargeType: CoinCharges.recoverTeamMemberStreak,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
        };
        response.locals.user = await chargeUserCoins({ userId: user._id, coinsToCharge, coinChargeType });
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ChargeUserCoinsToRecoverTeamMemberStreakMiddleware, err));
    }
};

export const chargeUserCoinsToRecoverTeamMemberStreakMiddleware = getChargeUserCoinsToRecoverTeamMemberStreakMiddleware(
    CoinTransactionHelpers.chargeUsersCoins,
);

export const getRecoverTeamMemberStreakMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;

        const lostStreak = teamMemberStreak.pastStreaks.pop();

        if (!lostStreak) {
            throw new CustomError(ErrorType.RecoverTeamMemberStreakNoLostStreak);
        }
        const recoveredCurrentStreak: CurrentStreak = {
            startDate: lostStreak.startDate,
            numberOfDaysInARow: lostStreak.numberOfDaysInARow += 1,
        };

        const teamMemberStreakWithRestoredCurrentStreak = await teamMemberStreakModel.findByIdAndUpdate(
            teamMemberStreak._id,
            {
                $set: {
                    currentStreak: recoveredCurrentStreak,
                    pastStreaks: teamMemberStreak.pastStreaks,
                    active: true,
                    totalTimesTracked: teamMemberStreak.totalTimesTracked + 1,
                },
            },
            { new: true },
        );
        response.locals.teamMemberStreak = teamMemberStreakWithRestoredCurrentStreak;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RecoverTeamMemberStreakMiddleware, err));
    }
};

export const recoverTeamMemberStreakMiddleware = getRecoverTeamMemberStreakMiddleware(teamMemberStreakModel);

export const getShouldTeamStreakBeRecoveredMiddleware = (
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const teamMemberStreaks = await teamMemberStreakModel.find({
            _id: teamStreak.members.map(member => member.teamMemberStreakId),
        });
        const teamMembersWithInactiveStreaks = teamMemberStreaks.filter(
            teamMemberStreak => teamMemberStreak.active === false,
        );

        response.locals.teamStreakShouldBeRecovered = teamMembersWithInactiveStreaks.length === 0;
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.ShouldTeamStreakBeRecoveredMiddleware, err));
    }
};

export const shouldTeamStreakBeRecoveredMiddleware = getShouldTeamStreakBeRecoveredMiddleware(teamMemberStreakModel);

export const getRecoverTeamStreakMiddleware = (teamStreakModel: mongoose.Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const teamStreakShouldBeRecovered: boolean = response.locals.teamStreakShouldBeRecovered;
        if (teamStreakShouldBeRecovered) {
            const lostStreak = teamStreak.pastStreaks.pop();

            if (!lostStreak) {
                throw new CustomError(ErrorType.RecoverTeamStreakNoLostStreak);
            }
            const recoveredCurrentStreak: CurrentStreak = {
                startDate: lostStreak.startDate,
                numberOfDaysInARow: lostStreak.numberOfDaysInARow += 1,
            };

            const teamStreakWithRestoredCurrentStreak = await teamStreakModel.findByIdAndUpdate(
                teamStreak._id,
                {
                    $set: {
                        currentStreak: recoveredCurrentStreak,
                        pastStreaks: teamStreak.pastStreaks,
                        active: true,
                        totalTimesTracked: teamStreak.totalTimesTracked + 1,
                    },
                },
                { new: true },
            );
            response.locals.teamStreak = teamStreakWithRestoredCurrentStreak;
        }
        next();
    } catch (err) {
        if (err instanceof CustomError) next(err);
        else next(new CustomError(ErrorType.RecoverTeamStreakMiddleware, err));
    }
};

export const recoverTeamStreakMiddleware = getRecoverTeamStreakMiddleware(teamStreakModel);

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
                $inc: { totalStreakCompletes: 1 },
            },
            { new: true },
        );
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RecoverTeamMemberStreakIncreaseTotalStreakCompletesForUserMiddleware, err));
    }
};

export const increaseTotalStreakCompletesForUserMiddleware = getIncreaseTotalStreakCompletesForUserMiddleware(
    userModel,
);

export const getIncreaseLongestTeamMemberStreakForUserMiddleware = ({
    userModel,
}: {
    userModel: mongoose.Model<UserModel>;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        if (user.longestTeamMemberStreak.numberOfDays < teamMemberStreak.currentStreak.numberOfDaysInARow) {
            const longestTeamMemberStreak: LongestTeamMemberStreak = {
                teamMemberStreakId: teamMemberStreak._id,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(teamMemberStreak.createdAt),
            };
            response.locals.user = await userModel.findByIdAndUpdate(
                user._id,
                {
                    $set: { longestTeamMemberStreak },
                },
                { new: true },
            );
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForUserMiddleware, err));
    }
};

export const increaseLongestTeamMemberStreakForUserMiddleware = getIncreaseLongestTeamMemberStreakForUserMiddleware({
    userModel,
});

export const getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware = ({
    teamMemberStreakModel,
}: {
    teamMemberStreakModel: mongoose.Model<TeamMemberStreakModel>;
}) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        if (teamMemberStreak.longestTeamMemberStreak.numberOfDays < teamMemberStreak.currentStreak.numberOfDaysInARow) {
            const longestTeamMemberStreak: LongestTeamMemberStreak = {
                teamMemberStreakId: teamMemberStreak._id,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                numberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
                startDate: new Date(teamMemberStreak.createdAt),
            };
            response.locals.teamMemberStreak = await teamMemberStreakModel.findByIdAndUpdate(
                teamMemberStreak._id,
                {
                    $set: { longestTeamMemberStreak },
                },
                { new: true },
            );
        }
        next();
    } catch (err) {
        next(
            new CustomError(
                ErrorType.RecoverTeamMemberStreakIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
                err,
            ),
        );
    }
};

export const increaseLongestTeamMemberStreakForTeamMemberStreakMiddleware = getIncreaseLongestTeamMemberStreakForTeamMemberStreakMiddleware(
    {
        teamMemberStreakModel,
    },
);

export const getCreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware = (
    completeTeamMemberStreakTaskModel: mongoose.Model<CompleteTeamMemberStreakTaskModel>,
    getTaskCompleteTimeForYesterdayFunction: typeof MomentHelpers.getTaskCompleteTimeForYesterday,
    getTaskCompleteDayFunction: typeof MomentHelpers.getTaskCompleteDay,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        const taskCompleteTime = getTaskCompleteTimeForYesterdayFunction({ timezone: user.timezone });
        const taskCompleteDay = getTaskCompleteDayFunction({ taskCompleteTime });
        const completeTeamMemberStreakTask = new completeTeamMemberStreakTaskModel({
            userId: user._id,
            teamMemberStreakId: teamMemberStreak._id,
            taskCompleteTime: taskCompleteTime.toDate(),
            taskCompleteDay,
        });
        await completeTeamMemberStreakTask.save();
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware, err));
    }
};

export const createACompleteTeamMemberStreakTaskForPreviousDayMiddleware = getCreateACompleteTeamMemberStreakTaskForPreviousDayMiddleware(
    completeTeamMemberStreakTaskModel,
    MomentHelpers.getTaskCompleteTimeForYesterday,
    MomentHelpers.getTaskCompleteDay,
);

export const getCreateRecoveredTeamMemberStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;

        const recoveredTeamMemberStreakActivityFeedItem: RecoveredTeamMemberStreakActivityFeedItem = {
            activityFeedItemType: ActivityFeedItemTypes.recoveredTeamMemberStreak,
            userId: user._id,
            username: user.username,
            userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
            teamMemberStreakId: teamMemberStreak._id,
            teamStreakId: teamStreak._id,
            teamStreakName: teamStreak.streakName,
            streakNumberOfDays: teamMemberStreak.currentStreak.numberOfDaysInARow,
        };
        createActivityFeedItemFunction(recoveredTeamMemberStreakActivityFeedItem);
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRecoveredTeamMemberStreakActivityFeedItemMiddleware, err));
    }
};

export const createRecoveredTeamMemberStreakActivityFeedItemMiddleware = getCreateRecoveredTeamMemberStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateRecoveredTeamStreakActivityFeedItemMiddleware = (
    createActivityFeedItemFunction: typeof createActivityFeedItem,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const teamStreakShouldBeRecovered = response.locals.teamStreakShouldBeRecovered;
        if (teamStreakShouldBeRecovered) {
            const recoveredTeamStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.recoveredTeamStreak,
                userId: user._id,
                username: user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak.streakName,
                streakNumberOfDays: teamStreak.currentStreak.numberOfDaysInARow,
            };
            createActivityFeedItemFunction(recoveredTeamStreakActivityFeedItem);
        }

        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRecoveredTeamStreakActivityFeedItemMiddleware, err));
    }
};

export const createRecoveredTeamStreakActivityFeedItemMiddleware = getCreateRecoveredTeamStreakActivityFeedItemMiddleware(
    createActivityFeedItem,
);

export const getCreateRecoveredTeamMemberStreakTrackingEventMiddleware = (
    createStreakTrackingEventFunction: typeof createStreakTrackingEvent,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamMemberStreak: TeamMemberStreak = response.locals.teamMemberStreak;
        await createStreakTrackingEventFunction({
            streakId: teamMemberStreak._id,
            userId: user._id,
            streakType: StreakTypes.teamMember,
            type: StreakTrackingEventTypes.recoveredStreak,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRecoveredTeamMemberStreakTrackingEventMiddleware, err));
    }
};

export const createRecoveredTeamMemberStreakTrackingEventMiddleware = getCreateRecoveredTeamMemberStreakTrackingEventMiddleware(
    createStreakTrackingEvent,
);

export const getCreateRecoveredTeamStreakTrackingEventMiddleware = (
    createStreakTrackingEventFunction: typeof createStreakTrackingEvent,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const user: User = response.locals.user;
        const teamStreak: TeamStreak = response.locals.teamStreak;
        const teamStreakShouldBeRecovered = response.locals.teamStreakShouldBeRecovered;
        if (teamStreakShouldBeRecovered) {
            await createStreakTrackingEventFunction({
                streakId: teamStreak._id,
                userId: user._id,
                streakType: StreakTypes.team,
                type: StreakTrackingEventTypes.recoveredStreak,
            });
        }
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CreateRecoveredTeamStreakTrackingEventMiddleware, err));
    }
};

export const createRecoveredTeamStreakTrackingEventMiddleware = getCreateRecoveredTeamStreakTrackingEventMiddleware(
    createStreakTrackingEvent,
);

export const sendRecoveredTeamMemberStreakMiddleware = (
    request: Request,
    response: Response,
    next: NextFunction,
): void => {
    try {
        const { teamMemberStreak } = response.locals;
        response.status(ResponseCodes.success).send(teamMemberStreak);
    } catch (err) {
        next(new CustomError(ErrorType.SendRecoveredTeamMemberStreakMiddleware, err));
    }
};

export const recoverTeamMemberStreakMiddlewares = [
    teamMemberStreakParamsValidationMiddleware,
    retreiveTeamMemberStreakToRecoverMiddleware,
    retrieveTeamStreakToRecoverMiddleware,
    chargeUserCoinsToRecoverTeamMemberStreakMiddleware,
    recoverTeamMemberStreakMiddleware,
    shouldTeamStreakBeRecoveredMiddleware,
    recoverTeamStreakMiddleware,
    increaseTotalStreakCompletesForUserMiddleware,
    increaseLongestTeamMemberStreakForUserMiddleware,
    increaseLongestTeamMemberStreakForTeamMemberStreakMiddleware,
    createACompleteTeamMemberStreakTaskForPreviousDayMiddleware,
    createRecoveredTeamMemberStreakActivityFeedItemMiddleware,
    createRecoveredTeamStreakActivityFeedItemMiddleware,
    createRecoveredTeamMemberStreakTrackingEventMiddleware,
    createRecoveredTeamStreakTrackingEventMiddleware,
    sendRecoveredTeamMemberStreakMiddleware,
];
