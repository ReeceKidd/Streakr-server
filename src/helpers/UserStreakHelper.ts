import { soloStreakModel } from '../Models/SoloStreak';
import { challengeStreakModel } from '../Models/ChallengeStreak';
import { teamMemberStreakModel } from '../Models/TeamMemberStreak';
import { LongestCurrentStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentStreak';
import { LongestSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestSoloStreak';
import { LongestChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestChallengeStreak';
import { LongestTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestTeamMemberStreak';
import { userModel } from '../Models/User';
import { teamStreakModel } from '../Models/TeamStreak';

const updateUsersLongestCurrentStreak = async ({ userId }: { userId: string }): Promise<void> => {
    const activeSoloStreaks = await soloStreakModel.find({ userId, active: true });
    const soloStreaksNumberOfDays = activeSoloStreaks.map(soloStreak => soloStreak.currentStreak.numberOfDaysInARow);
    const longestSoloStreakNumberOfDays = Math.max(...soloStreaksNumberOfDays);
    const longestSoloStreak = activeSoloStreaks.find(
        soloStreak => soloStreak.currentStreak.numberOfDaysInARow === longestSoloStreakNumberOfDays,
    );
    const longestCurrentSoloStreak: LongestSoloStreak = {
        soloStreakId: longestSoloStreak && longestSoloStreak._id,
        soloStreakName: (longestSoloStreak && longestSoloStreak.streakName) || '',
        numberOfDays: (longestSoloStreak && longestSoloStreak.currentStreak.numberOfDaysInARow) || 0,
        startDate:
            (longestSoloStreak &&
                longestSoloStreak.currentStreak.startDate &&
                new Date(longestSoloStreak.currentStreak.startDate)) ||
            new Date(),
    };

    const activeChallengeStreaks = await challengeStreakModel.find({ userId, active: true });
    const challengeStreaksNumberOfDays = activeChallengeStreaks.map(
        challengeStreak => challengeStreak.currentStreak.numberOfDaysInARow,
    );
    const longestChallengeStreakNumberOfDays = Math.max(...challengeStreaksNumberOfDays);
    const longestChallengeStreak = activeChallengeStreaks.find(
        challengeStreak => challengeStreak.currentStreak.numberOfDaysInARow === longestChallengeStreakNumberOfDays,
    );
    const longestCurrentChallengeStreak: LongestChallengeStreak = {
        challengeStreakId: longestChallengeStreak && longestChallengeStreak._id,
        challengeId: (longestChallengeStreak && longestChallengeStreak.challengeId) || '',
        challengeName: (longestChallengeStreak && longestChallengeStreak.challengeName) || '',
        numberOfDays: (longestChallengeStreak && longestChallengeStreak.currentStreak.numberOfDaysInARow) || 0,
        startDate:
            (longestChallengeStreak &&
                longestChallengeStreak.currentStreak.startDate &&
                new Date(longestChallengeStreak.currentStreak.startDate)) ||
            new Date(),
    };

    const activeTeamMemberStreaks = await teamMemberStreakModel.find({ userId, active: true });

    const teamMemberStreaksNumberOfDays = activeTeamMemberStreaks.map(
        teamMemberStreak => teamMemberStreak.currentStreak.numberOfDaysInARow,
    );
    const longestTeamMemberStreakNumberOfDays = Math.max(...teamMemberStreaksNumberOfDays);
    const longestTeamMemberStreak = activeTeamMemberStreaks.find(
        teamMemberStreak => teamMemberStreak.currentStreak.numberOfDaysInARow === longestTeamMemberStreakNumberOfDays,
    );

    const teamStreak = await teamStreakModel.findOne({
        _id: longestTeamMemberStreak && longestTeamMemberStreak.teamStreakId,
    });

    const longestCurrentTeamMemberStreak: LongestTeamMemberStreak = {
        teamMemberStreakId: longestTeamMemberStreak && longestTeamMemberStreak._id,
        teamStreakId: (longestTeamMemberStreak && longestTeamMemberStreak.teamStreakId) || '',
        teamStreakName: (teamStreak && teamStreak.streakName) || '',
        numberOfDays: (longestTeamMemberStreak && longestTeamMemberStreak.currentStreak.numberOfDaysInARow) || 0,
        startDate:
            (longestTeamMemberStreak &&
                longestTeamMemberStreak.currentStreak.startDate &&
                new Date(longestTeamMemberStreak.currentStreak.startDate)) ||
            new Date(),
    };

    let longestCurrentStreak: LongestCurrentStreak = { numberOfDays: 0 };

    if (longestSoloStreak) {
        if (longestCurrentStreak.numberOfDays < longestCurrentSoloStreak.numberOfDays) {
            longestCurrentStreak = longestCurrentSoloStreak;
        }
    }

    if (longestCurrentChallengeStreak) {
        if (longestCurrentStreak.numberOfDays < longestCurrentChallengeStreak.numberOfDays) {
            longestCurrentStreak = longestCurrentChallengeStreak;
        }
    }

    if (longestTeamMemberStreak) {
        if (longestCurrentStreak.numberOfDays < longestCurrentTeamMemberStreak.numberOfDays) {
            longestCurrentStreak = longestCurrentTeamMemberStreak;
        }
    }

    await userModel.findByIdAndUpdate(userId, { $set: { longestCurrentStreak } });
};

export const UserStreakHelper = {
    updateUsersLongestCurrentStreak,
};
