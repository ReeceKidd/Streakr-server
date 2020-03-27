import { Request, Response, NextFunction } from 'express';
import { ResponseCodes } from '../../Server/responseCodes';
import { CustomError, ErrorType } from '../../customError';
import { Model } from 'mongoose';
import { UserModel, userModel } from '../../Models/User';
import { SoloStreakModel, soloStreakModel } from '../../Models/SoloStreak';
import { TeamMemberStreakModel, teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { ChallengeStreakModel, challengeStreakModel } from '../../Models/ChallengeStreak';
import { TeamStreakModel, teamStreakModel } from '../../Models/TeamStreak';
import { StreakStatus, DatabaseStats } from '@streakoid/streakoid-sdk/lib';

export const getCountTotalUsersMiddleware = (userModel: Model<UserModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        response.locals.totalUsers = await userModel.count({});
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CountTotalUsersMiddleware, err));
    }
};

export const countTotalUsersMiddleware = getCountTotalUsersMiddleware(userModel);

export const getCountTotalLiveSoloStreaksMiddleware = (soloStreakModel: Model<SoloStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        response.locals.totalLiveSoloStreaks = await soloStreakModel.count({ status: StreakStatus.live });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CountTotalLiveSoloStreaksMiddleware, err));
    }
};

export const countTotalLiveSoloStreaksMiddleware = getCountTotalLiveSoloStreaksMiddleware(soloStreakModel);

export const getCountTotalLiveChallengeStreaksMiddleware = (
    challengeStreakModel: Model<ChallengeStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        response.locals.totalLiveChallengeStreaks = await challengeStreakModel.count({
            status: StreakStatus.live,
        });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CountTotalLiveChallengeStreaksMiddleware, err));
    }
};

export const countTotalLiveChallengeStreaksMiddleware = getCountTotalLiveChallengeStreaksMiddleware(
    challengeStreakModel,
);

export const getCountTotalLiveTeamStreaksMiddleware = (teamStreakModel: Model<TeamStreakModel>) => async (
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        response.locals.totalLiveTeamStreaks = await teamStreakModel.count({ status: StreakStatus.live });
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CountTotalLiveTeamStreaksMiddleware, err));
    }
};

export const countTotalLiveTeamStreaksMiddleware = getCountTotalLiveTeamStreaksMiddleware(teamStreakModel);

export const getCountTotalStreaksCreatedMiddleware = (
    soloStreakModel: Model<SoloStreakModel>,
    challengeStreakModel: Model<ChallengeStreakModel>,
    teamMemberStreakModel: Model<TeamMemberStreakModel>,
) => async (request: Request, response: Response, next: NextFunction): Promise<void> => {
    try {
        const totalSoloStreaks = await soloStreakModel.count({});
        const totalChallengeStreaks = await challengeStreakModel.count({});
        const totalTeamMemberStreaks = await teamMemberStreakModel.count({});
        response.locals.totalStreaks = totalSoloStreaks + totalChallengeStreaks + totalTeamMemberStreaks;
        next();
    } catch (err) {
        next(new CustomError(ErrorType.CountTotalStreaksCreatedMiddleware, err));
    }
};

export const countTotalStreaksCreatedMiddleware = getCountTotalStreaksCreatedMiddleware(
    soloStreakModel,
    challengeStreakModel,
    teamMemberStreakModel,
);

export const sendDatabaseStatsMiddleware = (request: Request, response: Response, next: NextFunction): void => {
    try {
        const {
            totalUsers,
            totalLiveSoloStreaks,
            totalLiveChallengeStreaks,
            totalLiveTeamStreaks,
            totalStreaks,
        } = response.locals;
        const databaseStats: DatabaseStats = {
            totalUsers,
            totalLiveSoloStreaks,
            totalLiveChallengeStreaks,
            totalLiveTeamStreaks,
            totalStreaks,
        };
        response.status(ResponseCodes.success).send(databaseStats);
    } catch (err) {
        next(new CustomError(ErrorType.SendDatabaseStatsMiddleware, err));
    }
};

export const getDatabaseStatsMiddlewares = [
    countTotalUsersMiddleware,
    countTotalLiveSoloStreaksMiddleware,
    countTotalLiveChallengeStreaksMiddleware,
    countTotalLiveTeamStreaksMiddleware,
    countTotalStreaksCreatedMiddleware,
    sendDatabaseStatsMiddleware,
];
