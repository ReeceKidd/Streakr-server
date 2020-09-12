import { Request, Response } from 'express';

import { teamMemberStreakModel } from '../Models/TeamMemberStreak';
import { teamStreakModel } from '../Models/TeamStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
    const teamMemberStreaks = await teamMemberStreakModel.find({});
    await Promise.all(
        teamMemberStreaks.map(async teamMemberStreak => {
            const teamStreak = await teamStreakModel.findById(teamMemberStreak.teamStreakId);
            return teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, {
                $set: {
                    status: (teamStreak && teamStreak.status) || StreakStatus.archived,
                },
            });
        }),
    );

    response.send('Success');
};

export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
