import streakoid from '../../streakoid';
import {
    TeamMemberStreak,
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
} from '@streakoid/streakoid-sdk/lib';

export const trackMaintainedTeamMemberStreaks = async (
    maintainedTeamMemberStreaks: TeamMemberStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamMemberStreaks.map(async teamMemberStreak => {
            await streakoid.teamMemberStreaks.update({
                teamMemberStreakId: teamMemberStreak._id,
                updateData: {
                    completedToday: false,
                },
            });
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamMemberStreak._id,
                userId: teamMemberStreak.userId,
                streakType: StreakTypes.teamMember,
            });
        }),
    );
};
