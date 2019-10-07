import streakoid from '../../streakoid';
import { SoloStreak, StreakTrackingEvent } from '@streakoid/streakoid-sdk/lib';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';

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
                type: StreakTrackingEventType.MaintainedStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
            });
        }),
    );
};
