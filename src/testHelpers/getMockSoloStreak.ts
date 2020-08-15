import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import VisibilityTypes from '@streakoid/streakoid-models/lib/Types/VisibilityTypes';

const currentStreak = {
    startDate: '',
    numberOfDaysInARow: 0,
    endDate: '',
};

export const getMockSoloStreak = ({ userId }: { userId: string }): SoloStreak => ({
    _id: 'soloStreakId',
    streakName: 'Reading',
    userId,
    status: StreakStatus.live,
    completedToday: false,
    currentStreak,
    active: false,
    pastStreaks: [],
    totalTimesTracked: 0,
    visibility: VisibilityTypes.everyone,
    longestSoloStreak: {
        soloStreakId: 'soloStreakId',
        soloStreakName: 'Reading',
        numberOfDays: 0,
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        streakType: StreakTypes.solo,
    },
    timezone: 'Europe/London',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
