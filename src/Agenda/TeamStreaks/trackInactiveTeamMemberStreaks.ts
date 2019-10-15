import streakoid from '../../streakoid';
import {
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    TeamMemberStreak,
} from '@streakoid/streakoid-sdk/lib';

export const trackInactiveTeamMemberStreaks = async (
    inactiveTeamMemberStreaks: TeamMemberStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveTeamMemberStreaks.map(async teamMemberStreak => {
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.inactiveStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
