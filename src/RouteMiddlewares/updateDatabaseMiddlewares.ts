import { Request, Response } from 'express';

import { teamMemberStreakModel } from '../Models/TeamMemberStreak';
import { userModel } from '../Models/User';

export const updateDatabaseMiddleware = async (request: Request, response: Response): Promise<void> => {
    const teamMemberStreaks = await teamMemberStreakModel.find({});
    await Promise.all(
        teamMemberStreaks.map(async teamMemberStreak => {
            const user = await userModel.findById(teamMemberStreak.userId);
            return teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, {
                $set: {
                    userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                    username: user && user.username,
                },
            });
        }),
    );

    response.send('Success');
};

export const updateDatabaseMiddlewares = [updateDatabaseMiddleware];
