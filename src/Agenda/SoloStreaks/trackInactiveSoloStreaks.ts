import streakoid from '../../streakoid';
import { SoloStreak, StreakTrackingEvent } from '@streakoid/streakoid-sdk/lib';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';

export const trackInactiveSoloStreaks = async (inactiveSoloStreaks: SoloStreak[]): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveSoloStreaks.map(async soloStreak => {
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventType.InactiveStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
            });
        }),
    );
};
