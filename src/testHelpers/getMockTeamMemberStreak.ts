import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

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
    currentStreak,
    status: StreakStatus.live,
    completedToday: false,
    active: false,
    pastStreaks: [],
    totalTimesTracked: 0,
    longestTeamMemberStreak: {
        teamStreakId: 'teamStreakId',
        teamMemberStreakId: 'teamMemberStreakId',
        teamStreakName: 'Running',
        startDate: new Date(),
        endDate: new Date(),
        numberOfDays: 0,
    },
    userId,
    timezone: 'Europe/London',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
