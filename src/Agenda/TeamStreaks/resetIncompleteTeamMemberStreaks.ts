import streakoid from '../../streakoid';
import { teamMemberStreakModel } from '../../../src/Models/TeamMemberStreak';
import { teamStreakModel } from '../../../src/Models/TeamStreak';
import { TeamMemberStreak } from '@streakoid/streakoid-models/lib/Models/TeamMemberStreak';
import { StreakTrackingEvent } from '@streakoid/streakoid-models/lib/Models/StreakTrackingEvent';
import { PastStreak } from '@streakoid/streakoid-models/lib/Models/PastStreak';
import { CurrentStreak } from '@streakoid/streakoid-models/lib/Models/CurrentStreak';
import { ActivityFeedItemType } from '@streakoid/streakoid-models/lib/Models/ActivityFeedItemType';
import ActivityFeedItemTypes from '@streakoid/streakoid-models/lib/Types/ActivityFeedItemTypes';
import StreakTrackingEventTypes from '@streakoid/streakoid-models/lib/Types/StreakTrackingEventTypes';
import StreakTypes from '@streakoid/streakoid-models/lib/Types/StreakTypes';

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
