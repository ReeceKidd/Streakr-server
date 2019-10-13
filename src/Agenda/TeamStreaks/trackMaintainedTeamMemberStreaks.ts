import streakoid from '../../streakoid';
import {
    GroupMemberStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-sdk/lib';

export const trackMaintainedTeamMemberStreaks = async (
    maintainedGroupMemberStreaks: GroupMemberStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedGroupMemberStreaks.map(async groupMemberStreak => {
            await streakoid.groupMemberStreaks.update({
                groupMemberStreakId: groupMemberStreak._id,
                updateData: {
                    completedToday: false,
                },
            });
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: groupMemberStreak._id,
                userId: groupMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
