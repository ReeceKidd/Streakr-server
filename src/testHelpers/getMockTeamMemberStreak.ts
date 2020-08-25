import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import StreakStatus from '@streakoid/streakoid-models/lib/Types/StreakStatus';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';
import TeamVisibilityTypes from '@streakoid/streakoid-models/lib/Types/TeamVisibilityTypes';
import { TeamStreak } from '@streakoid/streakoid-models/lib/Models/TeamStreak';
import { User } from '@streakoid/streakoid-models/lib/Models/User';

const currentStreak = {
    startDate: '',
    numberOfDaysInARow: 0,
    endDate: '',
};

export const getMockTeamMemberStreak = ({
    teamStreak,
    user,
}: {
    teamStreak: TeamStreak;
    user: User;
}): TeamMemberStreak => ({
    _id: 'teamMemberStreakId',
    teamStreakId: teamStreak._id,
    streakName: teamStreak.streakName,
    currentStreak,
    status: StreakStatus.live,
    completedToday: false,
    active: false,
    pastStreaks: [],
    totalTimesTracked: 0,
    visibility: TeamVisibilityTypes.everyone,
    longestTeamMemberStreak: {
        teamStreakId: teamStreak._id,
        teamMemberStreakId: 'teamMemberStreakId',
        teamStreakName: teamStreak.streakName,
        startDate: new Date().toString(),
        endDate: new Date().toString(),
        numberOfDays: 0,
        streakType: StreakTypes.teamMember,
    },
    userId: user._id,
    username: user.username,
    userProfileImage: user.profileImages.originalImageUrl,
    timezone: 'Europe/London',
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
});
