import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import TeamVisibilityTypes from '@streakoid/streakoid-models/lib/Types/TeamVisibilityTypes';

const currentStreak = {
    startDate: '',
    numberOfDaysInARow: 0,
    endDate: '',
};

export const getMockTeamMemberStreak = ({
    teamStreakId,
    userId,
}: {
    teamStreakId: string;
    userId: string;
}): TeamMemberStreak => ({
    _id: 'teamMemberStreakId',
    teamStreakId,
    streakName: 'Running',
    currentStreak,
    status: StreakStatus.live,
    completedToday: false,
    active: false,
    pastStreaks: [],
    totalTimesTracked: 0,
    visibility: TeamVisibilityTypes.everyone,
    longestTeamMemberStreak: {
        teamStreakId: 'teamStreakId',
        teamMemberStreakId: 'teamMemberStreakId',
        teamStreakName: 'Running',
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        numberOfDays: 0,
        streakType: StreakTypes.teamMember,
    },
    userId,
    timezone: 'Europe/London',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
