import { Request, Response } from 'express';

import { userModel } from '../Models/User';
import { achievementModel } from '../Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
    const users = await userModel.find({ username: 'reece' });
    console.log('Users', users);
    await Promise.all(
        users.map(async user => {
            if (user.coins >= 100) {
                const oneHundredCoinAchievement = await achievementModel.findOne({
                    achievementType: AchievementTypes.oneHundredCoins,
                });

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { achievements: oneHundredCoinAchievement },
                });
            }
            if (user.coins >= 250) {
                const coinAchievement = await achievementModel.findOne({
                    achievementType: AchievementTypes.twoHundredAndFiftyCoins,
                });

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { achievements: coinAchievement },
                });
            }
            if (user.coins >= 500) {
                const coinAchievement = await achievementModel.findOne({
                    achievementType: AchievementTypes.fiveHundredCoins,
                });

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { achievements: coinAchievement },
                });
            }
            if (user.coins >= 1000) {
                const coinAchievement = await achievementModel.findOne({
                    achievementType: AchievementTypes.oneThousandCoins,
                });

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { achievements: coinAchievement },
                });
            }
            if (user.coins >= 10000) {
                const coinAchievement = await achievementModel.findOne({
                    achievementType: AchievementTypes.tenThousandCoins,
                });

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { achievements: coinAchievement },
                });
            }
            if (user.coins >= 25000) {
                const coinAchievement = await achievementModel.findOne({
                    achievementType: AchievementTypes.twentyFiveThousandCoins,
                });

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { achievements: coinAchievement },
                });
            }
            if (user.coins >= 50000) {
                const coinAchievement = await achievementModel.findOne({
                    achievementType: AchievementTypes.fiftyThousandCoins,
                });

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { achievements: coinAchievement },
                });
            }
            if (user.coins >= 100000) {
                const coinAchievement = await achievementModel.findOne({
                    achievementType: AchievementTypes.oneHundredThousandCoins,
                });

                await userModel.findByIdAndUpdate(user._id, {
                    $addToSet: { achievements: coinAchievement },
                });
            }
            return user;
        }),
    );

    response.send('Success');
};

export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
