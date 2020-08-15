import { ChallengeStreak } from '@streakoid/streakoid-models/lib/Models/ChallengeStreak';
import { Challenge } from '@streakoid/streakoid-models/lib/Models/Challenge';
import { User } from '@streakoid/streakoid-models/lib/Models/User';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import VisibilityTypes from '@streakoid/streakoid-models/lib/Types/VisibilityTypes';

const currentStreak = {
    startDate: '',
    numberOfDaysInARow: 0,
    endDate: '',
};

export const getMockChallengeStreak = ({ challenge, user }: { challenge: Challenge; user: User }): ChallengeStreak => ({
    _id: 'challengeStreakId',
    challengeId: challenge._id,
    userId: user._id,
    username: user.username,
    userProfileImage: user.profileImages.originalImageUrl,
    challengeName: challenge.name,
    status: StreakStatus.live,
    completedToday: false,
    currentStreak,
    active: false,
    pastStreaks: [],
    totalTimesTracked: 0,
    visibility: VisibilityTypes.everyone,
    longestChallengeStreak: {
        challengeId: 'challengeId',
        challengeName: 'Writing',
        challengeStreakId: 'challengeStreakId',
        numberOfDays: 0,
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        streakType: StreakTypes.challenge,
    },
    timezone: 'Europe/London',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
