import streakoid from '../../streakoid';
import { TeamStreak, StreakTrackingEvent, StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';

export const trackMaintainedTeamStreaks = async (
    maintainedTeamStreaks: TeamStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedTeamStreaks.map(async teamStreak => {
            await streakoid.teamStreaks.update({
                teamStreakId: teamStreak._id,
                updateData: {
                    completedToday: false,
                },
            });
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
