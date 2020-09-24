import { Request, Response } from 'express';

import { userModel } from '../Models/User';
import { achievementModel } from '../Models/Achievement';
import AchievementTypes from '@streakoid/streakoid-models/lib/Types/AchievementTypes';

export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
    const users = await userModel.find({ username: 'kaja' });

    await Promise.all(
        users.map(async user => {
            const oneHundredDayTeamStreakAchievement = await achievementModel.findOne({
                achievementType: AchievementTypes.oneHundredDayTeamStreak,
            });

            await userModel.findByIdAndUpdate(user._id, {
                $addToSet: { achievements: oneHundredDayTeamStreakAchievement },
            });

            return user;
        }),
    );

    response.send('Success');
};

export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
