import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import VisibilityTypes from '@streakoid/streakoid-models/lib/Types/VisibilityTypes';

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
    visibility: VisibilityTypes.everyone,
    longestTeamStreak: {
        teamStreakId: 'teamStreakId',
        members: [],
        numberOfDays: 0,
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        teamStreakName: 'Yoga',
        streakType: StreakTypes.team,
    },
    timezone: 'Europe/London',
    inviteKey: '123456',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
