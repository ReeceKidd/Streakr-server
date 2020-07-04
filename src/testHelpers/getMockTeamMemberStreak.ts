import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';

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
    completedToday: false,
    active: false,
    pastStreaks: [],
    totalTimesTracked: 0,
    userId,
    timezone: 'Europe/London',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
