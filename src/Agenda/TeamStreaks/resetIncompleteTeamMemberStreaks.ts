import {
    TeamMemberStreak,
    CurrentStreak,
    PastStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    ActivityFeedItemTypes,
    ActivityFeedItemType,
} from '@streakoid/streakoid-sdk/lib';
import streakoid from '../../streakoid';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';

export const resetIncompleteTeamMemberStreaks = async (
    incompleteTeamMemberStreaks: TeamMemberStreak[],
    endDate: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        incompleteTeamMemberStreaks.map(async teamMemberStreak => {
            const pastStreak: PastStreak = {
                endDate: endDate,
                startDate: teamMemberStreak.currentStreak.startDate || endDate,
                numberOfDaysInARow: teamMemberStreak.currentStreak.numberOfDaysInARow,
            };

            const pastStreaks: PastStreak[] = [...teamMemberStreak.pastStreaks, pastStreak];

            const currentStreak: CurrentStreak = {
                startDate: '',
                numberOfDaysInARow: 0,
            };

            await teamMemberStreakModel.findByIdAndUpdate(teamMemberStreak._id, {
                $set: {
                    currentStreak,
                    pastStreaks,
                    active: false,
                },
            });

            await teamStreakModel.findByIdAndUpdate(teamMemberStreak.teamStreakId, {
                $set: {
                    completedToday: false,
                },
            });

            const user = await streakoid.users.getOne(teamMemberStreak.userId);
            const teamStreak = await streakoid.teamStreaks.getOne(teamMemberStreak.teamStreakId);

            const lostTeamStreakActivityFeedItem: ActivityFeedItemType = {
                activityFeedItemType: ActivityFeedItemTypes.lostTeamStreak,
                userId: teamMemberStreak.userId,
                username: user && user.username,
                userProfileImage: user && user.profileImages && user.profileImages.originalImageUrl,
                teamStreakId: teamStreak._id,
                teamStreakName: teamStreak && teamStreak.streakName,
                numberOfDaysLost: pastStreak.numberOfDaysInARow,
            };

            await streakoid.activityFeedItems.create(lostTeamStreakActivityFeedItem);

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.lostStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
