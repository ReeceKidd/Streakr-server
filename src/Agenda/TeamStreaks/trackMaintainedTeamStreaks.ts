import streakoid from '../../streakoid';
import {
    StreakTrackingEvent,
    StreakTrackingEventTypes,
    StreakTypes,
    PopulatedTeamStreak,
} from '@streakoid/streakoid-sdk/lib';

export const trackMaintainedTeamStreaks = async (
    maintainedTeamStreaks: PopulatedTeamStreak[],
): Promise<StreakTrackingEvent[]> => {
    console.log('Entered track maintained team streaks');
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
