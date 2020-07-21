import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';

const currentStreak = {
    startDate: '',
    numberOfDaysInARow: 0,
    endDate: '',
};

export const getMockTeamStreak = ({ creatorId }: { creatorId: string }): TeamStreak => ({
    _id: 'teamStreakId',
    streakName: 'Duolingo',
    status: StreakStatus.live,
    members: [{ memberId: creatorId, teamMemberStreakId: 'teamMemberStreakId' }],
    currentStreak,
    completedToday: false,
    active: false,
    pastStreaks: [],
    creatorId: creatorId,
    totalTimesTracked: 0,
    longestTeamStreak: {
        teamStreakId: 'teamStreakId',
        members: [],
        numberOfDays: 0,
        startDate: new Date(),
        endDate: new Date(),
        teamStreakName: 'Yoga',
    },
    timezone: 'Europe/London',
    inviteKey: '123456',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
