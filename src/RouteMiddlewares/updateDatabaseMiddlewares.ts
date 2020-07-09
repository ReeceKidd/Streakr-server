import { Request, Response } from 'express';

import { teamMemberStreakModel } from '../Models/TeamMemberStreak';
import { teamStreakModel } from '../Models/TeamStreak';

export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
    const teamStreaks = await teamStreakModel.find({});
    await Promise.all(
        teamStreaks.map(async teamStreak => {
            let totalTimesTracked = 0;
            await Promise.all(
                teamStreak.members.map(async member => {
                    const teamMemberStreak = await teamMemberStreakModel.findById(member.teamMemberStreakId);
                    if (teamMemberStreak) {
                        totalTimesTracked += teamMemberStreak.totalTimesTracked;
                    }
                    return member;
                }),
            );
            console.log('Total times tracked', totalTimesTracked);
            return teamStreakModel.findByIdAndUpdate(teamStreak._id, { $set: { totalTimesTracked } });
        }),
    );
    response.send('Success');
};

export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
