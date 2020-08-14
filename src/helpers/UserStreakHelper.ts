import { soloStreakModel } from '../Models/SoloStreak';
import { challengeStreakModel } from '../Models/ChallengeStreak';
import { teamMemberStreakModel } from '../Models/TeamMemberStreak';
import { LongestCurrentStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentStreak';
import { userModel } from '../Models/User';
import { teamStreakModel } from '../Models/TeamStreak';
import { LongestCurrentSoloStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentSoloStreak';
import { LongestCurrentTeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentTeamMemberStreak';
import { LongestCurrentChallengeStreak } from '@streakoid/streakoid-models/lib/Models/LongestCurrentChallengeStreak';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

const updateUsersLongestCurrentStreak = async ({ userId }: { userId: string }): Promise<void> => {
    const activeSoloStreaks = await soloStreakModel.find({ userId, active: true });
    const soloStreaksNumberOfDays = activeSoloStreaks.map(soloStreak => soloStreak.currentStreak.numberOfDaysInARow);
    const longestSoloStreakNumberOfDays = Math.max(...soloStreaksNumberOfDays);
    const longestSoloStreak = activeSoloStreaks.find(
        soloStreak => soloStreak.currentStreak.numberOfDaysInARow === longestSoloStreakNumberOfDays,
    );
    const longestCurrentSoloStreak: LongestCurrentSoloStreak = {
        soloStreakId: longestSoloStreak && longestSoloStreak._id,
        soloStreakName: (longestSoloStreak && longestSoloStreak.streakName) || '',
        numberOfDays: (longestSoloStreak && longestSoloStreak.currentStreak.numberOfDaysInARow) || 0,
        startDate:
            (longestSoloStreak && longestSoloStreak.currentStreak && longestSoloStreak.currentStreak.startDate) ||
            new Date().toString(),
        streakType: StreakTypes.solo,
    };

    const activeChallengeStreaks = await challengeStreakModel.find({ userId, active: true });
    const challengeStreaksNumberOfDays = activeChallengeStreaks.map(
        challengeStreak => challengeStreak.currentStreak.numberOfDaysInARow,
    );
    const longestChallengeStreakNumberOfDays = Math.max(...challengeStreaksNumberOfDays);
    const longestChallengeStreak = activeChallengeStreaks.find(
        challengeStreak => challengeStreak.currentStreak.numberOfDaysInARow === longestChallengeStreakNumberOfDays,
    );
    const longestCurrentChallengeStreak: LongestCurrentChallengeStreak = {
        challengeStreakId: longestChallengeStreak && longestChallengeStreak._id,
        challengeId: (longestChallengeStreak && longestChallengeStreak.challengeId) || '',
        challengeName: (longestChallengeStreak && longestChallengeStreak.challengeName) || '',
        numberOfDays: (longestChallengeStreak && longestChallengeStreak.currentStreak.numberOfDaysInARow) || 0,
        startDate:
            (longestChallengeStreak &&
                longestChallengeStreak.currentStreak &&
                longestChallengeStreak.currentStreak.startDate) ||
            new Date().toString(),
        streakType: StreakTypes.challenge,
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

    const longestCurrentTeamMemberStreak: LongestCurrentTeamMemberStreak = {
        teamMemberStreakId: longestTeamMemberStreak && longestTeamMemberStreak._id,
        teamStreakId: (longestTeamMemberStreak && longestTeamMemberStreak.teamStreakId) || '',
        teamStreakName: (teamStreak && teamStreak.streakName) || '',
        numberOfDays: (longestTeamMemberStreak && longestTeamMemberStreak.currentStreak.numberOfDaysInARow) || 0,
        startDate:
            (longestTeamMemberStreak &&
                longestTeamMemberStreak.currentStreak &&
                longestTeamMemberStreak.currentStreak.startDate) ||
            new Date().toString(),
        streakType: StreakTypes.teamMember,
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
