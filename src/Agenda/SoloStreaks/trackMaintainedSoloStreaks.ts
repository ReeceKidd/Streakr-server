import streakoid from '../../streakoid';
import { SoloStreak, StreakTrackingEvent, StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';

export const trackMaintainedSoloStreaks = async (
    maintainedSoloStreaks: SoloStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedSoloStreaks.map(async soloStreak => {
            await streakoid.soloStreaks.update({
                soloStreakId: soloStreak._id,
                updateData: {
                    completedToday: false,
                },
            });
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.maintainedStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
                streakType: StreakTypes.solo,
            });
        }),
    );
};
