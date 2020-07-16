import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import { SoloStreak } from '@streakoid/streakoid-models/lib/Models/SoloStreak';

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
    longestSoloStreak: {
        soloStreakId: 'soloStreakId',
        soloStreakName: 'Reading',
        numberOfDays: 20,
        startDate: new Date(),
        endDate: new Date(),
    },
    timezone: 'Europe/London',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
