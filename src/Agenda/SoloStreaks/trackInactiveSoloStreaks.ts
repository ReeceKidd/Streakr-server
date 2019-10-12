import streakoid from '../../streakoid';
import { SoloStreak, StreakTrackingEvent, StreakTrackingEventTypes, StreakTypes } from '@streakoid/streakoid-sdk/lib';

export const trackInactiveSoloStreaks = async (inactiveSoloStreaks: SoloStreak[]): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveSoloStreaks.map(async soloStreak => {
            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventTypes.inactiveStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
                streakType: StreakTypes.solo,
            });
        }),
    );
};
