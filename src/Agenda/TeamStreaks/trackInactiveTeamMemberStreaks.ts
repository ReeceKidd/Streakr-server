import streakoid from '../../streakoid';
import {
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    GroupMemberStreak,
} from '@streakoid/streakoid-sdk/lib';

export const trackInactiveTeamMemberStreaks = async (
    inactiveGroupMemberStreaks: GroupMemberStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveGroupMemberStreaks.map(async teamMemberStreak => {
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.inactiveStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
