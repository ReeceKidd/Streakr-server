import streakoid from '../../streakoid';
import { SoloStreak, StreakTrackingEvent } from '@streakoid/streakoid-sdk/lib';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';

export const trackMaintainedSoloStreaks = async (
    maintainedSoloStreaks: SoloStreak[],
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedSoloStreaks.map(async soloStreak => {
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventType.MaintainedStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
            });
        }),
    );
};
