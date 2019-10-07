import streakoid from '../../streakoid';
import { SoloStreak, StreakTrackingEvent } from '@streakoid/streakoid-sdk/lib';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';

export const trackMaintainedSoloStreaks = async (
    maintainedSoloStreaks: SoloStreak[],
    currentLocalTime: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        maintainedSoloStreaks.map(async soloStreak => {
            const updatedActivity = [
                ...soloStreak.activity,
                {
                    type: StreakTrackingEventType.MaintainedStreak,
                    time: currentLocalTime,
                },
            ];

            await streakoid.soloStreaks.update({
                soloStreakId: soloStreak._id,
                updateData: {
                    activity: updatedActivity,
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
