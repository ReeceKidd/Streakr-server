import streakoid from '../../streakoid';
import { StreakTrackingEvent, StreakTrackingEventTypes, StreakTypes, TeamStreak } from '@streakoid/streakoid-sdk/lib';

export const trackInactiveTeamStreaks = async (inactiveTeamStreaks: TeamStreak[]): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveTeamStreaks.map(async teamStreak => {
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.inactiveStreak,
                streakId: teamStreak._id,
                streakType: StreakTypes.team,
            });
        }),
    );
};
