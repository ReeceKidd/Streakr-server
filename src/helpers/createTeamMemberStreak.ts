import { MongooseDocument } from 'mongoose';
import { teamMemberStreakModel } from '../Models/TeamMemberStreak';

export const createTeamMemberStreak = ({
    userId,
    teamStreakId,
    streakName,
    timezone,
    username,
    userProfileImage,
}: {
    userId: string;
    teamStreakId: string;
    streakName: string;
    timezone: string;
    username: string;
    userProfileImage: string;
}): Promise<MongooseDocument> => {
    const teamMemberStreak = new teamMemberStreakModel({
        userId,
        teamStreakId,
        streakName,
        timezone,
        username,
        userProfileImage,
    });
    return teamMemberStreak.save();
};
