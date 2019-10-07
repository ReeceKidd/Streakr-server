import streakoid from '../../streakoid';
import { SoloStreak, StreakTrackingEvent } from '@streakoid/streakoid-sdk/lib';
import StreakTrackingEventType from '@streakoid/streakoid-sdk/lib/streakTrackingEventType';
import Activity from '@streakoid/streakoid-sdk/lib/models/Activity';

export const trackInactiveSoloStreaks = async (
    inactiveSoloStreaks: SoloStreak[],
    currentLocalTime: string,
): Promise<StreakTrackingEvent[]> => {
    return Promise.all(
        inactiveSoloStreaks.map(async soloStreak => {
            const activity: Activity = {
                type: StreakTrackingEventType.InactiveStreak,
                time: currentLocalTime,
            };

            const updatedActivity: Activity[] = [...soloStreak.activity, activity];

            await streakoid.soloStreaks.update({
                soloStreakId: soloStreak._id,
                updateData: {
                    activity: updatedActivity,
                },
            });

            return streakoid.streakTrackingEvents.create({
                type: StreakTrackingEventType.InactiveStreak,
                streakId: soloStreak._id,
                userId: soloStreak.userId,
            });
        }),
    );
};
